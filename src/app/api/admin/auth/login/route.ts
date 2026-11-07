import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";
import { createSessionToken } from "@/lib/auth/session";
import { PrismaAdapter } from "@/lib/db/prismaAdapter";

const AdminLoginSchema = z.object({
  email: z.string().email("Please provide a valid administrator email."),
  password: z.string().min(1, "Password is required."),
});

const DEFAULT_ADMIN_EMAIL = "shadab707waris@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "S@if7246";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AdminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.flatten().fieldErrors.email?.[0] ||
                 parsed.error.flatten().fieldErrors.password?.[0] ||
                 "Invalid administrator credentials format.",
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const allowedPrimaryEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase().trim();
    const allowedPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

    const isMatch = (
      (normalizedEmail === allowedPrimaryEmail || normalizedEmail === "admin@propdesk.demo") &&
      password === allowedPassword
    );

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect administrator email or password." },
        { status: 401 }
      );
    }

    // Retrieve or instantiate the admin user record
    let adminUser = store.getUserByEmail(normalizedEmail);

    if (!adminUser) {
      const id = `user-admin-${Date.now()}`;
      adminUser = {
        id,
        email: normalizedEmail,
        name: "Shadab Waris (Admin)",
        phone: "+919820011223",
        roles: ["BUILDER", "INVESTOR", "PROPERTY_OWNER"],
        staffRoles: ["SUPER_ADMIN"],
        isOnboarded: true,
        preferences: {
          category: "BUILDING_WITH_LAND",
          purpose: "BUY",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Register into active store
      (store as any).users.push(adminUser);
      PrismaAdapter.persistUser(adminUser);
    } else {
      // Ensure staffRoles has SUPER_ADMIN
      const staffRoles = Array.from(new Set([...(adminUser.staffRoles || []), "SUPER_ADMIN"]));
      const updated = store.updateUser(adminUser.id, {
        staffRoles,
        isOnboarded: true,
      });
      if (updated) {
        adminUser = updated;
      }
    }

    // Log the sensitive admin login action
    store.addAuditLog({
      action: "ADMIN_LOGIN_PASSWORD",
      actorUserId: adminUser.id,
      actorName: adminUser.name || "Administrator",
      entityType: "USER_ROLE",
      entityId: adminUser.id,
      afterSnapshot: { method: "PASSWORD_DIRECT", email: adminUser.email },
    });

    const token = await createSessionToken(adminUser);
    const response = NextResponse.json({
      success: true,
      message: "Administrator session established.",
      user: adminUser,
    });

    response.cookies.set("propdesk_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Admin credentials authentication error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during administrator sign-in." },
      { status: 500 }
    );
  }
}
