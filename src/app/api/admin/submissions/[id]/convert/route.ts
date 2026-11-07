import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { canPublishListings } from "@/lib/auth/session";
import { store } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!canPublishListings(user)) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin authorization required." } }, { status: 403 });
  }

  try {
    const { id } = await params;
    const newListing = store.convertSubmissionToListing(id, user!.id, user!.name);
    return NextResponse.json({ success: true, listing: newListing });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err.message } }, { status: 500 });
  }
}
