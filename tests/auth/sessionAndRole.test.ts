import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken, isBuilderUser, isStaffUser } from "@/lib/auth/session";
import { User } from "@/types";

describe("Security Test: Authentication, Sessions & Server-Side Role Enforcement", () => {
  const regularBuyer: User = {
    id: "user-buyer-101",
    email: "buyer@example.com",
    name: "John Buyer",
    activeRole: "BUYER",
    status: "ACTIVE",
    roles: ["BUYER"],
    staffRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const builderUser: User = {
    id: "user-builder-101",
    email: "builder@example.com",
    name: "Apex Developer",
    activeRole: "BUILDER",
    status: "ACTIVE",
    roles: ["BUYER", "BUILDER"],
    staffRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const adminUser: User = {
    id: "user-admin-101",
    email: "admin@example.com",
    name: "System Admin",
    activeRole: "BUYER",
    status: "ACTIVE",
    roles: ["BUYER"],
    staffRoles: ["SUPER_ADMIN"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("should create and verify valid session token", async () => {
    const token = await createSessionToken(regularBuyer);
    expect(token).toBeDefined();

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(regularBuyer.id);
    expect(verified?.email).toBe(regularBuyer.email);
  });

  it("should reject tampered session tokens", async () => {
    const token = await createSessionToken(regularBuyer);
    const tampered = token.slice(0, -5) + "abcde";
    const verified = await verifySessionToken(tampered);
    expect(verified).toBeNull();
  });

  it("CRITICAL RULE: Active role alone must NEVER grant builder permissions if user lacks BUILDER role", () => {
    // Malicious or misconfigured user who set activeRole to BUILDER in UI
    const spoofedUser: User = {
      ...regularBuyer,
      activeRole: "BUILDER", // Display preference spoofing
      roles: ["BUYER"],      // Real server roles do NOT have BUILDER
    };

    expect(isBuilderUser(spoofedUser)).toBe(false);
    expect(isStaffUser(spoofedUser)).toBe(false);
  });

  it("should allow verified builder or admin to pass isBuilderUser check", () => {
    expect(isBuilderUser(builderUser)).toBe(true);
    expect(isBuilderUser(adminUser)).toBe(true);
    expect(isBuilderUser(regularBuyer)).toBe(false);
  });
});
