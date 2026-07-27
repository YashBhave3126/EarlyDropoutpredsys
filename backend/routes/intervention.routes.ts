import { Router } from "express";
import { createIntervention, updateIntervention } from "../controllers/intervention.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { interventionSchema, updateInterventionSchema } from "../middleware/schemas";

const router = Router();

router.post("/", validateRequest(interventionSchema), createIntervention as any);
router.patch("/:id", validateRequest(updateInterventionSchema), updateIntervention as any);

export default router;
