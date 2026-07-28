import { PrismaClient } from "@prisma/client";

/**
 * Singleton PrismaClient instance.
 * 
 * During development with hot-reloading (tsx watch mode), each module reload
 * creates a new PrismaClient, which can exhaust database connections.
 * By storing the instance on `globalThis`, we reuse the same client across reloads.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
