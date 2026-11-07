"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Showcase3D from "@/components/landing/Showcase3D";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  User, 
  LogOut,
  Sliders,
  History
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [pricePromise, setPricePromise] = useState(
    "If you find the same property available at a lower verified price elsewhere, show us the proof. We promise to pay you 10% extra and buy the property."
  );

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/admin/config");
        const json = await res.json();
        if (json.success && json.config?.pricePromiseText) {
          setPricePromise(json.config.pricePromiseText);
        }
      } catch {}
    }
    loadConfig();
  }, []);

  const handlePrimaryClick = () => {
    if (!user) {
      setOnboardingOpen(true);
    } else if (!user.isOnboarded || user.roles.length === 0) {
      setOnboardingOpen(true);
    } else {
      router.push("/discover");
    }
  };

  const isAdmin = user?.staffRoles && user.staffRoles.length > 0;

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#060911] text-white">
      {/* Full-Screen 3D Sliding Property Showcase Backdrop */}
      <Showcase3D />

      {/* Top Bar — Minimal Brand & Simulation Hub */}
      <header className="relative z-30 px-6 sm:px-10 py-6 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl liquid-glass bg-royal-950/60 border border-white/20 text-white flex items-center justify-center font-bold shadow-xl group-hover:scale-105 group-hover:border-amber-400/50 transition-all duration-300">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="font-claude-serif text-2xl font-bold tracking-tight text-white flex items-center gap-0.5">
              PropDesk<span className="text-amber-400 font-serif">.</span>
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-slate-400 font-semibold -mt-1">
              Private Real Estate Desk
            </span>
          </div>
        </Link>

        {/* User state and actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/submit-property"
            className="hidden md:flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold liquid-glass text-slate-300 hover:text-white hover:border-white/30 transition-all active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>List Property</span>
          </Link>

          {user && (
            <Link
              href="/history"
              className="py-2 px-3 rounded-xl liquid-glass text-slate-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5 text-xs font-semibold active:scale-95"
              title="My Property Activity & History"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">My Activity</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="py-2 px-3.5 rounded-xl text-xs font-bold liquid-glass bg-purple-950/60 border border-purple-500/40 text-purple-200 hover:bg-purple-900/60 transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={() => signOut()}
              className="py-2 px-3 rounded-xl text-xs font-semibold liquid-glass text-slate-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setOnboardingOpen(true)}
              className="py-2 px-4 rounded-xl text-xs font-bold liquid-glass text-white border border-white/20 hover:border-amber-400 transition-all active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area — Extremely Minimal & Cinematic */}
      <main className="relative z-20 max-w-4xl mx-auto px-4 sm:px-10 py-6 sm:py-12 text-center space-y-6 sm:space-y-8 flex-1 flex flex-col justify-center items-center">
        {/* Subtle Trust Proposition Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill text-xs shadow-xl border border-white/15">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">
            We help you access property opportunities and pricing that are difficult to find elsewhere.
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-claude-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-2xl">
          Real Estate. <br />
          <span className="italic font-normal text-amber-400">Reimagined.</span>
        </h1>

        {/* Supporting Message */}
        <p className="font-claude-sans text-base sm:text-xl text-slate-200/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
          Trusted real estate opportunities. Verified properties. Better deals.
        </p>

        {/* Prominent But Elegant Price Promise Trust Banner */}
        <div className="w-full max-w-2xl liquid-glass-elevated rounded-3xl p-5 sm:p-6 text-left relative overflow-hidden border border-amber-500/30 shadow-2xl backdrop-blur-2xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400">
                Our Price Promise
              </div>
              <p className="font-claude-serif text-sm sm:text-base text-white/95 mt-1 font-medium leading-relaxed italic">
                “{pricePromise}”
              </p>
            </div>
          </div>
        </div>

        {/* The ONE Primary Button */}
        <div className="pt-2">
          <button
            onClick={handlePrimaryClick}
            className="py-4 sm:py-5 px-10 sm:px-14 rounded-2xl liquid-glass-btn-royal text-white font-bold text-base sm:text-lg tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 border border-white/30"
          >
            <span>SEE PROPERTIES</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-20 px-6 py-6 text-center text-xs text-slate-400/80">
        <p>© {new Date().getFullYear()} PropDesk Discovery Platform • Private Verified Listings Across India</p>
      </footer>

      {/* Sequential Onboarding & Authentication Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
}
