"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PublicPropertyDTO, PropertyCategory, PropertyPurpose, BuilderOpportunityType } from "@/types";
import TinderCard from "@/components/discovery/TinderCard";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { 
  Building2, 
  X, 
  Heart, 
  Zap, 
  RotateCcw, 
  SlidersHorizontal, 
  History, 
  Sparkles, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Compass
} from "lucide-react";

export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [properties, setProperties] = useState<PublicPropertyDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Preference filter overrides
  const [activeCategory, setActiveCategory] = useState<PropertyCategory | undefined>(user?.preferences?.category);
  const [activePurpose, setActivePurpose] = useState<PropertyPurpose | undefined>(user?.preferences?.purpose);
  const [activeBuilderOpp, setActiveBuilderOpp] = useState<BuilderOpportunityType | undefined>(user?.preferences?.builderOpportunityType);

  const fetchDiscoveryFeed = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.set("category", activeCategory);
      if (activePurpose) params.set("purpose", activePurpose);
      if (activeBuilderOpp) params.set("builderOpportunityType", activeBuilderOpp);

      const res = await fetch(`/api/properties/discover?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.properties) {
        setProperties(data.properties);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Failed to fetch discovery properties:", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activePurpose, activeBuilderOpp]);

  useEffect(() => {
    if (!authLoading && !user) {
      setOnboardingOpen(true);
    } else if (user) {
      if (!activeCategory && user.preferences?.category) {
        setActiveCategory(user.preferences.category);
      }
      if (!activePurpose && user.preferences?.purpose) {
        setActivePurpose(user.preferences.purpose);
      }
      if (!activeBuilderOpp && user.preferences?.builderOpportunityType) {
        setActiveBuilderOpp(user.preferences.builderOpportunityType);
      }
      fetchDiscoveryFeed();
    }
  }, [user, authLoading, fetchDiscoveryFeed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentProperty = properties[currentIndex];

  const handleSwipe = async (action: "SKIPPED" | "INTERESTED") => {
    if (!currentProperty) return;

    const propId = currentProperty.id;

    // Advance immediately for smooth interactive feeling
    setCurrentIndex((prev) => prev + 1);

    try {
      const res = await fetch("/api/properties/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: propId, action }),
      });
      const data = await res.json();

      if (action === "INTERESTED") {
        showToast("Interest registered! Our property team will contact you shortly.");
      }
    } catch {
      console.error("Failed to record swipe");
    }
  };

  const handleContactImmediately = async () => {
    if (!currentProperty) return;

    const propId = currentProperty.id;

    // Advance card
    setCurrentIndex((prev) => prev + 1);

    try {
      const res = await fetch("/api/properties/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: propId,
          action: "INTERESTED",
          isContactRequested: true,
        }),
      });
      const data = await res.json();
      showToast("Priority contact request registered! Our advisory team will call you shortly.");
    } catch {
      console.error("Failed to record contact request");
    }
  };

  const handleResetCycle = async () => {
    setLoading(true);
    try {
      await fetch("/api/me/reset-cycle", { method: "POST" });
      await fetchDiscoveryFeed();
      showToast("Discovery cycle reset! You can now reconsider previously skipped properties.");
    } catch {
      console.error("Failed to reset cycle");
    } finally {
      setLoading(false);
    }
  };

  const isExhausted = !loading && (properties.length === 0 || currentIndex >= properties.length);

  return (
    <div className="min-h-screen bg-[#060911] text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 inset-x-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="liquid-glass-elevated bg-emerald-950/90 border border-emerald-400/40 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Top Discovery Header */}
      <header className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-30">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Landing</span>
        </Link>

        {/* Central Filter Indicator */}
        <button
          onClick={() => setPreferencesOpen(true)}
          className="liquid-glass px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border border-white/15 hover:border-amber-400/40 transition-all active:scale-95 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {activeCategory ? activeCategory.replace(/_/g, " ") : "All Categories"} • {activePurpose || "Buy/Rent"}
          </span>
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
        </button>

        {/* History / Activity Link */}
        <Link
          href="/history"
          className="p-2 rounded-xl liquid-glass text-slate-300 hover:text-white transition-all active:scale-95"
          title="My Property Activity"
        >
          <History className="w-5 h-5 text-amber-400" />
        </Link>
      </header>

      {/* Main Tinder Card Deck Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-20 max-w-lg mx-auto w-full">
        {loading ? (
          <div className="w-full max-w-md aspect-[16/20] liquid-glass rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Compass className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
            <h3 className="font-claude-serif text-lg font-bold text-white">Curating Discovery Feed...</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Filtering verified mandates matching your role and acquisition criteria.
            </p>
          </div>
        ) : isExhausted ? (
          /* Exhaustion State */
          <div className="w-full max-w-md liquid-glass-elevated rounded-3xl p-8 sm:p-10 text-center space-y-6 border border-white/15 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl liquid-glass bg-amber-500/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white">
                You’ve explored all available properties in this category.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
                No more unviewed properties remaining in your active discovery cycle.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleResetCycle}
                className="w-full py-3.5 px-4 rounded-xl liquid-glass-btn-royal font-bold text-xs sm:text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Review Previously Skipped Properties</span>
              </button>

              <button
                onClick={() => setPreferencesOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl liquid-glass font-semibold text-xs sm:text-sm text-slate-200 hover:text-white border border-white/20 hover:border-white/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span>Explore Another Category or Purpose</span>
              </button>

              <Link
                href="/history"
                className="block w-full py-3 px-4 text-xs font-semibold text-amber-400 hover:underline pt-1"
              >
                View My Interested Properties & Leads &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* Render Active Tinder Card & Next Pre-loaded Card behind it */
          <div className="relative w-full max-w-md h-[calc(100dvh-160px)] min-h-[440px] max-h-[580px] sm:max-h-[620px]">
            {/* Background next card for depth preview */}
            {properties[currentIndex + 1] && (
              <div className="absolute inset-0 scale-95 translate-y-3 opacity-40 pointer-events-none transition-all">
                <TinderCard
                  key={properties[currentIndex + 1].id}
                  property={properties[currentIndex + 1]}
                  onSwipe={() => {}}
                  onContactImmediately={() => {}}
                  isFrontCard={false}
                />
              </div>
            )}

            {/* Foreground interactive swipeable card */}
            {currentProperty && (
              <TinderCard
                key={currentProperty.id}
                property={currentProperty}
                onSwipe={handleSwipe}
                onContactImmediately={handleContactImmediately}
                isFrontCard={true}
              />
            )}
          </div>
        )}
      </main>

      {/* Accessible Bottom Interaction Bar */}
      {!isExhausted && currentProperty && (
        <footer className="p-4 sm:p-6 max-w-md mx-auto w-full flex items-center justify-center gap-6 sm:gap-8 z-30">
          {/* SKIP (Left Swipe) Accessible Button */}
          <button
            onClick={() => handleSwipe("SKIPPED")}
            className="w-14 h-14 rounded-2xl liquid-glass border border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-400 flex items-center justify-center transition-all active:scale-90 shadow-xl"
            title="Skip Property (Swipe Left)"
            aria-label="Not Interested"
          >
            <X className="w-6 h-6" />
          </button>

          {/* CONTACT IMMEDIATELY Button */}
          <button
            onClick={handleContactImmediately}
            className="w-16 h-16 rounded-2xl liquid-glass-btn-royal border border-amber-400/50 text-amber-400 hover:scale-105 flex items-center justify-center transition-all active:scale-95 shadow-2xl"
            title="Contact Immediately (Priority Lead)"
            aria-label="Contact Immediately"
          >
            <Zap className="w-7 h-7 fill-amber-400 text-amber-400" />
          </button>

          {/* INTERESTED (Right Swipe) Accessible Button */}
          <button
            onClick={() => handleSwipe("INTERESTED")}
            className="w-14 h-14 rounded-2xl liquid-glass border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 flex items-center justify-center transition-all active:scale-90 shadow-xl"
            title="Interested Property (Swipe Right)"
            aria-label="Interested"
          >
            <Heart className="w-6 h-6 fill-emerald-400 text-emerald-400" />
          </button>
        </footer>
      )}

      {/* Quick Preferences Slide-over / Modal */}
      {preferencesOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md liquid-glass-elevated rounded-3xl p-6 space-y-6 border border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-claude-serif text-lg font-bold text-white">Adjust Discovery Preferences</h3>
              <button
                onClick={() => setPreferencesOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Switcher */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Property Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "FLAT", label: "Flat / Apartment" },
                  { id: "HOUSE", label: "House / Villa" },
                  { id: "PLOT", label: "Vacant Plot" },
                  { id: "INDUSTRIAL_LAND", label: "Industrial Land" },
                  { id: "WAREHOUSE", label: "Warehouse" },
                  { id: "FACTORY", label: "Factory" },
                  { id: "BUILDING_WITH_LAND", label: "Building + Land" },
                  { id: "DISPUTED", label: "Disputed (Max Discount)" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id as PropertyCategory)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      activeCategory === c.id
                        ? "liquid-glass-btn-royal text-white shadow-md border-amber-400/40"
                        : "liquid-glass text-slate-300 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose Switcher */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Purpose
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "BUY", label: "Buy" },
                  { id: "RENT", label: "Rent" },
                  { id: "BUY_OR_RENT", label: "Both" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePurpose(p.id as PropertyPurpose)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      activePurpose === p.id
                        ? "liquid-glass-btn-royal text-white shadow-md"
                        : "liquid-glass text-slate-300 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setPreferencesOpen(false);
                fetchDiscoveryFeed();
              }}
              className="w-full py-3.5 rounded-xl liquid-glass-btn-royal font-bold text-sm text-white shadow-lg"
            >
              Apply & Refresh Feed
            </button>
          </div>
        </div>
      )}

      {/* Onboarding Modal if user needs authentication */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
}
