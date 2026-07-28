import { Response, NextFunction } from "express";
import prisma from "../db";
import { AuthRequest } from "../middleware/auth.middleware";
import { isGeminiAvailable } from "../services/ai.service";
import { seedDatabase } from "../services/seed.service";

export const getState = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    // --- Pagination & Filter params ---
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const department = req.query.department as string | undefined;
    const riskStatus = req.query.riskStatus as string | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || "name";
    const sortOrder = (req.query.sortOrder as string) === "desc" ? "desc" : "asc";

    // --- Scope data by role ---
    const userRole = req.user?.role;

    // Build Prisma WHERE clause for students
    const studentWhere: any = {};
    if (department) studentWhere.department = department;
    if (riskStatus) studentWhere.riskStatus = riskStatus;
    if (search) {
      studentWhere.OR = [
        { name: { contains: search } },
        { rollNumber: { contains: search } },
      ];
    }

    // Students can only see their own record
    if (userRole === "Student") {
      studentWhere.rollNumber = req.user?.rollNumber;
    }

    // --- Paginated student query ---
    const totalStudents = await prisma.student.count({ where: studentWhere });
    const students = await prisma.student.findMany({
      where: studentWhere,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    // --- Interventions: scope by role ---
    let interventions;
    if (userRole === "Student") {
      // Students see only their own interventions
      interventions = await prisma.intervention.findMany({
        where: { rollNumber: req.user?.rollNumber },
        orderBy: { createdDate: 'desc' },
      });
    } else {
      interventions = await prisma.intervention.findMany({ orderBy: { createdDate: 'desc' } });
    }

    // --- Faculties: only visible to Admin/Faculty ---
    let faculties: any[] = [];
    if (userRole === "Administrator" || userRole === "Faculty") {
      const allFaculties = await prisma.faculty.findMany();
      faculties = allFaculties.map((f: any) => { const { password, ...rest } = f; return rest; });
    }
    
    res.json({
      students: students.map((s: any) => { const { password, ...rest } = s; return rest; }),
      interventions,
      faculties,
      currentUser: req.user || null,
      isGeminiActive: isGeminiAvailable,
      pagination: {
        page,
        limit,
        totalStudents,
        totalPages: Math.ceil(totalStudents / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const resetSystem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Atomic transaction — all tables cleared together or none
    await prisma.$transaction([
      prisma.intervention.deleteMany({}),
      prisma.student.deleteMany({}),
      prisma.faculty.deleteMany({}),
      prisma.admin.deleteMany({}),
    ]);
    
    await seedDatabase();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
