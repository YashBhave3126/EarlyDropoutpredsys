import rateLimit from "express-rate-limit";

// Strict limiter for auth endpoints (login/register) — prevents brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 10,                   // Max 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

// General API limiter — prevents abuse/DDOS on all endpoints
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1-minute window
  max: 100,                  // Max 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please slow down.",
  },
});
