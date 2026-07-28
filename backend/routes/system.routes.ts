import { Router } from "express";
import { getState, resetSystem } from "../controllers/system.controller";
import { requireRole } from "../middleware/auth.middleware";

const router = Router();

// /api/state requires authentication (enforced by global middleware — no longer a public path)
router.get("/state", getState as any);

// /api/reset requires Administrator role
router.post("/reset", requireRole("Administrator"), resetSystem as any);

export default router;
