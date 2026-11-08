import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const dbUrl = process.env.DATABASE_URL || "";
const isDatabaseConfigured =
  (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) &&
  !dbUrl.includes("[SENSITIVE]");

let poolUrl = dbUrl;
if (poolUrl && !poolUrl.includes("connection_limit=")) {
  const separator = poolUrl.includes("?") ? "&" : "?";
  poolUrl += `${separator}connection_limit=3&pool_timeout=20`;
}

export const prisma =
  global.prisma ||
  (isDatabaseConfigured
    ? new PrismaClient({
        datasources: {
          db: {
            url: poolUrl,
          },
        },
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null);

if (prisma) {
  global.prisma = prisma;
}

export function isDbActive(): boolean {
  return !!prisma && isDatabaseConfigured;
}
