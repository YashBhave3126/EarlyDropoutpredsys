import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      // Zod errors have an `issues` array
      if (error?.issues && Array.isArray(error.issues)) {
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((err: any) => ({
            field: err.path?.join('.') || 'unknown',
            message: err.message
          }))
        });
        return;
      }
      res.status(500).json({ error: "Internal server error during validation" });
    }
  };
};
