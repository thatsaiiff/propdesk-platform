import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { PropertyCategory, PropertyPurpose, BuilderOpportunityType } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required to discover properties." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get("category") as PropertyCategory | null;
    const purposeParam = searchParams.get("purpose") as PropertyPurpose | null;
    const builderOppParam = searchParams.get("builderOpportunityType") as BuilderOpportunityType | null;

    const filters = {
      category: categoryParam || user.preferences?.category,
      purpose: purposeParam || user.preferences?.purpose,
      builderOpportunityType: builderOppParam || user.preferences?.builderOpportunityType,
    };

    const properties = store.getDiscoveryProperties(user.id, filters);

    return NextResponse.json({
      success: true,
      properties,
      count: properties.length,
      filters,
    });
  } catch (err) {
    console.error("Discovery error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
