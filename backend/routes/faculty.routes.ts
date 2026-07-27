import { Router } from "express";
import { updateProfile, changePassword } from "../controllers/faculty.controller";

const router = Router();

router.patch("/profile", updateProfile as any);
router.post("/change-password", changePassword as any);

export default router;
