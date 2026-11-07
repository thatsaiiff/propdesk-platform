import { NextRequest, NextResponse } from "next/server";
import { EmailOtpVerifySchema } from "@/lib/validation/schemas";
import { store } from "@/lib/store";
import { createSessionToken } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EmailOtpVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid OTP format.",
            fieldErrors: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    const isValid = store.verifyOtp(email, code);

    if (!isValid) {
      return NextResponse.json(
        { error: { code: "INVALID_OTP", message: "Invalid or expired verification code." } },
        { status: 401 }
      );
    }

    const user = store.createOrUpdateUserFromEmail(email);
    const token = await createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        activeRole: user.activeRole,
        roles: user.roles,
        staffRoles: user.staffRoles,
      },
    });

    response.cookies.set("propdesk_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: err.message || "Authentication failed." } },
      { status: 500 }
    );
  }
}
