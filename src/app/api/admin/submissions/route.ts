import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { canPublishListings } from "@/lib/auth/session";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!canPublishListings(user)) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin authorization required." } }, { status: 403 });
  }

  const submissions = store.getSubmissions();
  return NextResponse.json({ success: true, submissions });
}
