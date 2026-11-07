"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface ShowcaseSlide {
  id: string;
  type: string;
  title: string;
  location: string;
  imageUrl: string;
  tag: string;
}

const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: "1",
    type: "Luxury Sky Apartment",
    title: "Panoramic Arabian Sea Residence",
    location: "Worli Sea Face, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    tag: "High-Rise Living",
  },
  {
    id: "2",
    type: "Tropical Modern Villa",
    title: "Private Lap Pool & Rain Tree Pavilion",
    location: "Indiranagar, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85",
    tag: "Independent Estate",
  },
  {
    id: "3",
    type: "Grade-A Corporate Headquarters",
    title: "LEED Platinum Floorplate & Heliport",
    location: "Cyber City, Gurugram",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85",
    tag: "Prime Commercial",
  },
  {
    id: "4",
    type: "Logistics & Distribution Hub",
    title: "85,000 sq.ft. PEB Laser-Screed Warehouse",
    location: "Chakan Industrial Zone, Pune",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=85",
    tag: "Industrial Logistics",
  },
  {
    id: "5",
    type: "High-Density Residential JV",
    title: "8.4 Acre Metro Corridor Development Land",
    location: "Whitefield Highway, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85",
    tag: "Joint Venture Proposal",
  },
  {
    id: "6",
    type: "Distressed Recovery Asset",
    title: "SARFAESI Commercial G+5 Seized Plaza",
    location: "Andheri East MIDC, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85",
    tag: "Maximum Discount Opportunity",
  },
  {
    id: "7",
    type: "Advanced Production Facility",
    title: "GMP Cleanrooms & Chemical Synthesis Plant",
    location: "Patancheru Belt, Hyderabad",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=85",
    tag: "Operational Factory",
  },
];

export default function Showcase3D() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length);
  };

  const activeSlide = SHOWCASE_SLIDES[currentIndex];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 3D Depth Sliding Image Container */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.1, rotateY: 3 }}
          animate={{ opacity: 1, scale: 1.02, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.96, rotateY: -3 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 transform-gpu"
          style={{ perspective: 1200 }}
        >
          <Image
            src={activeSlide.imageUrl}
            alt={activeSlide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Ambient Lighting & Darkness Vignette to maximize contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/50 to-[#060911]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,9,17,0.3)_0%,_rgba(6,9,17,0.85)_75%,_#060911_100%)]" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Property Identity Pill in Bottom Left */}
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20 pointer-events-auto">
        <motion.div
          key={activeSlide.id + "-info"}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="liquid-glass-elevated rounded-2xl p-4 sm:p-5 max-w-sm backdrop-blur-2xl border border-white/15 shadow-2xl space-y-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              {activeSlide.tag}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {currentIndex + 1} / {SHOWCASE_SLIDES.length}
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight leading-snug">
            {activeSlide.title}
          </h4>
          <p className="text-xs text-slate-300 flex items-center gap-1">
            <span>{activeSlide.location}</span>
          </p>
        </motion.div>
      </div>

      {/* Slide Navigation Controls in Bottom Right */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 pointer-events-auto flex items-center gap-2">
        <button
          onClick={handlePrev}
          aria-label="Previous property showcase"
          className="w-10 h-10 rounded-xl liquid-glass text-white/80 hover:text-white hover:border-white/40 flex items-center justify-center transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next property showcase"
          className="w-10 h-10 rounded-xl liquid-glass text-white/80 hover:text-white hover:border-white/40 flex items-center justify-center transition-all active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
