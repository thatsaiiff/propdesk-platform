import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest, isAdminUser } from "@/lib/auth/session";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ success: false, error: "Access denied. Admin authorization required." }, { status: 403 });
    }

    await store.ensureHydrated(true);
    const stats = store.getAdminStats();
    const config = store.getConfig();

    return NextResponse.json({
      success: true,
      stats,
      config,
    });
  } catch (err) {
    console.error("Admin overview error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
