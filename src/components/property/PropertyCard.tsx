"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicPropertyDTO } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { 
  Heart, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Send, 
  Check, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import InquiryModal from "../inquiry/InquiryModal";

interface PropertyCardProps {
  property: PublicPropertyDTO;
  onCompareToggle?: (propertyId: string) => void;
  isCompared?: boolean;
}

export default function PropertyCard({ property, onCompareToggle, isCompared }: PropertyCardProps) {
  const { favourites, toggleFavourite } = useAuth();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const isFav = favourites.includes(property.id);
  const coverImage = property.media?.find((m) => m.isCover)?.url || property.media?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

  return (
    <>
      <div className="group bg-[#181818] rounded-3xl border border-[#272727] hover:border-[#3a3a3a] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden flex flex-col justify-between shadow-xl">
        <div>
          {/* Cover Media */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#1F1F1F]">
            <Image
              src={coverImage}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span className="px-2.5 py-1 rounded-lg caption-3 font-semibold uppercase tracking-wider bg-[#181818]/90 text-white backdrop-blur-md border border-[#272727]">
                {property.category.replace("_", " ")}
              </span>
              <span className={`px-2.5 py-1 rounded-lg caption-3 font-semibold uppercase tracking-wider text-white backdrop-blur-md ${
                property.transactionType === "SALE" ? "bg-blue-600/90" : "bg-emerald-600/90"
              }`}>
                For {property.transactionType}
              </span>
            </div>

            {/* Actions top right */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              {onCompareToggle && (
                <button
                  type="button"
                  onClick={() => onCompareToggle(property.id)}
                  title="Compare specifications"
                  className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] ${
                    isCompared
                      ? "bg-blue-600 text-white"
                      : "bg-[#181818]/80 hover:bg-[#181818] text-[#9B9B9B] hover:text-white border border-[#272727]"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleFavourite(property.id)}
                className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] ${
                  isFav
                    ? "bg-red-600 text-white"
                    : "bg-[#181818]/80 hover:bg-[#181818] text-[#9B9B9B] hover:text-white border border-[#272727]"
                }`}
                title={isFav ? "Saved to favourites" : "Save property"}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Subtype bottom badge */}
            <div className="absolute bottom-3 left-3 z-10">
              <span className="caption-4 text-white font-medium bg-[#181818]/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-[#272727]">
                {property.subtype}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-4">
            {/* Location */}
            <div className="flex items-center gap-1.5 caption-4 text-[#9B9B9B]">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>

            {/* Title */}
            <Link href={`/properties/${property.slug}`}>
              <h3 className="title-2 text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-snug">
                {property.title}
              </h3>
            </Link>

            {/* Spec Bar */}
            <div className="pt-3 border-t border-[#272727] flex items-center gap-4 caption-2 text-[#9B9B9B] flex-wrap">
              {(property.builtUpArea || property.plotArea) && (
                <div className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#666666]" />
                  <span>
                    {(property.builtUpArea || property.plotArea)?.toLocaleString()} {property.areaUnit}
                  </span>
                </div>
              )}
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-[#666666]" />
                  <span>{property.bedrooms} BHK</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-[#666666]" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              {property.furnishing && (
                <div className="caption-5 text-[#9B9B9B] bg-[#1F1F1F] border border-[#272727] px-2 py-0.5 rounded-md">
                  {property.furnishing.replace("_", " ")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Policy Status & CTAs */}
        <div className="p-6 pt-0 space-y-3">
          <div className="flex items-center justify-between pt-3 border-t border-[#272727]">
            <span className="caption-4 uppercase tracking-wider text-[#666666] font-bold">
              Pricing Status
            </span>
            <span className="caption-4 text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Inquire for Schedule
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/properties/${property.slug}`}
              className="py-2 px-3 rounded-xl button-sm text-center bg-[#1F1F1F] hover:bg-[#272727] text-white border border-[#272727] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] flex items-center justify-center"
            >
              View Specs
            </Link>
            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="py-2 px-3 rounded-xl button-sm text-center bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Get Price</span>
            </button>
          </div>
        </div>
      </div>

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        property={property}
      />
    </>
  );
}
