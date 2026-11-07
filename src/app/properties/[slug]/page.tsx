"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicPropertyDTO } from "@/types";
import InquiryModal from "@/components/inquiry/InquiryModal";
import PropertyCard from "@/components/property/PropertyCard";
import { 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Compass, 
  Car, 
  Layers, 
  Sparkles, 
  Send, 
  PhoneCall, 
  ShieldCheck, 
  ArrowLeft,
  Calendar,
  CheckCircle2
} from "lucide-react";

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [property, setProperty] = useState<PublicPropertyDTO | null>(null);
  const [similarProperties, setSimilarProperties] = useState<PublicPropertyDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/properties/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProperty(data.data);

          const simRes = await fetch(`/api/properties?category=${data.data.category}`);
          const simData = await simRes.json();
          if (simData.success && simData.data) {
            setSimilarProperties(simData.data.filter((p: PublicPropertyDTO) => p.id !== data.data.id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 w-48 liquid-glass rounded-xl animate-pulse" />
        <div className="h-[450px] w-full liquid-glass rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-claude-serif text-2xl text-[#EDE8E1]">Property Not Found</h2>
        <p className="text-xs sm:text-sm text-[#A39E96]">
          This listing may have been leased, sold, or paused by platform administrators.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 py-2 px-4 liquid-glass-btn text-[#EDE8E1] text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalogue
        </Link>
      </div>
    );
  }

  const images = property.media && property.media.length > 0
    ? property.media
    : [{ id: "def-1", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", altText: property.title, isCover: true, sortOrder: 1 }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#706D67]">
        <Link href="/properties" className="hover:text-[#EDE8E1] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Catalogue
        </Link>
        <span>/</span>
        <span className="text-[#A39E96]">{property.category.replace("_", " ")}</span>
        <span>/</span>
        <span className="text-[#EDE8E1] truncate max-w-xs">{property.title}</span>
      </div>

      {/* Hero Media Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden liquid-glass border-white/20 shadow-2xl">
          <Image
            src={images[activeImageIndex].url}
            alt={images[activeImageIndex].altText || property.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/90 via-transparent to-black/20 pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider liquid-glass-pill text-[#EDE8E1]">
              {property.category.replace("_", " ")}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CC785C] text-white shadow-md border border-white/20">
              For {property.transactionType}
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[#A39E96]">
              <MapPin className="w-4 h-4 text-[#CC785C]" />
              <span>{property.locality}, {property.city}, {property.state}</span>
            </div>
            <h1 className="font-claude-serif text-2xl sm:text-4xl md:text-5xl font-semibold text-[#EDE8E1] text-balance tracking-tight leading-tight">
              {property.title}
            </h1>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                  activeImageIndex === idx ? "border-[#CC785C] scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt={img.altText || ""} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Specs & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Specifications Matrix */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-claude-serif text-xl sm:text-2xl text-[#EDE8E1] font-semibold">
              Property Overview & Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(property.builtUpArea || property.plotArea) && (
                <div className="p-4 liquid-glass rounded-2xl space-y-1">
                  <div className="text-[11px] text-[#A39E96] flex items-center gap-1.5 font-medium">
                    <Maximize2 className="w-3.5 h-3.5 text-[#CC785C]" />
                    Built-up Area
                  </div>
                  <div className="text-sm font-semibold text-[#EDE8E1]">
                    {(property.builtUpArea || property.plotArea)?.toLocaleString()} {property.areaUnit}
                  </div>
                </div>
              )}

              {property.carpetArea && (
                <div className="p-4 liquid-glass rounded-2xl space-y-1">
                  <div className="text-[11px] text-[#A39E96] flex items-center gap-1.5 font-medium">
                    <Maximize2 className="w-3.5 h-3.5 text-[#CC785C]" />
                    Carpet Area
                  </div>
                  <div className="text-sm font-semibold text-[#EDE8E1]">
                    {property.carpetArea?.toLocaleString()} {property.areaUnit}
                  </div>
                </div>
              )}

              {property.bedrooms && (
                <div className="p-4 liquid-glass rounded-2xl space-y-1">
                  <div className="text-[11px] text-[#A39E96] flex items-center gap-1.5 font-medium">
                    <Bed className="w-3.5 h-3.5 text-[#CC785C]" />
                    Bedrooms
                  </div>
                  <div className="text-sm font-semibold text-[#EDE8E1]">
                    {property.bedrooms} BHK
                  </div>
                </div>
              )}

              {property.bathrooms && (
                <div className="p-4 liquid-glass rounded-2xl space-y-1">
                  <div className="text-[11px] text-[#A39E96] flex items-center gap-1.5 font-medium">
                    <Bath className="w-3.5 h-3.5 text-[#CC785C]" />
                    Bathrooms
                  </div>
                  <div className="text-sm font-semibold text-[#EDE8E1]">
                    {property.bathrooms} Baths
                  </div>
                </div>
              )}

              {property.facing && (
                <div className="p-4 liquid-glass rounded-2xl space-y-1">
                  <div className="text-[11px] text-[#A39E96] flex items-center gap-1.5 font-medium">
                    <Compass className="w-3.5 h-3.5 text-[#CC785C]" />
                    Facing
                  </div>
                  <div className="text-sm font-semibold text-[#EDE8E1]">
                    {property.facing.replace("_", " ")}
                  </div>
                </div>
              )}

              {property.parkingCount !== undefined && (
                <div className="p-4 liquid-glass rounded-2xl space-y-1">
                  <div className="text-[11px] text-[#A39E96] flex items-center gap-1.5 font-medium">
                    <Car className="w-3.5 h-3.5 text-[#CC785C]" />
                    Parking
                  </div>
                  <div className="text-sm font-semibold text-[#EDE8E1]">
                    {property.parkingCount} Covered
                  </div>
                </div>
              )}

              {property.floorNumber !== undefined && property.totalFloors !== undefined && (
                <div className="p-4 liquid-glass rounded-2xl space-y-1">
                  <div className="text-[11px] text-[#A39E96] flex items-center gap-1.5 font-medium">
                    <Layers className="w-3.5 h-3.5 text-[#CC785C]" />
                    Floor Level
                  </div>
                  <div className="text-sm font-semibold text-[#EDE8E1]">
                    {property.floorNumber} of {property.totalFloors}
                  </div>
                </div>
              )}

              {property.furnishing && (
                <div className="p-4 liquid-glass rounded-2xl space-y-1">
                  <div className="text-[11px] text-[#A39E96] flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#CC785C]" />
                    Furnishing
                  </div>
                  <div className="text-sm font-semibold text-[#EDE8E1]">
                    {property.furnishing.replace("_", " ")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-claude-serif text-xl sm:text-2xl text-[#EDE8E1] font-semibold">
              Property Description
            </h3>
            <p className="text-xs sm:text-sm text-[#A39E96] leading-relaxed whitespace-pre-line font-claude-sans">
              {property.description}
            </p>
          </div>

          {/* Amenities list */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-claude-serif text-xl sm:text-2xl text-[#EDE8E1] font-semibold">
                Amenities & Infrastructure
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-xs sm:text-sm text-[#EDE8E1] liquid-glass p-3 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Advisory & Pricing Box */}
        <div className="space-y-6">
          <div className="liquid-glass-elevated rounded-3xl p-6 sm:p-8 space-y-6 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CC785C] liquid-glass-pill px-3 py-1 rounded-full border-[#CC785C]/30">
                Verified Mandate
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Admin Curated
              </span>
            </div>

            {/* Pricing Standard Notice */}
            <div className="liquid-glass rounded-2xl p-4 space-y-2 border-white/[0.08]">
              <div className="text-[11px] uppercase tracking-wider text-[#EDE8E1] font-bold font-claude-sans">
                Private Price Schedule
              </div>
              <p className="text-xs text-[#A39E96] leading-relaxed">
                In compliance with platform discretion policy, certified pricing, payment plans, and verified title records are disclosed directly by our advisory desk upon qualified inquiry.
              </p>
              <div className="pt-2 text-xs text-[#706D67] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#CC785C]" />
                <span>Response Target: Within business hours</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="w-full py-3.5 px-4 liquid-glass-btn-accent text-white text-sm font-semibold rounded-2xl shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Inquiry to Get Price</span>
            </button>

            {/* Direct Phone Call */}
            <a
              href="tel:+918000000000"
              className="w-full py-3 px-4 liquid-glass hover:border-white/30 text-[#EDE8E1] text-xs font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call Advisory Desk (+91 80000 00000)</span>
            </a>

            <div className="text-center text-[10px] text-[#706D67]">
              Zero signup required to browse. Direct routing to assigned desk managers.
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-white/[0.08] space-y-6">
          <h3 className="font-claude-serif text-2xl text-[#EDE8E1] font-semibold">
            Similar Properties in {property.category.replace("_", " ")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        property={property}
      />
    </div>
  );
}
