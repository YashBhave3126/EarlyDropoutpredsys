/**
 * Centralized Configuration
 * 
 * Validates all required environment variables at startup.
 * The server will crash immediately if any critical variable is missing,
 * rather than silently falling back to insecure defaults.
 */
import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    console.error(`\n❌ FATAL: Missing required environment variable: ${key}`);
    console.error(`   Please set ${key} in your .env file.\n`);
    process.exit(1);
  }
  return value;
}

// --- Required Variables ---
export const JWT_SECRET = requireEnv("JWT_SECRET");
export const DATABASE_URL = requireEnv("DATABASE_URL");

// --- Optional Variables ---
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || "";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = parseInt(process.env.PORT || "3000", 10);

// --- Security Constants ---
export const JWT_EXPIRY = "24h";
export const BCRYPT_ROUNDS = 10;
export const MAX_BODY_SIZE = "1mb";
export const CORS_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map(origin => origin.trim());
