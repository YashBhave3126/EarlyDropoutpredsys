import { Router } from "express";
import { updateProfile, changePassword } from "../controllers/faculty.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { changePasswordSchema } from "../middleware/schemas";
import { requireRole } from "../middleware/auth.middleware";

const router = Router();

router.patch("/profile", requireRole("Faculty"), updateProfile as any);
router.post("/change-password", validateRequest(changePasswordSchema), changePassword as any);

export default router;
