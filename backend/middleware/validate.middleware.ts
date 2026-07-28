import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

/**
 * Request validation middleware factory.
 * 
 * Accepts any Zod schema type (ZodObject, ZodEffects from .refine(), etc.)
 * Previously typed as AnyZodObject which didn't support refined schemas.
 */
export const validateRequest = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      // Zod errors have an `issues` array
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((err) => ({
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
