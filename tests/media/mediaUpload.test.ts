import { describe, it, expect } from "vitest";
import { saveMediaAsset, getMediaAsset } from "@/lib/media/storage";

describe("Media Storage & Asset Pipeline", () => {
  it("should successfully store an image buffer and generate a persistent retrieval URL", async () => {
    // 1x1 transparent PNG buffer
    const samplePng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

    const saved = await saveMediaAsset({
      buffer: samplePng,
      filename: "test-facade.png",
      mimeType: "image/png",
    });

    expect(saved).toBeDefined();
    expect(saved.url).toContain(saved.id);
    expect(saved.id).toMatch(/^med-/);

    // Retrieve the media asset
    const retrieved = await getMediaAsset(saved.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.mimeType).toBe("image/png");
    expect(retrieved?.buffer.length).toBe(samplePng.length);
  });
});
