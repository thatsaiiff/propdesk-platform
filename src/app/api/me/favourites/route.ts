import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { store } from "@/lib/store";
import { toPublicPropertyDTO } from "@/server/dto/propertyDto";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  const propertyIds = store.getUserFavourites(user.id);
  const allProperties = store.getAllProperties();
  const favouriteProperties = allProperties
    .filter(p => propertyIds.includes(p.id) && p.visibility === "PUBLIC" && p.status === "PUBLISHED")
    .map(toPublicPropertyDTO);

  return NextResponse.json({
    success: true,
    favourites: propertyIds,
    properties: favouriteProperties,
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  try {
    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "propertyId is required." } }, { status: 400 });
    }

    const isFav = store.toggleFavourite(user.id, propertyId);
    return NextResponse.json({
      success: true,
      isFavourite: isFav,
      propertyId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err.message } }, { status: 500 });
  }
}
