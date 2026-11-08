import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const PropertyCategoryEnum = z.enum([
  "HOUSE",
  "FLAT",
  "PLOT",
  "INDUSTRIAL_LAND",
  "WAREHOUSE",
  "FACTORY",
  "BUILDING_WITH_LAND",
  "DISPUTED",
]);

const OnboardingSchema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  phone: z.string().min(8, "Valid phone number required").optional(),
  roles: z.array(z.enum([
    "INDIVIDUAL_BUYER",
    "INVESTOR",
    "BUILDER",
    "BROKER",
    "PROPERTY_OWNER",
    "RENTAL_SEEKER"
  ])).min(1, "Select at least one role").optional(),
  preferences: z.object({
    inventoryTypePreference: z.enum(["BANK_NBFC", "NON_BANK_NBFC", "BOTH"]).optional(),
    builderOpportunityType: z.enum(["BANK_NBFC", "NON_BANK_NBFC", "JOINT_VENTURE"]).optional(),
    category: PropertyCategoryEnum.optional(),
    categories: z.array(PropertyCategoryEnum).optional(),
    purpose: z.enum(["BUY", "RENT", "BUY_OR_RENT"]).optional(),
  }).optional(),
  isOnboarded: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = OnboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updates = {
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.phone && { phone: parsed.data.phone }),
      ...(parsed.data.roles && { roles: parsed.data.roles }),
      ...(parsed.data.preferences && {
        preferences: {
          ...user.preferences,
          ...parsed.data.preferences,
        },
      }),
      ...(parsed.data.isOnboarded !== undefined && { isOnboarded: parsed.data.isOnboarded }),
    };

    const updated = store.updateUser(user.id, updates);

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("Onboarding update error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
