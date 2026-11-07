const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL;

if (dbUrl && dbUrl.startsWith("postgresql://") && !dbUrl.includes("[SENSITIVE]")) {
  try {
    console.log("[DB AUTO-SYNC] Synchronizing Prisma schema with PostgreSQL database...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("[DB AUTO-SYNC] Tables and relations verified.");
  } catch (err) {
    console.warn("[DB AUTO-SYNC] Notice during database sync:", err?.message || err);
  }
} else {
  console.log("[DB AUTO-SYNC] Database URL not provided in build environment; skipping push.");
}
