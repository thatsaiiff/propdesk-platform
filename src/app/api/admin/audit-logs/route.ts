import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { isStaffUser } from "@/lib/auth/session";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!isStaffUser(user)) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Staff authorization required." } }, { status: 403 });
  }

  const logs = store.getAuditLogs();
  return NextResponse.json({ success: true, logs });
}
