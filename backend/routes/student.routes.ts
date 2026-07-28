import { Router } from "express";
import { upsertStudent, predictStudent, deleteStudent } from "../controllers/student.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { studentSchema } from "../middleware/schemas";
import { requireRole } from "../middleware/auth.middleware";

const router = Router();

// All student management routes require Administrator or Faculty role
router.post("/", requireRole("Administrator", "Faculty"), validateRequest(studentSchema), upsertStudent as any);
router.post("/predict", requireRole("Administrator", "Faculty"), predictStudent as any);
router.delete("/:rollNumber", requireRole("Administrator"), deleteStudent as any);

export default router;
