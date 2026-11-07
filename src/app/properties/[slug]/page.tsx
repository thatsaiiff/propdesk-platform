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

          // Fetch similar
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
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-[450px] w-full bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-sm text-slate-500">
          This listing may have been leased, sold, or paused by our platform administrators.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
      </div>
    );
  }

  const images = property.media && property.media.length > 0
    ? property.media
    : [{ id: "def-1", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", altText: property.title, isCover: true, sortOrder: 1 }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/properties" className="hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Catalogue
        </Link>
        <span>/</span>
        <span className="text-slate-700">{property.category.replace("_", " ")}</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{property.title}</span>
      </div>

      {/* Hero Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900 shadow-md">
          <Image
            src={images[activeImageIndex].url}
            alt={images[activeImageIndex].altText || property.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-white text-slate-900 shadow-md">
              {property.category.replace("_", " ")}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-600 text-white shadow-md">
              For {property.transactionType}
            </span>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>{property.locality}, {property.city}, {property.state}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {property.title}
            </h1>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? "border-brand-600 scale-105" : "border-transparent opacity-75 hover:opacity-100"
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
        {/* Left Column: Facts & Specs & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Specification Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Property Overview & Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {(property.builtUpArea || property.plotArea) && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-brand-600" />
                    Built-up Area
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {(property.builtUpArea || property.plotArea)?.toLocaleString()} {property.areaUnit}
                  </div>
                </div>
              )}

              {property.carpetArea && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-brand-600" />
                    Carpet Area
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {property.carpetArea?.toLocaleString()} {property.areaUnit}
                  </div>
                </div>
              )}

              {property.bedrooms && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-brand-600" />
                    Bedrooms
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {property.bedrooms} BHK
                  </div>
                </div>
              )}

              {property.bathrooms && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-brand-600" />
                    Bathrooms
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {property.bathrooms} Baths
                  </div>
                </div>
              )}

              {property.facing && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-brand-600" />
                    Facing
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {property.facing.replace("_", " ")}
                  </div>
                </div>
              )}

              {property.parkingCount !== undefined && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-brand-600" />
                    Parking
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {property.parkingCount} Covered
                  </div>
                </div>
              )}

              {property.floorNumber !== undefined && property.totalFloors !== undefined && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    Floor Level
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {property.floorNumber} of {property.totalFloors}
                  </div>
                </div>
              )}

              {property.furnishing && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    Furnishing
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {property.furnishing.replace("_", " ")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Property Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Infrastructure */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Amenities & Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing Transparency Callout & Advisory CTA Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-brand-500/20 shadow-xl p-6 sm:p-8 space-y-6 sticky top-24">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                Verified Mandate
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Curated
              </span>
            </div>

            {/* Pricing Advisory Notice (NO PRICE KEY EVER DISPLAYED) */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Private Price Schedule
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In compliance with platform policy, certified pricing, payment schedules, and verified title documents are disclosed directly by our advisory desk upon qualified inquiry.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>Response Target: Within staffed hours</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Inquiry to Get Price</span>
            </button>

            {/* Phone CTA */}
            <a
              href="tel:+918000000000"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call Advisory Desk (+91 80000 00000)</span>
            </a>

            <div className="text-center text-[11px] text-slate-400">
              Zero registration required to browse • Complete inquiries are routed directly to assigned managers.
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">
            Similar Properties in {property.category.replace("_", " ")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        property={property}
      />
    </div>
  );
}
