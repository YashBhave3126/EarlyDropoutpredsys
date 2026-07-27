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

    // --- Build Prisma WHERE clause for students ---
    const studentWhere: any = {};
    if (department) studentWhere.department = department;
    if (riskStatus) studentWhere.riskStatus = riskStatus;
    if (search) {
      studentWhere.OR = [
        { name: { contains: search } },
        { rollNumber: { contains: search } },
      ];
    }

    // --- Paginated student query ---
    const totalStudents = await prisma.student.count({ where: studentWhere });
    const students = await prisma.student.findMany({
      where: studentWhere,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    // --- Interventions & Faculties (smaller datasets, no pagination needed) ---
    const interventions = await prisma.intervention.findMany({ orderBy: { createdDate: 'desc' } });
    const faculties = await prisma.faculty.findMany();
    
    res.json({
      students: students.map((s: any) => { const { password, ...rest } = s; return rest; }),
      interventions,
      faculties: faculties.map((f: any) => { const { password, ...rest } = f; return rest; }),
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
  if (req.user?.role !== 'Administrator') {
    return res.status(403).json({ error: "Forbidden: Only Administrators can reset the database" });
  }
  try {
    await prisma.intervention.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.faculty.deleteMany({});
    await prisma.admin.deleteMany({});
    await seedDatabase();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
