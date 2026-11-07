import { NextRequest, NextResponse } from "next/server";
import { EmailOtpRequestSchema } from "@/lib/validation/schemas";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EmailOtpRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid email address.",
            fieldErrors: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const code = store.createOtp(parsed.data.email);

    // In local / demo mode, return message informing user of code for quick testing
    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${parsed.data.email}.`,
      demoCodeHint: code === "123456" ? "For testing, use code: 123456" : "Use code: " + code,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: err.message || "Failed to send OTP." } },
      { status: 500 }
    );
  }
}
