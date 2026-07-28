import { Router } from "express";
import { createIntervention, updateIntervention } from "../controllers/intervention.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { interventionSchema, updateInterventionSchema } from "../middleware/schemas";
import { requireRole } from "../middleware/auth.middleware";

const router = Router();

// All intervention routes require Administrator or Faculty role
router.post("/", requireRole("Administrator", "Faculty"), validateRequest(interventionSchema), createIntervention as any);
router.patch("/:id", requireRole("Administrator", "Faculty"), validateRequest(updateInterventionSchema), updateIntervention as any);

export default router;
