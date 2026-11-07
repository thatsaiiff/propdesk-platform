import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";
import { createSessionToken } from "@/lib/auth/session";

const VerifySchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  code: z.string().min(4, "Please enter the verification code."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid verification request format." },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    const result = store.verifyOtp(email, code);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 401 }
      );
    }

    const token = await createSessionToken(result.user);
    const response = NextResponse.json({
      success: true,
      message: result.message,
      isNewUser: result.isNewUser,
      user: result.user,
    });

    response.cookies.set("propdesk_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("OTP verification error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while verifying OTP." },
      { status: 500 }
    );
  }
}
