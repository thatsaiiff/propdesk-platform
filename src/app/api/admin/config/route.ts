import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest, isAdminUser } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const ConfigUpdateSchema = z.object({
  pricePromiseText: z.string().min(10).optional(),
  adminNotificationEmail: z.string().email().optional(),
  commissionRatePercent: z.number().min(0).max(100).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const config = store.getConfig();
    return NextResponse.json({ success: true, config });
  } catch (err) {
    console.error("Get config error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getCurrentUserFromRequest(req);
    if (!admin || !isAdminUser(admin)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = ConfigUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
    }

    const updated = store.updateConfig(parsed.data);
    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    console.error("Update config error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
