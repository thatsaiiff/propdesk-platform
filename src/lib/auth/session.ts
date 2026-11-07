import { User, UserRole } from "@/types";
import { store } from "@/lib/store";
import { NextRequest } from "next/server";

const SESSION_SECRET = process.env.SESSION_SECRET || "propdesk-super-secret-production-key-2026-secure-invariable";

export interface SessionPayload {
  userId: string;
  email: string;
  roles: UserRole[];
  staffRoles?: string[];
  exp: number;
}

// Simple base64url encoder/decoder
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString();
}

// HMAC-SHA256 signature using Web Crypto API
async function sign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Buffer.from(signature)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function createSessionToken(user: User): Promise<string> {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    roles: user.roles,
    staffRoles: user.staffRoles,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const sig = await sign(data, SESSION_SECRET);
  return `${data}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, sig] = parts;
    const data = `${header}.${body}`;
    const expectedSig = await sign(data, SESSION_SECRET);

    if (sig !== expectedSig) return null;

    const payload: SessionPayload = JSON.parse(base64UrlDecode(body));
    if (Date.now() / 1000 > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUserFromRequest(req: NextRequest): Promise<User | null> {
  const cookie = req.cookies.get("propdesk_session")?.value;
  if (!cookie) return null;

  const payload = await verifySessionToken(cookie);
  if (!payload) return null;

  return store.getUserById(payload.userId);
}

export function isBuilderUser(user: User | null): boolean {
  if (!user) return false;
  return user.roles.includes("BUILDER") || (Array.isArray(user.staffRoles) && user.staffRoles.includes("SUPER_ADMIN"));
}

export function isStaffUser(user: User | null): boolean {
  if (!user) return false;
  return Array.isArray(user.staffRoles) && user.staffRoles.length > 0;
}

export function isAdminUser(user: User | null): boolean {
  return isStaffUser(user);
}

export function canPublishListings(user: User | null): boolean {
  if (!user) return false;
  return Array.isArray(user.staffRoles) && (user.staffRoles.includes("SUPER_ADMIN") || user.staffRoles.includes("LISTING_MANAGER"));
}

export function canManageLeads(user: User | null): boolean {
  if (!user) return false;
  return Array.isArray(user.staffRoles) && (user.staffRoles.includes("SUPER_ADMIN") || user.staffRoles.includes("LEAD_MANAGER"));
}
