import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { canPublishListings } from "@/lib/auth/session";
import { AdminListingCreateUpdateSchema } from "@/lib/validation/schemas";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!canPublishListings(user)) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin authorization required." } }, { status: 403 });
  }

  const all = store.getAllProperties();
  return NextResponse.json({ success: true, properties: all });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!canPublishListings(user)) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin authorization required." } }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = AdminListingCreateUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid property listing data", fieldErrors: parsed.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const newListing = store.saveProperty(
      {
        ...data,
        id: `prop-adm-${Date.now()}`,
        slug,
        createdByStaffId: user!.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      user!.id,
      user!.name
    );

    return NextResponse.json({ success: true, property: newListing });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err.message } }, { status: 500 });
  }
}
