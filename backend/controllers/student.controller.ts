import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../db";
import { predictStudentRiskGemini } from "../services/ai.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const upsertStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  if (req.user?.role !== 'Administrator' && req.user?.role !== 'Faculty') {
    return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
  }
  const studentData = req.body;

  try {
    const prediction = await predictStudentRiskGemini(studentData);
    const enrichedStudent = {
      ...studentData,
      riskStatus: prediction.riskStatus,
      riskConfidence: prediction.riskConfidence,
      riskReasons: prediction.riskReasons,
      recommendations: prediction.recommendations,
    };

    const result = await prisma.student.upsert({
      where: { rollNumber: studentData.rollNumber },
      update: enrichedStudent,
      create: {
        ...enrichedStudent,
        password: await bcrypt.hash("password", 10), // Default pass
      },
    });

    res.json({ success: true, student: result });
  } catch (err) {
    next(err);
  }
};

export const predictStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  if (req.user?.role !== 'Administrator' && req.user?.role !== 'Faculty') {
    return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
  }
  const { rollNumber } = req.body;
  try {
    const student = await prisma.student.findUnique({ where: { rollNumber } });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const prediction = await predictStudentRiskGemini(student);
    
    const updated = await prisma.student.update({
      where: { rollNumber },
      data: {
        riskStatus: prediction.riskStatus,
        riskConfidence: prediction.riskConfidence,
        riskReasons: prediction.riskReasons,
        recommendations: prediction.recommendations,
      }
    });

    res.json({ success: true, student: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  if (req.user?.role !== 'Administrator') {
    return res.status(403).json({ error: "Forbidden: Only Administrators can delete students" });
  }
  const { rollNumber } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { rollNumber } });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete related interventions first (cascade)
    await prisma.intervention.deleteMany({ where: { rollNumber } });
    await prisma.student.delete({ where: { rollNumber } });

    res.json({ success: true, message: `Student ${rollNumber} deleted successfully` });
  } catch (err) {
    next(err);
  }
};
