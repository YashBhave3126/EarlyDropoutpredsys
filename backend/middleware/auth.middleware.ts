import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  // Allow all frontend/static requests to pass through
  if (!req.path.startsWith('/api/')) {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Public endpoints that optionally decode the token
  const publicPaths = ['/api/login', '/api/register', '/api/state', '/api/logout', '/api/health'];
  if (publicPaths.includes(req.path)) {
    if (token) {
      jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (!err) req.user = user;
      });
    }
    next();
    return;
  }

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token." });
      return;
    }
    req.user = user;
    next();
  });
}
