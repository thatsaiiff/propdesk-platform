import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { canManageLeads } from "@/lib/auth/session";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!canManageLeads(user)) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Lead management authorization required." } }, { status: 403 });
  }

  const inquiries = store.getInquiries();
  return NextResponse.json({ success: true, inquiries });
}
