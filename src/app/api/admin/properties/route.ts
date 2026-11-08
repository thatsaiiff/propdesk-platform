import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest, isAdminUser } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const PropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default("Verified curated property on desk record."),
  category: z.enum([
    "HOUSE",
    "FLAT",
    "PLOT",
    "INDUSTRIAL_LAND",
    "WAREHOUSE",
    "FACTORY",
    "BUILDING_WITH_LAND",
    "DISPUTED",
  ]).default("FLAT"),
  inventoryType: z.enum(["BANK_NBFC", "NON_BANK_NBFC"]).default("NON_BANK_NBFC"),
  isJointVenture: z.boolean().default(false),
  isDisputed: z.boolean().default(false),
  purposeAvailability: z.enum(["SALE", "RENT", "BOTH"]).default("SALE"),
  state: z.string().default("Maharashtra"),
  city: z.string().default("Mumbai"),
  locality: z.string().default("Prime Locality"),
  pincode: z.string().optional(),
  area: z.number().default(1000),
  areaUnit: z.string().default("sq.ft."),
  demarcation: z.string().default("Demarcation boundaries on file in desk custody."),
  images: z.array(z.object({
    id: z.string(),
    url: z.string().min(5),
    label: z.string().optional(),
    sortOrder: z.number().default(1),
  })).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "PAUSED", "SOLD", "RENTED"]).default("PUBLISHED"),
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

    await store.ensureHydrated(true);
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

    await store.ensureHydrated();
    const body = await req.json();
    const parsed = PropertySchema.safeParse(body);

    if (!parsed.success) {
      console.warn("Property validation failed:", parsed.error.flatten().fieldErrors);
      return NextResponse.json({ success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const city = parsed.data.city || "India";
    const slug = `${city}-${parsed.data.title}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created = await store.createProperty({
      ...parsed.data,
      slug,
      allowedRoles: parsed.data.allowedRoles as any,
    });

    await store.persistPropertyToDb(created);

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

    await store.ensureHydrated();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Property ID required" }, { status: 400 });
    }

    const updated = await store.updateProperty(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    await store.persistPropertyToDb(updated);

    return NextResponse.json({ success: true, property: updated });
  } catch (err) {
    console.error("Admin update property error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Property ID required" }, { status: 400 });
    }

    const deleted = await store.deleteProperty(id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error("Admin delete property error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
