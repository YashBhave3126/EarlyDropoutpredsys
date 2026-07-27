import { Router } from "express";
import { upsertStudent, predictStudent, deleteStudent } from "../controllers/student.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { studentSchema } from "../middleware/schemas";

const router = Router();

router.post("/", validateRequest(studentSchema), upsertStudent as any);
router.post("/predict", predictStudent as any);
router.delete("/:rollNumber", deleteStudent as any);

export default router;
