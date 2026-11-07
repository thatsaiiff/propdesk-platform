"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { PublicPropertyDTO } from "@/types";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { 
  MapPin, 
  Maximize2, 
  ChevronUp, 
  ChevronDown, 
  Zap, 
  Sparkles, 
  AlertTriangle,
  Building2,
  Lock,
  Layers,
  Check,
  X,
  PhoneCall
} from "lucide-react";

interface TinderCardProps {
  property: PublicPropertyDTO;
  onSwipe: (action: "SKIPPED" | "INTERESTED") => void;
  onContactImmediately: () => void;
  isFrontCard: boolean;
}

export default function TinderCard({
  property,
  onSwipe,
  onContactImmediately,
  isFrontCard,
}: TinderCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  // Motion values for drag physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18]);
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0.6, 1, 1, 1, 0.6]);

  // Stamp opacity transforms
  const interestedOpacity = useTransform(x, [40, 140], [0, 1]);
  const notInterestedOpacity = useTransform(x, [-40, -140], [0, 1]);

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ id: "fallback", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", sortOrder: 1 }];

  const currentPhoto = images[photoIndex] || images[0];

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (photoIndex < images.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    } else {
      setPhotoIndex(0); // Cycle back to first photo
    }
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (photoIndex > 0) {
      setPhotoIndex((prev) => prev - 1);
    } else {
      setPhotoIndex(images.length - 1);
    }
  };

  // Vertical Touch Swipe Gesture detection specifically on photo area
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    // Up swipe (swipe up -> next photo)
    if (diff > 40) {
      handleNextPhoto();
    }
    // Down swipe (swipe down -> previous photo)
    else if (diff < -40) {
      handlePrevPhoto();
    }
    touchStartY.current = null;
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 120) {
      setExitDirection("right");
      onSwipe("INTERESTED");
    } else if (info.offset.x < -120) {
      setExitDirection("left");
      onSwipe("SKIPPED");
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        zIndex: isFrontCard ? 10 : 5,
      }}
      drag={isFrontCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection === "right"
          ? { x: 800, opacity: 0, rotate: 25 }
          : exitDirection === "left"
          ? { x: -800, opacity: 0, rotate: -25 }
          : { x: 0, opacity: 1, rotate: 0 }
      }
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="absolute inset-0 w-full max-w-md mx-auto touch-none select-none cursor-grab active:cursor-grabbing"
    >
      <div className="w-full h-full liquid-glass-elevated rounded-3xl overflow-hidden flex flex-col justify-between border border-white/20 shadow-2xl relative bg-[#0C1222]/90 backdrop-blur-2xl">
        {/* Subtle Stamp Indicators during Drag */}
        <motion.div
          style={{ opacity: interestedOpacity }}
          className="absolute top-8 left-8 z-30 pointer-events-none transform -rotate-12 border-2 border-emerald-400 bg-emerald-500/30 text-emerald-300 font-extrabold text-lg sm:text-xl px-4 py-1.5 rounded-xl uppercase tracking-widest backdrop-blur-md shadow-2xl"
        >
          INTERESTED
        </motion.div>

        <motion.div
          style={{ opacity: notInterestedOpacity }}
          className="absolute top-8 right-8 z-30 pointer-events-none transform rotate-12 border-2 border-red-500 bg-red-500/30 text-red-300 font-extrabold text-lg sm:text-xl px-4 py-1.5 rounded-xl uppercase tracking-widest backdrop-blur-md shadow-2xl"
        >
          NOT INTERESTED
        </motion.div>

        {/* Top Half: Interactive Photograph Area with Vertical Swipe */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[210px] sm:h-[250px] w-full overflow-hidden bg-slate-900 group/photo shrink-0"
        >
          <Image
            src={currentPhoto.url}
            alt={property.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover object-center pointer-events-none transition-all duration-500"
          />

          {/* Photo Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1222] via-transparent to-black/40 pointer-events-none" />

          {/* Vertical Photo Controls & Indicator Dots */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
            <button
              onClick={handlePrevPhoto}
              title="Previous photo (or swipe down)"
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-1 my-0.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    photoIndex === idx ? "bg-amber-400 scale-125" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextPhoto}
              title="Next photo (or swipe up)"
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Badges on Top Left */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5">
            {property.isDisputed ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 border border-amber-300 shadow-md flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-slate-950" />
                Maximum Discount Opportunity
              </span>
            ) : property.isJointVenture ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white border border-emerald-400 shadow-md flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-200" />
                Builder Joint Venture
              </span>
            ) : property.inventoryType === "BANK_NBFC" ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-royal-600 text-white border border-royal-400 shadow-md flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Bank / NBFC Mandate
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider liquid-glass-pill text-white border border-white/20">
                Direct Mandate
              </span>
            )}

            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider liquid-glass-pill text-slate-200 border border-white/15">
              For {property.purposeAvailability === "BOTH" ? "Buy / Rent" : property.purposeAvailability}
            </span>
          </div>

          {/* Photo Counter Label at bottom left of photo */}
          <div className="absolute bottom-3 left-4 z-20">
            <span className="text-[10px] font-mono font-medium text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
              Photo {photoIndex + 1} of {images.length} {currentPhoto.label ? `• ${currentPhoto.label}` : ""}
            </span>
          </div>
        </div>

        {/* Bottom Half: Property Specifications & Verified Facts */}
        <div className="p-4 sm:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3">
            {/* Location & Category */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1 text-slate-300 font-medium truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{property.locality}, {property.city}, {property.state}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-royal-400 liquid-glass-pill px-2 py-0.5 rounded-full border border-royal-500/30 shrink-0">
                {property.category.replace(/_/g, " ")}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-claude-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2">
              {property.title}
            </h3>

            {/* Area & Demarcation */}
            <div className="flex items-center gap-3 text-xs text-slate-300 pt-1 border-t border-white/10">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{property.area.toLocaleString()} {property.areaUnit}</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="text-[11px] text-slate-300 truncate">
                {property.demarcation}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2">
              {property.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            {/* CONTACT IMMEDIATELY High Priority CTA */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onContactImmediately();
              }}
              className="w-full py-3 px-4 rounded-xl liquid-glass-btn-royal font-bold text-xs sm:text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-amber-400/30 hover:border-amber-400"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>CONTACT IMMEDIATELY</span>
            </button>

            {/* Invariant Pricing Notice */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span className="flex items-center gap-1 text-slate-400">
                <Lock className="w-3 h-3 text-amber-400/80" />
                Asking price confidential
              </span>
              <span className="text-amber-400 font-medium">Private dossier upon interest</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
