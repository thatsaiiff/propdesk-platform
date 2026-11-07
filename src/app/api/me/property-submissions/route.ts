import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  const submissions = store.getSubmissions({ userId: user.id });

  const safeSubmissions = submissions.map(sub => ({
    id: sub.id,
    title: sub.title,
    category: sub.category,
    subtype: sub.subtype,
    transactionType: sub.transactionType,
    city: sub.city,
    locality: sub.locality,
    state: sub.state,
    area: sub.area,
    areaUnit: sub.areaUnit,
    relationshipToProperty: sub.relationshipToProperty,
    status: sub.status,
    convertedPropertyId: sub.convertedPropertyId,
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
  }));

  return NextResponse.json({ success: true, submissions: safeSubmissions });
}
