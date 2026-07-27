import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../middleware/schemas";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.post("/register", authLimiter, validateRequest(registerSchema), register);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post("/logout", logout);

export default router;
