import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export interface AuthRequest extends Request {
  user?: {
    name: string;
    email?: string;
    role: "Student" | "Faculty" | "Administrator";
    rollNumber?: string;
    department?: string;
  };
}

/**
 * Global authentication middleware.
 * - Skips non-API routes (frontend/static assets)
 * - Public endpoints: optionally decodes token but doesn't require it
 * - All other API routes: requires a valid JWT token
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  // Allow all frontend/static requests to pass through
  if (!req.path.startsWith('/api/')) {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Public endpoints that optionally decode the token
  const publicPaths = ['/api/login', '/api/register', '/api/logout', '/api/health'];
  if (publicPaths.includes(req.path)) {
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded as AuthRequest['user'];
      } catch {
        // Token invalid on a public route — just ignore it
      }
    }
    next();
    return;
  }

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as AuthRequest['user'];
    next();
  } catch {
    res.status(403).json({ error: "Invalid or expired token." });
  }
}

/**
 * Role-based access control middleware factory.
 * Usage in routes: router.post("/", requireRole("Administrator", "Faculty"), handler)
 * 
 * This replaces all the inline `if (req.user?.role !== ...)` checks in controllers,
 * making authorization declarative, consistent, and impossible to forget.
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: `Forbidden: This action requires one of the following roles: ${allowedRoles.join(", ")}.` 
      });
      return;
    }
    next();
  };
}
