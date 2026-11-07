import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const dbUrl = process.env.DATABASE_URL || "";
const isDatabaseConfigured =
  (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) &&
  !dbUrl.includes("[SENSITIVE]");

export const prisma =
  global.prisma ||
  (isDatabaseConfigured
    ? new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null);

if (process.env.NODE_ENV !== "production" && prisma) {
  global.prisma = prisma;
}

export function isDbActive(): boolean {
  return !!prisma && isDatabaseConfigured;
}
