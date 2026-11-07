import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  const userInquiries = store.getInquiries({ userId: user.id });

  // Explicit user safe DTO (no private staff notes)
  const safeList = userInquiries.map(inq => ({
    id: inq.id,
    publicReference: inq.publicReference,
    propertyId: inq.propertyId,
    propertyTitle: inq.propertyTitle,
    jvOpportunityId: inq.jvOpportunityId,
    jvTitle: inq.jvTitle,
    intent: inq.intent,
    status: inq.status,
    message: inq.message,
    contactName: inq.contactName,
    createdAt: inq.createdAt,
    updatedAt: inq.updatedAt,
  }));

  return NextResponse.json({ success: true, inquiries: safeList });
}
