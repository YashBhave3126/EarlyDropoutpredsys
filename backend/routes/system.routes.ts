import { Router } from "express";
import { getState, resetSystem } from "../controllers/system.controller";

const router = Router();

router.get("/state", getState as any);
router.post("/reset", resetSystem as any);

export default router;
