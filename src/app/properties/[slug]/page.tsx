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
        <div className="h-8 w-48 bg-[#181818] rounded-xl animate-pulse" />
        <div className="h-[450px] w-full bg-[#181818] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="heading-4 text-white">Property Not Found</h2>
        <p className="body-5 text-[#9B9B9B]">
          This listing may have been leased, sold, or paused by platform administrators.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 py-2 px-4 bg-white text-black button-sm rounded-xl"
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
      <div className="flex items-center gap-2 caption-3 text-[#666666]">
        <Link href="/properties" className="hover:text-white flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Catalogue
        </Link>
        <span>/</span>
        <span className="text-[#9B9B9B]">{property.category.replace("_", " ")}</span>
        <span>/</span>
        <span className="text-white truncate max-w-xs">{property.title}</span>
      </div>

      {/* Hero Media Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-[#181818] border border-[#272727] shadow-2xl">
          <Image
            src={images[activeImageIndex].url}
            alt={images[activeImageIndex].altText || property.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-xl caption-3 font-semibold uppercase tracking-wider bg-[#181818]/90 text-white backdrop-blur-md border border-[#272727]">
              {property.category.replace("_", " ")}
            </span>
            <span className="px-3 py-1 rounded-xl caption-3 font-semibold uppercase tracking-wider bg-blue-600 text-white shadow-md">
              For {property.transactionType}
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-1.5 caption-3 text-[#9B9B9B]">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{property.locality}, {property.city}, {property.state}</span>
            </div>
            <h1 className="heading-4 sm:heading-3 font-bold text-white text-balance">
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
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  activeImageIndex === idx ? "border-blue-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
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
          <div className="bg-[#181818] rounded-3xl border border-[#272727] p-8 space-y-6 shadow-xl">
            <h3 className="title-2 text-white">
              Property Overview and Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(property.builtUpArea || property.plotArea) && (
                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#272727] space-y-1">
                  <div className="caption-4 text-[#9B9B9B] flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    Built-up Area
                  </div>
                  <div className="title-3 text-white">
                    {(property.builtUpArea || property.plotArea)?.toLocaleString()} {property.areaUnit}
                  </div>
                </div>
              )}

              {property.carpetArea && (
                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#272727] space-y-1">
                  <div className="caption-4 text-[#9B9B9B] flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    Carpet Area
                  </div>
                  <div className="title-3 text-white">
                    {property.carpetArea?.toLocaleString()} {property.areaUnit}
                  </div>
                </div>
              )}

              {property.bedrooms && (
                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#272727] space-y-1">
                  <div className="caption-4 text-[#9B9B9B] flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-blue-400" />
                    Bedrooms
                  </div>
                  <div className="title-3 text-white">
                    {property.bedrooms} BHK
                  </div>
                </div>
              )}

              {property.bathrooms && (
                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#272727] space-y-1">
                  <div className="caption-4 text-[#9B9B9B] flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-blue-400" />
                    Bathrooms
                  </div>
                  <div className="title-3 text-white">
                    {property.bathrooms} Baths
                  </div>
                </div>
              )}

              {property.facing && (
                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#272727] space-y-1">
                  <div className="caption-4 text-[#9B9B9B] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-400" />
                    Facing
                  </div>
                  <div className="title-3 text-white">
                    {property.facing.replace("_", " ")}
                  </div>
                </div>
              )}

              {property.parkingCount !== undefined && (
                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#272727] space-y-1">
                  <div className="caption-4 text-[#9B9B9B] flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-400" />
                    Parking
                  </div>
                  <div className="title-3 text-white">
                    {property.parkingCount} Covered
                  </div>
                </div>
              )}

              {property.floorNumber !== undefined && property.totalFloors !== undefined && (
                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#272727] space-y-1">
                  <div className="caption-4 text-[#9B9B9B] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    Floor Level
                  </div>
                  <div className="title-3 text-white">
                    {property.floorNumber} of {property.totalFloors}
                  </div>
                </div>
              )}

              {property.furnishing && (
                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#272727] space-y-1">
                  <div className="caption-4 text-[#9B9B9B] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Furnishing
                  </div>
                  <div className="title-3 text-white">
                    {property.furnishing.replace("_", " ")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#181818] rounded-3xl border border-[#272727] p-8 space-y-4 shadow-xl">
            <h3 className="title-2 text-white">Property Description</h3>
            <p className="body-5 text-[#9B9B9B] leading-relaxed whitespace-pre-line text-pretty">
              {property.description}
            </p>
          </div>

          {/* Amenities list */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-[#181818] rounded-3xl border border-[#272727] p-8 space-y-4 shadow-xl">
              <h3 className="title-2 text-white">Amenities and Infrastructure</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 body-5 text-white bg-[#1F1F1F] p-3 rounded-xl border border-[#272727]"
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
          <div className="bg-[#181818] rounded-3xl border border-[#272727] p-6 sm:p-8 space-y-6 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="caption-3 font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2.5 py-1 rounded-lg">
                Verified Mandate
              </span>
              <span className="caption-4 text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Admin Curated
              </span>
            </div>

            {/* Pricing Standard Notice */}
            <div className="bg-[#1F1F1F] rounded-2xl p-4 border border-[#272727] space-y-2">
              <div className="caption-3 uppercase tracking-wider text-white font-bold">
                Private Price Schedule
              </div>
              <p className="caption-2 text-[#9B9B9B] leading-relaxed">
                In compliance with platform policy, certified pricing, payment plans, and verified title records are disclosed directly by our advisory desk upon qualified inquiry.
              </p>
              <div className="pt-2 caption-4 text-[#666666] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Response Target: Within business hours</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="w-full py-3.5 px-4 bg-white hover:bg-[#e0e0e0] text-black button-md rounded-2xl shadow-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Inquiry to Get Price</span>
            </button>

            {/* Direct Phone Call */}
            <a
              href="tel:+918000000000"
              className="w-full py-3 px-4 bg-[#1F1F1F] hover:bg-[#272727] text-white button-sm rounded-2xl border border-[#272727] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call Advisory Desk (+91 80000 00000)</span>
            </a>

            <div className="text-center caption-5 text-[#666666]">
              Zero signup required to browse. Direct routing to assigned desk managers.
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-[#272727] space-y-6">
          <h3 className="title-1 text-white">
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
