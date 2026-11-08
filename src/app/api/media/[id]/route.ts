import { NextRequest, NextResponse } from "next/server";
import { getMediaAsset } from "@/lib/media/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Asset not found", { status: 404 });
    }

    const asset = await getMediaAsset(id);
    if (!asset) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(asset.buffer), {
      status: 200,
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": asset.buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Error serving media:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
