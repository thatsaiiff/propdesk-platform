import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const SwipeSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  action: z.enum(["SKIPPED", "INTERESTED"]),
  isContactRequested: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = SwipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid swipe data" },
        { status: 400 }
      );
    }

    const { propertyId, action, isContactRequested } = parsed.data;

    const result = store.recordSwipe(
      user.id,
      propertyId,
      action,
      isContactRequested || false
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to record property activity" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isContactRequested
        ? "Contact request registered! Our priority property advisory team has been notified."
        : action === "INTERESTED"
        ? "Interest registered! Our property team will contact you shortly."
        : "Property skipped.",
      leadId: result.leadId,
    });
  } catch (err) {
    console.error("Swipe API error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
