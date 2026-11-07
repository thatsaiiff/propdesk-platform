import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";

const RequestSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors.email?.[0] || "Invalid email format." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const result = store.requestOtp(email);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message, cooldownSeconds: result.cooldownSeconds },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      isNewUser: result.isNewUser,
      devCode: result.code,
      liveDispatched: result.liveDispatched,
      cooldownSeconds: result.cooldownSeconds || 30,
    });
  } catch (err) {
    console.error("OTP request error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while requesting OTP." },
      { status: 500 }
    );
  }
}
