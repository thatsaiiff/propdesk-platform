import { prisma, isDbActive } from "@/lib/db/prisma";
import { put } from "@vercel/blob";

// In-memory fallback cache for serverless lifecycles
const inMemoryMedia = new Map<string, { mimeType: string; data: string; filename?: string }>();

export interface UploadMediaResult {
  url: string;
  id: string;
  provider: "vercel_blob" | "cloudinary" | "database" | "memory";
}

/**
 * Stores an image asset using the best available storage provider:
 * 1. Vercel Blob (if BLOB_READ_WRITE_TOKEN is configured)
 * 2. Cloudinary (if CLOUDINARY_* is configured)
 * 3. PostgreSQL MediaAsset table (guaranteed persistent Neon DB storage)
 * 4. In-memory cache fallback
 */
export async function saveMediaAsset({
  buffer,
  filename = "property-photo.jpg",
  mimeType = "image/jpeg",
}: {
  buffer: Buffer;
  filename?: string;
  mimeType?: string;
}): Promise<UploadMediaResult> {
  const assetId = `med-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const cleanFilename = `${assetId}-${filename.replace(/[^a-zA-Z0-9._-]/g, "")}`;

  // 1. Check for Vercel Blob Storage
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(cleanFilename, buffer, {
        access: "public",
        contentType: mimeType,
      });
      return {
        url: blob.url,
        id: assetId,
        provider: "vercel_blob",
      };
    } catch (err) {
      console.warn("[MediaStorage] Vercel Blob upload failed, falling back to database:", err);
    }
  }

  // 2. Check for Cloudinary
  const cloudinaryCloud = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudinaryPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
  if (cloudinaryCloud && (cloudinaryPreset || cloudinaryApiKey)) {
    try {
      const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;
      const formData = new URLSearchParams();
      formData.append("file", base64Data);
      if (cloudinaryPreset) formData.append("upload_preset", cloudinaryPreset);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloud}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const cloudData = await cloudRes.json();
      if (cloudData.secure_url) {
        return {
          url: cloudData.secure_url,
          id: cloudData.public_id || assetId,
          provider: "cloudinary",
        };
      }
    } catch (err) {
      console.warn("[MediaStorage] Cloudinary upload failed, falling back to database:", err);
    }
  }

  // 3. Persistent Database Storage (PostgreSQL Neon)
  const base64 = buffer.toString("base64");
  inMemoryMedia.set(assetId, { mimeType, data: base64, filename });

  if (isDbActive() && prisma) {
    try {
      await prisma.mediaAsset.create({
        data: {
          id: assetId,
          mimeType,
          data: base64,
          sizeBytes: buffer.length,
          filename,
        },
      });
      return {
        url: `/api/media/${assetId}`,
        id: assetId,
        provider: "database",
      };
    } catch (err) {
      console.warn("[MediaStorage] Database MediaAsset save failed, keeping in memory:", err);
    }
  }

  return {
    url: `/api/media/${assetId}`,
    id: assetId,
    provider: "memory",
  };
}

/**
 * Retrieves a media asset by ID, either from Neon Database or memory cache.
 */
export async function getMediaAsset(id: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  // Check memory first
  if (inMemoryMedia.has(id)) {
    const item = inMemoryMedia.get(id)!;
    return {
      buffer: Buffer.from(item.data, "base64"),
      mimeType: item.mimeType,
    };
  }

  // Check Database
  if (isDbActive() && prisma) {
    try {
      const record = await prisma.mediaAsset.findUnique({
        where: { id },
      });
      if (record && record.data) {
        // Cache in memory for fast subsequent access
        inMemoryMedia.set(id, { mimeType: record.mimeType, data: record.data, filename: record.filename || undefined });
        return {
          buffer: Buffer.from(record.data, "base64"),
          mimeType: record.mimeType,
        };
      }
    } catch (err) {
      console.warn(`[MediaStorage] Error retrieving media ${id} from database:`, err);
    }
  }

  return null;
}
