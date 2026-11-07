import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest, isAdminUser } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const PropertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.enum([
    "HOUSE",
    "FLAT",
    "PLOT",
    "INDUSTRIAL_LAND",
    "WAREHOUSE",
    "FACTORY",
    "BUILDING_WITH_LAND",
    "DISPUTED",
  ]),
  inventoryType: z.enum(["BANK_NBFC", "NON_BANK_NBFC"]),
  isJointVenture: z.boolean().default(false),
  isDisputed: z.boolean().default(false),
  purposeAvailability: z.enum(["SALE", "RENT", "BOTH"]),
  state: z.string().min(2),
  city: z.string().min(2),
  locality: z.string().min(2),
  pincode: z.string().optional(),
  area: z.number().positive(),
  areaUnit: z.enum(["sq.ft.", "sq.yards", "acres"]),
  demarcation: z.string().min(5),
  images: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
    label: z.string().optional(),
    sortOrder: z.number(),
  })).min(1, "At least one photograph is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  internalAskingPrice: z.number().optional(),
  internalOwnershipDetails: z.string().optional(),
  allowedRoles: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const properties = store.getAllPropertiesAdmin();
    return NextResponse.json({ success: true, properties });
  } catch (err) {
    console.error("Admin get properties error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = PropertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const slug = `${parsed.data.city}-${parsed.data.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created = store.createProperty({
      ...parsed.data,
      slug,
      allowedRoles: parsed.data.allowedRoles as any,
    });

    return NextResponse.json({ success: true, property: created });
  } catch (err) {
    console.error("Admin create property error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Property ID required" }, { status: 400 });
    }

    const updated = store.updateProperty(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, property: updated });
  } catch (err) {
    console.error("Admin update property error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
