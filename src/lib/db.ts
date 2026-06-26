import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getDb = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  // Build-time safety: If URL is missing, return a dummy or wait
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    console.warn("[PRISMA] Database URL missing during load. Postponing init.");
  }

  globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
};

// Keep old export for backward compatibility but make it a lazy proxy
export const db = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const database = getDb();
    return (database as any)[prop];
  }
});
