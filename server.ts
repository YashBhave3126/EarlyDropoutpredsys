/**
 * RetainIQ Backend Server
 * 
 * Architecture: Modular MVC
 * - Security: Helmet, CORS, Rate Limiting (express-rate-limit), Body Size Limits
 * - Validation: Zod schemas via middleware
 * - Database: Prisma ORM (MySQL)
 * - Logging: Morgan
 * - Auth: JWT with Role-Based Access Control (RBAC)
 */

// Import config FIRST to validate env vars before anything else
import "./backend/config";

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import { PORT, NODE_ENV, MAX_BODY_SIZE, CORS_ORIGINS } from "./backend/config";
import { seedDatabase } from "./backend/services/seed.service";
import { authenticateToken } from "./backend/middleware/auth.middleware";
import { errorHandler } from "./backend/middleware/error.middleware";
import { apiLimiter } from "./backend/middleware/rateLimiter.middleware";

// Modular Route Imports
import authRoutes from "./backend/routes/auth.routes";
import studentRoutes from "./backend/routes/student.routes";
import interventionRoutes from "./backend/routes/intervention.routes";
import systemRoutes from "./backend/routes/system.routes";
import facultyRoutes from "./backend/routes/faculty.routes";

async function startServer() {
  const app = express();

  // Security Headers
  app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled for Vite dev mode

  // CORS — allow configured frontend origins
  app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true,
  }));

  // Body parsing with size limit to prevent memory exhaustion attacks
  app.use(express.json({ limit: MAX_BODY_SIZE }));
  
  // Request Logging
  app.use(morgan("dev"));

  // Global authentication (decodes JWT for all /api/* routes)
  app.use(authenticateToken);

  // Health Check (no auth required — registered before API routes)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() });
  });
  
  // Seed database on startup if empty
  await seedDatabase();

  // API Endpoints — general rate limit applied to all /api routes
  app.use("/api", apiLimiter);
  app.use("/api", authRoutes);            // /api/login, /api/register, /api/logout
  app.use("/api", systemRoutes);          // /api/state, /api/reset
  app.use("/api/students", studentRoutes);
  app.use("/api/interventions", interventionRoutes);
  app.use("/api/faculty", facultyRoutes); // /api/faculty/profile, /api/faculty/change-password

  // Global Error Handler — must be last middleware
  app.use(errorHandler as any);

  // Vite middleware setup for Development & Production serving
  if (NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
