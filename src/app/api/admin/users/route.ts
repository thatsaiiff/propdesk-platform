import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest, isAdminUser } from "@/lib/auth/session";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentUserFromRequest(req);
    if (!admin || !isAdminUser(admin)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const user = store.getUserById(userId);
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
      const activity = store.getUserActivitySummary(userId);
      return NextResponse.json({ success: true, user, activity });
    }

    const users = store.getAllUsers();
    // Return users with their activity count metrics
    const usersWithStats = users.map((u) => {
      const acts = store.getUserActivitySummary(u.id);
      return {
        ...u,
        metrics: {
          interestedCount: acts.interested.length,
          contactCount: acts.contactRequests.length,
          skippedCount: acts.skipped.length,
          viewedCount: acts.recentlyViewed.length,
        },
      };
    });

    return NextResponse.json({ success: true, users: usersWithStats });
  } catch (err) {
    console.error("Admin users API error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
