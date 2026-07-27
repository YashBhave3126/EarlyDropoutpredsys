import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../db";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, role, rollNumber, password, name, department } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (role === "Faculty") {
      const existing = await prisma.faculty.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ success: false, error: "Email already registered" });
      
      await prisma.faculty.create({
        data: { email, password: hashedPassword, name, department }
      });
      return res.json({ success: true, message: "Faculty registered successfully" });
      
    } else if (role === "Student") {
      const existing = await prisma.student.findUnique({ where: { rollNumber } });
      if (existing) return res.status(400).json({ success: false, error: "Roll number already registered" });
      
      await prisma.student.create({
        data: {
          rollNumber, password: hashedPassword, name, department,
          semester: 1, attendance: 100, internalMarks: 100, semesterMarks: 10, assignmentsSubmitted: 0, assignmentsTotal: 10, backlogs: 0, practicalMarks: 100,
          socioeconomic: { familyIncome: "Medium", parentsEducation: "High School", distanceFromCollege: 10, transportation: "Public", internetAvailability: true, scholarship: false },
          behavioral: { studyHours: 10, extracurricular: false, healthIssues: false, counselingSessions: 0 },
          riskStatus: "Low", riskConfidence: 10, riskReasons: ["Newly registered student"], recommendations: []
        }
      });
      return res.json({ success: true, message: "Student registered successfully" });
    } else {
      return res.status(400).json({ success: false, error: "Cannot register as Administrator" });
    }
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, role, rollNumber, password } = req.body;
  let user: any = null;
  let dbPassword = "";

  try {
    if (role === "Administrator") {
      const admin = await prisma.admin.findUnique({ where: { email: email?.toLowerCase() || "" } });
      if (admin) {
        user = { name: admin.name, email: admin.email, role: "Administrator" };
        dbPassword = admin.password;
      }
    } else if (role === "Faculty") {
      const faculty = await prisma.faculty.findUnique({ where: { email: email?.toLowerCase() || "" } });
      if (faculty) {
        user = { name: faculty.name, email: faculty.email, role: "Faculty", department: faculty.department };
        dbPassword = faculty.password;
      }
    } else if (role === "Student") {
      const student = await prisma.student.findUnique({ where: { rollNumber: rollNumber || "" } });
      if (student) {
        user = { name: student.name, role: "Student", rollNumber: student.rollNumber };
        dbPassword = student.password;
      }
    }

    if (user && dbPassword) {
      const isMatch = await bcrypt.compare(password, dbPassword);
      if (isMatch) {
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, user, token });
      } else {
        return res.status(401).json({ success: false, error: "Invalid password" });
      }
    } else {
      return res.status(401).json({ success: false, error: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response) => {
  res.json({ success: true });
};
