import { describe, it, expect } from "vitest";
import { store } from "@/lib/store";
import { isAdminUser } from "@/lib/auth/session";

describe("Admin Authentication & OTP Cooldown Logic", () => {
  const testEmail = `tester-${Date.now()}@example.com`;

  it("should have shadab707waris@gmail.com registered as Super Admin", () => {
    const admin = store.getUserByEmail("shadab707waris@gmail.com");
    expect(admin).toBeDefined();
    expect(admin?.staffRoles).toContain("SUPER_ADMIN");
    expect(isAdminUser(admin)).toBe(true);
  });

  it("should generate a 6-digit OTP code and return cooldownSeconds on first request", async () => {
    const res = await store.requestOtp(testEmail);
    expect(res.success).toBe(true);
    expect(res.code).toBeDefined();
    expect(res.code).toMatch(/^\d{6}$/);
    expect(res.cooldownSeconds).toBe(30);
  });

  it("should enforce a cooldown throttling when requesting OTP again immediately", async () => {
    const res = await store.requestOtp(testEmail);
    expect(res.success).toBe(false);
    expect(res.cooldownSeconds).toBeGreaterThan(0);
    expect(res.cooldownSeconds).toBeLessThanOrEqual(30);
    expect(res.message).toContain("Please wait");
  });

  it("should successfully verify the generated OTP code", async () => {
    const newEmail = `verify-${Date.now()}@example.com`;
    const res = await store.requestOtp(newEmail);
    expect(res.success).toBe(true);
    const code = res.code!;

    const verifyRes = store.verifyOtp(newEmail, code);
    expect(verifyRes.success).toBe(true);
    expect(verifyRes.user).toBeDefined();
    expect(verifyRes.user?.email).toBe(newEmail);
  });

  it("should reject an incorrect OTP code", async () => {
    const newEmail = `fail-${Date.now()}@example.com`;
    await store.requestOtp(newEmail);
    const verifyRes = store.verifyOtp(newEmail, "000000");
    expect(verifyRes.success).toBe(false);
    expect(verifyRes.message).toBe("Incorrect verification code.");
  });
});
