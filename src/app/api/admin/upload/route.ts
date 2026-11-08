import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest, isAdminUser } from "@/lib/auth/session";
import { saveMediaAsset } from "@/lib/media/storage";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ success: false, error: "Access denied. Admin privileges required." }, { status: 403 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided in form data." }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = file.name || "uploaded-property-photo.jpg";
      const mimeType = file.type || "image/jpeg";

      const saved = await saveMediaAsset({ buffer, filename, mimeType });
      return NextResponse.json({
        success: true,
        url: saved.url,
        id: saved.id,
        provider: saved.provider,
        filename,
      });
    }

    // JSON base64 upload
    const body = await req.json();
    if (!body || !body.data) {
      return NextResponse.json({ success: false, error: "Invalid payload: 'data' is required." }, { status: 400 });
    }

    let rawData: string = body.data;
    let mimeType = body.mimeType || "image/jpeg";

    if (rawData.startsWith("data:")) {
      const parts = rawData.split(",");
      const meta = parts[0];
      const match = meta.match(/data:([^;]+);base64/);
      if (match && match[1]) mimeType = match[1];
      rawData = parts[1] || "";
    }

    const buffer = Buffer.from(rawData, "base64");
    const filename = body.filename || `property-photo-${Date.now()}.jpg`;

    const saved = await saveMediaAsset({ buffer, filename, mimeType });
    return NextResponse.json({
      success: true,
      url: saved.url,
      id: saved.id,
      provider: saved.provider,
      filename,
    });
  } catch (err) {
    console.error("Admin image upload error:", err);
    return NextResponse.json({ success: false, error: "Failed to upload image." }, { status: 500 });
  }
}
