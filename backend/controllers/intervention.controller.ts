import { Response, NextFunction } from "express";
import prisma from "../db";
import { AuthRequest } from "../middleware/auth.middleware";
import { predictStudentRiskLocal } from "../services/ai.service";

export const createIntervention = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  const { rollNumber, type, remarks, followUpDate, facultyName } = req.body;
  
  try {
    const student = await prisma.student.findUnique({ where: { rollNumber } });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const parsedFollowUpDate = new Date(followUpDate);
    if (isNaN(parsedFollowUpDate.getTime())) {
      return res.status(400).json({ error: "Invalid follow-up date format" });
    }

    const newIntervention = await prisma.intervention.create({
      data: {
        rollNumber,
        studentName: student.name,
        type,
        createdDate: new Date(),
        remarks,
        status: "Pending",
        followUpDate: parsedFollowUpDate,
        improvementPercentage: 0,
        facultyName: facultyName || req.user?.name || "Unknown Faculty",
      }
    });

    res.json({ success: true, intervention: newIntervention });
  } catch (err) {
    next(err);
  }
};

export const updateIntervention = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params;
  const { status, remarks, improvementPercentage, followUpDate } = req.body;

  try {
    const item = await prisma.intervention.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ error: "Intervention not found" });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (remarks) updateData.remarks = remarks;
    if (followUpDate) {
      const parsedDate = new Date(followUpDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid follow-up date format" });
      }
      updateData.followUpDate = parsedDate;
    }
    if (improvementPercentage !== undefined) {
      updateData.improvementPercentage = Number(improvementPercentage);
    }

    const updatedIntervention = await prisma.intervention.update({
      where: { id },
      data: updateData
    });

    if (status === "Completed" && improvementPercentage !== undefined) {
      const student = await prisma.student.findUnique({ where: { rollNumber: item.rollNumber } });
      if (student) {
        const multiplier = 1 + (Number(improvementPercentage) / 100) * 0.15;
        const newAttendance = Math.min(Math.round(student.attendance * multiplier), 98);
        const newInternalMarks = Math.min(Math.round(student.internalMarks * multiplier), 95);
        const newSemesterMarks = Math.min(Number((student.semesterMarks * (1 + (Number(improvementPercentage) / 100) * 0.08)).toFixed(2)), 9.8);
        let newBacklogs = student.backlogs;
        if (student.backlogs > 0 && Math.random() > 0.4) {
          newBacklogs -= 1;
        }

        const localRecalc = predictStudentRiskLocal({ ...student, attendance: newAttendance, internalMarks: newInternalMarks, semesterMarks: newSemesterMarks, backlogs: newBacklogs });
        
        await prisma.student.update({
          where: { rollNumber: item.rollNumber },
          data: {
            attendance: newAttendance,
            internalMarks: newInternalMarks,
            semesterMarks: newSemesterMarks,
            backlogs: newBacklogs,
            riskStatus: localRecalc.riskStatus,
            riskConfidence: localRecalc.riskConfidence,
            riskReasons: localRecalc.riskReasons,
            recommendations: localRecalc.recommendations,
          }
        });
      }
    }

    res.json({ success: true, intervention: updatedIntervention });
  } catch (err) {
    next(err);
  }
};
