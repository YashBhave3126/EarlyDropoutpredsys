import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../db";
import { BCRYPT_ROUNDS } from "../config";
import { AuthRequest } from "../middleware/auth.middleware";

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  const { name, department } = req.body;

  try {
    const faculty = await prisma.faculty.findUnique({ where: { email: req.user!.email } });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (department) updateData.department = department;

    const updated = await prisma.faculty.update({
      where: { email: req.user!.email },
      data: updateData
    });

    const { password, ...safe } = updated as any;
    res.json({ success: true, faculty: safe });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Validation is now handled by changePasswordSchema in the route middleware

  try {
    let dbRecord: any = null;

    if (user.role === "Administrator") {
      dbRecord = await prisma.admin.findUnique({ where: { email: user.email } });
    } else if (user.role === "Faculty") {
      dbRecord = await prisma.faculty.findUnique({ where: { email: user.email } });
    } else if (user.role === "Student") {
      dbRecord = await prisma.student.findUnique({ where: { rollNumber: user.rollNumber } });
    }

    if (!dbRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, dbRecord.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    if (user.role === "Administrator") {
      await prisma.admin.update({ where: { email: user.email }, data: { password: hashedNewPassword } });
    } else if (user.role === "Faculty") {
      await prisma.faculty.update({ where: { email: user.email }, data: { password: hashedNewPassword } });
    } else if (user.role === "Student") {
      await prisma.student.update({ where: { rollNumber: user.rollNumber }, data: { password: hashedNewPassword } });
    }

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};
