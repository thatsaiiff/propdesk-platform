import { InternalPropertyListing, PublicPropertyDTO } from "@/types";

/**
 * Transforms an internal property listing into a sanitized public DTO.
 * STRICT SECURITY INVARIANT:
 * - Omits all price fields (privateSalePrice, privateRentAmount, privateDeposit, priceNegotiable)
 * - Omits internal admin notes and owner contact details
 * - Omits draft/in-review/private records unless explicitly handled by admin
 */
export function toPublicPropertyDTO(listing: InternalPropertyListing): PublicPropertyDTO {
  const images = listing.media || listing.images || [];
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    subtype: listing.subtype,
    transactionType: listing.transactionType,
    state: listing.state,
    city: listing.city,
    locality: listing.locality,
    builtUpArea: listing.builtUpArea,
    carpetArea: listing.carpetArea,
    plotArea: listing.plotArea,
    area: listing.area,
    areaUnit: listing.areaUnit,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    balconies: listing.balconies,
    floorNumber: listing.floorNumber,
    totalFloors: listing.totalFloors,
    furnishing: listing.furnishing,
    facing: listing.facing,
    parkingCount: listing.parkingCount,
    ageOfProperty: listing.ageOfProperty,
    amenities: listing.amenities ? [...listing.amenities] : [],
    images: images.map(m => ({
      id: m.id,
      url: m.url,
      altText: m.altText,
      label: m.label || m.altText,
      isCover: m.isCover,
      sortOrder: m.sortOrder,
    })),
    media: images.map(m => ({
      id: m.id,
      url: m.url,
      altText: m.altText,
      label: m.label || m.altText,
      isCover: m.isCover,
      sortOrder: m.sortOrder,
    })),
    ctaLabel: listing.transactionType === "RENT" ? "Call to Get Rent" : "Send Inquiry / Get Price",
    publishedAt: listing.publishedAt,
    updatedAt: listing.updatedAt,
  };
}

/**
 * Sanitizes an array of listings, filtering for public visibility only.
 */
export function toPublicPropertyDTOList(listings: InternalPropertyListing[]): PublicPropertyDTO[] {
  return listings
    .filter(l => l.visibility === "PUBLIC" && (l.status === "PUBLISHED" || l.status === "SOLD" || l.status === "RENTED"))
    .map(toPublicPropertyDTO);
}
