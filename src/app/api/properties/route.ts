import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const transactionType = searchParams.get("transactionType") || undefined;
    const city = searchParams.get("city") || undefined;
    const locality = searchParams.get("locality") || undefined;
    const bedroomsStr = searchParams.get("bedrooms");
    const bedrooms = bedroomsStr ? parseInt(bedroomsStr, 10) : undefined;
    const q = searchParams.get("q") || undefined;

    const properties = store.getPublicProperties({
      category,
      transactionType,
      city,
      locality,
      bedrooms,
      q,
    });

    return NextResponse.json({
      success: true,
      data: properties,
      meta: {
        total: properties.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: err.message || "Failed to retrieve properties." } },
      { status: 500 }
    );
  }
}
