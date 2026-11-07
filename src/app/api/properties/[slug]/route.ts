import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const property = store.getPublicPropertyBySlug(slug);

    if (!property) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Property not found or is no longer publicly visible." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: err.message || "Failed to fetch property." } },
      { status: 500 }
    );
  }
}
