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
  PhoneCall, 
  Send, 
  Check, 
  Sparkles 
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
      <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
        {/* Image & Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <Image
            src={coverImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

          {/* Category & Intent Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm">
              {property.category.replace("_", " ")}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm ${
              property.transactionType === "SALE" ? "bg-brand-600/90" : "bg-emerald-600/90"
            }`}>
              For {property.transactionType}
            </span>
          </div>

          {/* Action buttons (Fav & Compare) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {onCompareToggle && (
              <button
                type="button"
                onClick={() => onCompareToggle(property.id)}
                title="Compare specification"
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  isCompared
                    ? "bg-brand-600 text-white"
                    : "bg-white/80 hover:bg-white text-slate-700"
                }`}
              >
                <Check className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => toggleFavourite(property.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isFav
                  ? "bg-red-500 text-white"
                  : "bg-white/80 hover:bg-white text-slate-700"
              }`}
              title={isFav ? "Saved" : "Save property"}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Subtype Badge bottom */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-white text-xs font-medium drop-shadow-md">
              {property.subtype}
            </span>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>

            {/* Title */}
            <Link href={`/properties/${property.slug}`}>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                {property.title}
              </h3>
            </Link>

            {/* Spec Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-600 flex-wrap">
              {(property.builtUpArea || property.plotArea) && (
                <div className="flex items-center gap-1 font-medium">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {(property.builtUpArea || property.plotArea)?.toLocaleString()} {property.areaUnit}
                  </span>
                </div>
              )}
              {property.bedrooms && (
                <div className="flex items-center gap-1 font-medium">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.bedrooms} BHK</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1 font-medium">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              {property.furnishing && (
                <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {property.furnishing.replace("_", " ")}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Policy Notice & CTA Button (NO PRICE VALUES EVER!) */}
          <div className="mt-5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pricing Status
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-brand-600" />
                Inquire for Price
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/properties/${property.slug}`}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center transition-colors flex items-center justify-center"
              >
                View Specs
              </Link>
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Get Price</span>
              </button>
            </div>
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
