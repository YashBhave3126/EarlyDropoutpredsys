import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../db";
import { BCRYPT_ROUNDS } from "../config";
import { predictStudentRiskGemini } from "../services/ai.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const upsertStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
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

    // Check if the student already exists to decide create vs update
    const existing = await prisma.student.findUnique({ where: { rollNumber: studentData.rollNumber } });

    if (existing) {
      // Update — don't touch the password
      const result = await prisma.student.update({
        where: { rollNumber: studentData.rollNumber },
        data: enrichedStudent,
      });
      res.json({ success: true, student: result });
    } else {
      // Create — generate a random temporary password
      const tempPassword = crypto.randomBytes(6).toString("hex"); // 12-char random password
      const hashedPassword = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS);

      const result = await prisma.student.create({
        data: {
          ...enrichedStudent,
          password: hashedPassword,
        },
      });

      // Return the temp password so the admin can share it with the student
      res.json({ 
        success: true, 
        student: result, 
        tempPassword,
        message: `Student created. Temporary password: ${tempPassword} — please share this with the student securely.`
      });
    }
  } catch (err) {
    next(err);
  }
};

export const predictStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
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
  const { rollNumber } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { rollNumber } });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // onDelete: Cascade in Prisma schema automatically removes related interventions
    await prisma.student.delete({ where: { rollNumber } });

    res.json({ success: true, message: `Student ${rollNumber} deleted successfully` });
  } catch (err) {
    next(err);
  }
};
