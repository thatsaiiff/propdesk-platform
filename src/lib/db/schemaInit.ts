import { prisma, isDbActive } from "./prisma";

let isSchemaInitialized = false;

/**
 * Ensures all required PostgreSQL tables, columns, and indexes exist in the Neon database.
 * Uses idempotent DDL (IF NOT EXISTS) so it is safe to run on every cold start.
 */
export async function ensureDatabaseSchema(): Promise<boolean> {
  if (isSchemaInitialized) return true;
  if (!isDbActive() || !prisma) return false;

  try {
    // 1. User table & activeRole column
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL DEFAULT '',
        "phone" TEXT,
        "activeRole" TEXT,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "roles" TEXT NOT NULL,
        "staffRoles" TEXT,
        "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
        "preferences" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "activeRole" TEXT;
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "staffRoles" TEXT;
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isOnboarded" BOOLEAN NOT NULL DEFAULT false;
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "preferences" TEXT;
    `);

    // 2. Property table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Property" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "subtype" TEXT,
        "transactionType" TEXT,
        "inventoryType" TEXT NOT NULL DEFAULT 'NON_BANK_NBFC',
        "isJointVenture" BOOLEAN NOT NULL DEFAULT false,
        "isDisputed" BOOLEAN NOT NULL DEFAULT false,
        "purposeAvailability" TEXT NOT NULL DEFAULT 'BUY',
        "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
        "state" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "locality" TEXT NOT NULL,
        "pincode" TEXT,
        "area" DOUBLE PRECISION NOT NULL,
        "areaUnit" TEXT NOT NULL DEFAULT 'sq.ft.',
        "builtUpArea" DOUBLE PRECISION,
        "carpetArea" DOUBLE PRECISION,
        "plotArea" DOUBLE PRECISION,
        "bedrooms" INTEGER,
        "bathrooms" INTEGER,
        "balconies" INTEGER,
        "floorNumber" INTEGER,
        "totalFloors" INTEGER,
        "furnishing" TEXT,
        "facing" TEXT,
        "parkingCount" INTEGER,
        "ageOfProperty" TEXT,
        "amenities" TEXT,
        "demarcation" TEXT NOT NULL DEFAULT 'Demarcated with boundary markers.',
        "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
        "internalAskingPrice" DOUBLE PRECISION,
        "privateSalePrice" DOUBLE PRECISION,
        "privateRentAmount" DOUBLE PRECISION,
        "privateDeposit" DOUBLE PRECISION,
        "priceNegotiable" BOOLEAN DEFAULT false,
        "internalNotes" TEXT,
        "internalOwnershipDetails" TEXT,
        "ownerContactName" TEXT,
        "ownerContactPhone" TEXT,
        "createdByStaffId" TEXT,
        "allowedRoles" TEXT,
        "publishedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. PropertyImage table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PropertyImage" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "propertyId" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "label" TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "altText" TEXT,
        "isCover" BOOLEAN NOT NULL DEFAULT false
      );
      CREATE INDEX IF NOT EXISTS "PropertyImage_propertyId_idx" ON "PropertyImage"("propertyId");
      CREATE INDEX IF NOT EXISTS "PropertyImage_sortOrder_idx" ON "PropertyImage"("sortOrder");
    `);

    // 4. MediaAsset table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MediaAsset" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "mimeType" TEXT NOT NULL DEFAULT 'image/jpeg',
        "data" TEXT NOT NULL,
        "sizeBytes" INTEGER NOT NULL DEFAULT 0,
        "filename" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");
    `);

    // 5. PropertyActivity table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PropertyActivity" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "propertyId" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "isContactRequested" BOOLEAN NOT NULL DEFAULT false,
        "contactRequestedAt" TIMESTAMP(3),
        "viewCount" INTEGER NOT NULL DEFAULT 1,
        "cycleId" TEXT NOT NULL DEFAULT 'default',
        "firstViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "PropertyActivity_userId_action_idx" ON "PropertyActivity"("userId", "action");
      CREATE INDEX IF NOT EXISTS "PropertyActivity_cycleId_idx" ON "PropertyActivity"("cycleId");
    `);

    // 6. Lead table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Lead" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "userName" TEXT NOT NULL,
        "userEmail" TEXT NOT NULL,
        "userPhone" TEXT NOT NULL,
        "userRoles" TEXT NOT NULL,
        "propertyId" TEXT NOT NULL,
        "propertyTitle" TEXT NOT NULL,
        "propertyLocation" TEXT NOT NULL,
        "propertyCategory" TEXT NOT NULL,
        "opportunityType" TEXT,
        "actionType" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'NEW',
        "assignedTo" TEXT,
        "notes" TEXT,
        "publicReference" TEXT,
        "jvTitle" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "Lead_userId_idx" ON "Lead"("userId");
      CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
      CREATE INDEX IF NOT EXISTS "Lead_propertyId_idx" ON "Lead"("propertyId");
    `);

    // 7. PropertySubmission table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PropertySubmission" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT,
        "submittedByUserId" TEXT,
        "submitterName" TEXT NOT NULL,
        "submitterEmail" TEXT NOT NULL,
        "submitterPhone" TEXT NOT NULL,
        "submitterRole" TEXT NOT NULL,
        "relationshipToProperty" TEXT,
        "category" TEXT NOT NULL,
        "subtype" TEXT,
        "transactionType" TEXT,
        "purpose" TEXT,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "locality" TEXT NOT NULL,
        "area" DOUBLE PRECISION NOT NULL,
        "areaUnit" TEXT NOT NULL DEFAULT 'sq.ft.',
        "askingPrice" DOUBLE PRECISION,
        "expectedPriceOrRent" TEXT,
        "contactPreference" TEXT,
        "isJointVenture" BOOLEAN NOT NULL DEFAULT false,
        "isDisputed" BOOLEAN NOT NULL DEFAULT false,
        "status" TEXT NOT NULL DEFAULT 'RECEIVED',
        "convertedPropertyId" TEXT,
        "adminReviewNotes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "PropertySubmission_submitterEmail_idx" ON "PropertySubmission"("submitterEmail");
      CREATE INDEX IF NOT EXISTS "PropertySubmission_status_idx" ON "PropertySubmission"("status");
    `);

    // 8. PlatformConfig table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PlatformConfig" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
        "pricePromiseText" TEXT NOT NULL,
        "adminNotificationEmail" TEXT NOT NULL DEFAULT 'admin@propdesk.demo',
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. AuditLog & OtpRecord tables
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AuditLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "actorUserId" TEXT NOT NULL,
        "actorName" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "entityType" TEXT NOT NULL,
        "entityId" TEXT NOT NULL,
        "beforeSnapshot" TEXT,
        "afterSnapshot" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS "OtpRecord" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "code" TEXT NOT NULL,
        "attempts" INTEGER NOT NULL DEFAULT 0,
        "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "OtpRecord_email_idx" ON "OtpRecord"("email");
    `);

    isSchemaInitialized = true;
    console.log("[DB SCHEMA] Neon PostgreSQL schema verified and synchronized.");
    return true;
  } catch (err) {
    console.warn("[DB SCHEMA] Schema verification notice:", err);
    return false;
  }
}
