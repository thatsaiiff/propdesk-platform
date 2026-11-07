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
  ArrowUpRight
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
      <div className="group liquid-glass liquid-glass-interactive rounded-3xl overflow-hidden flex flex-col justify-between relative transform-gpu">
        <div>
          {/* Cover Media */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#121215]">
            <Image
              src={coverImage}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            {/* Ambient glass tint overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/80 via-transparent to-black/20" />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider liquid-glass-pill text-[#EDE8E1]">
                {property.category.replace("_", " ")}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md ${
                property.transactionType === "SALE" 
                  ? "bg-[#CC785C]/80 border border-[#CC785C]/40" 
                  : "bg-emerald-600/80 border border-emerald-400/40"
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
                  className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-[0.98] ${
                    isCompared
                      ? "bg-[#CC785C] text-white border border-white/30 shadow-md"
                      : "liquid-glass text-[#A39E96] hover:text-[#EDE8E1] hover:border-white/30"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleFavourite(property.id)}
                className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-[0.98] ${
                  isFav
                    ? "bg-red-500/90 text-white border border-red-400/40"
                    : "liquid-glass text-[#A39E96] hover:text-[#EDE8E1] hover:border-white/30"
                }`}
                title={isFav ? "Saved to favourites" : "Save property"}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Subtype bottom badge */}
            <div className="absolute bottom-3 left-3 z-10">
              <span className="text-xs text-[#EDE8E1] font-medium liquid-glass-pill px-2.5 py-0.5 rounded-full">
                {property.subtype}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 sm:p-6 space-y-3.5">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-[#A39E96]">
              <MapPin className="w-3.5 h-3.5 text-[#CC785C] shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>

            {/* Title - Claude Serif typography */}
            <Link href={`/properties/${property.slug}`} className="block group/link">
              <h3 className="font-claude-serif text-lg font-semibold text-[#EDE8E1] group-hover/link:text-[#CC785C] transition-colors duration-300 line-clamp-2 leading-snug">
                {property.title}
              </h3>
            </Link>

            {/* Spec Bar */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center gap-3 text-xs text-[#A39E96] flex-wrap">
              {(property.builtUpArea || property.plotArea) && (
                <div className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#706D67]" />
                  <span>
                    {(property.builtUpArea || property.plotArea)?.toLocaleString()} {property.areaUnit}
                  </span>
                </div>
              )}
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-[#706D67]" />
                  <span>{property.bedrooms} BHK</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-[#706D67]" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              {property.furnishing && (
                <div className="text-[11px] text-[#A39E96] liquid-glass px-2 py-0.5 rounded-md">
                  {property.furnishing.replace("_", " ")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Policy Status & CTAs */}
        <div className="p-5 sm:p-6 pt-0 space-y-3">
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            <span className="text-[10px] uppercase tracking-wider text-[#706D67] font-bold">
              Pricing Policy
            </span>
            <span className="text-xs text-[#CC785C] liquid-glass-pill px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 border-[#CC785C]/30">
              <Sparkles className="w-3 h-3 text-[#CC785C]" />
              Inquire for Schedule
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/properties/${property.slug}`}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-center liquid-glass hover:border-white/30 text-[#EDE8E1] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1"
            >
              <span>View Specs</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#A39E96]" />
            </Link>
            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-center liquid-glass-btn-accent text-white transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Get Pricing</span>
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
