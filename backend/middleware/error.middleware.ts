import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(`[Error] ${req.method} ${req.path}`);
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    // In production, we typically don't send the full stack trace to the client
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
