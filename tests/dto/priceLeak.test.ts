import { describe, it, expect } from "vitest";
import { toPublicPropertyDTO, toPublicPropertyDTOList } from "@/server/dto/propertyDto";
import { InternalPropertyListing } from "@/types";

describe("Security Test: Price Privacy & DTO Leak Prevention", () => {
  const sampleInternalListing: InternalPropertyListing = {
    id: "prop-101",
    slug: "luxury-4bhk-worli-sea-face",
    title: "Luxury 4 BHK with Panoramic Sea Views",
    description: "Expansive modern apartment on Worli Sea Face with bespoke finishes.",
    category: "RESIDENTIAL",
    subtype: "Apartment",
    transactionType: "SALE",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    state: "Maharashtra",
    city: "Mumbai",
    locality: "Worli Sea Face",
    pincode: "400018",
    builtUpArea: 3800,
    carpetArea: 3200,
    areaUnit: "sq.ft.",
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    floorNumber: 24,
    totalFloors: 40,
    furnishing: "FULLY_FURNISHED",
    facing: "WEST",
    parkingCount: 3,
    ageOfProperty: "0-1 years",
    amenities: ["Infinity Pool", "Clubhouse", "Concierge", "Sea View", "Private Elevator"],
    media: [
      {
        id: "med-1",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        altText: "Living room sea view",
        isCover: true,
        sortOrder: 1,
      },
    ],
    // CONFIDENTIAL PRIVATE VALUES
    privateSalePrice: 185000000, // 18.5 Crores
    privateRentAmount: 0,
    privateDeposit: 0,
    priceNegotiable: true,
    internalNotes: "Owner eager to close before end of financial quarter. Minimum floor 17.5 Cr.",
    ownerContactName: "Secret Seller",
    ownerContactPhone: "+919876543210",
    createdByStaffId: "staff-1",
    publishedAt: "2026-11-01T10:00:00Z",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-11-01T10:00:00Z",
  };

  it("should never include privateSalePrice, privateRentAmount, or any price field in the public DTO", () => {
    const publicDTO = toPublicPropertyDTO(sampleInternalListing);

    // Hard assertions on explicit fields
    expect((publicDTO as any).privateSalePrice).toBeUndefined();
    expect((publicDTO as any).privateRentAmount).toBeUndefined();
    expect((publicDTO as any).privateDeposit).toBeUndefined();
    expect((publicDTO as any).priceNegotiable).toBeUndefined();
    expect((publicDTO as any).internalNotes).toBeUndefined();
    expect((publicDTO as any).ownerContactName).toBeUndefined();
    expect((publicDTO as any).ownerContactPhone).toBeUndefined();

    // Deep check all keys on the public DTO
    const keys = Object.keys(publicDTO);
    const priceKeys = keys.filter(k => k.toLowerCase().includes("price") || k.toLowerCase().includes("rent") || k.toLowerCase().includes("cost"));
    expect(priceKeys).toEqual([]);

    // Stringify JSON test: verify no secret numbers leak
    const serialized = JSON.stringify(publicDTO);
    expect(serialized).not.toContain("185000000");
    expect(serialized).not.toContain("Secret Seller");
    expect(serialized).not.toContain("+919876543210");
    expect(serialized).not.toContain("17.5 Cr");
  });

  it("should filter out DRAFT, PAUSED and non-PUBLIC listings from public listing lists", () => {
    const draftListing: InternalPropertyListing = {
      ...sampleInternalListing,
      id: "prop-102",
      status: "DRAFT",
    };
    const pausedListing: InternalPropertyListing = {
      ...sampleInternalListing,
      id: "prop-103",
      status: "PAUSED",
    };
    const jvListing: InternalPropertyListing = {
      ...sampleInternalListing,
      id: "prop-104",
      visibility: "BUILDER_ONLY",
    };

    const publicList = toPublicPropertyDTOList([
      sampleInternalListing,
      draftListing,
      pausedListing,
      jvListing,
    ]);

    expect(publicList).toHaveLength(1);
    expect(publicList[0].id).toBe("prop-101");
  });
});
