/**
 * RetainIQ Backend Server
 * 
 * Architecture: Modular MVC
 * - Security: Helmet, CORS, Rate Limiting (express-rate-limit)
 * - Validation: Zod schemas via middleware
 * - Database: Prisma ORM (MySQL)
 * - Logging: Morgan
 * - Auth: JWT with Role-Based Access Control (RBAC)
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

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

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers
  app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled for Vite dev mode

  // CORS — allow frontend origins
  app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }));

  app.use(express.json());
  
  // Request Logging
  app.use(morgan("dev"));

  app.use(authenticateToken);
  
  // Seed database on startup if empty
  await seedDatabase();

  // API Endpoints — general rate limit applied to all /api routes
  app.use("/api", apiLimiter);
  app.use("/api", authRoutes);            // /api/login, /api/register, /api/logout
  app.use("/api", systemRoutes);          // /api/state, /api/reset
  app.use("/api/students", studentRoutes);
  app.use("/api/interventions", interventionRoutes);
  app.use("/api/faculty", facultyRoutes);    // /api/faculty/profile, /api/faculty/change-password

  // Health Check (no auth required)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() });
  });

  // Global Error Handler
  app.use(errorHandler as any);

  // Vite middleware setup for Development & Production serving
  if (process.env.NODE_ENV !== "production") {
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
