"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { PublicPropertyDTO } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import ComparisonDrawer from "@/components/property/ComparisonDrawer";
import { 
  Building2, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Briefcase, 
  ArrowRight, 
  Compass, 
  Home, 
  Factory, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles,
  Landmark,
  Gavel,
  FileCheck2,
  Users2,
  TrendingUp,
  UploadCloud,
  Scale
} from "lucide-react";

// Dynamically import 3D WebGL Canvas to ensure optimal SSR performance
const HeroScene3D = dynamic(() => import("@/components/3d/HeroScene3D"), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  const [properties, setProperties] = useState<PublicPropertyDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchCity, setSearchCity] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        const json = await res.json();
        if (json.success && json.data) {
          setProperties(json.data);
        }
      } catch (err) {
        console.error("Failed to load properties", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const handleCompareToggle = (id: string) => {
    setComparedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const filteredProperties = properties.filter((p) => {
    if (selectedCategory === "AUCTION") {
      return p.subtype?.toLowerCase().includes("auction") || p.description?.toLowerCase().includes("auction") || p.description?.toLowerCase().includes("bank");
    }
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
    if (searchCity && !p.city.toLowerCase().includes(searchCity.toLowerCase())) return false;
    if (
      searchKeyword &&
      !p.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !p.locality.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !p.subtype.toLowerCase().includes(searchKeyword.toLowerCase())
    )
      return false;
    return true;
  });

  const comparedProperties = properties.filter((p) => comparedIds.includes(p.id));

  const categories = [
    { id: "ALL", label: "All Inventory", icon: Compass },
    { id: "AUCTION", label: "Bank Auctions & NPA", icon: Gavel },
    { id: "COMMERCIAL", label: "Commercial & Office", icon: Building2 },
    { id: "LAND", label: "Commercial Land & Plots", icon: MapPin },
    { id: "INDUSTRIAL", label: "Industrial & Warehousing", icon: Factory },
  ];

  const faqs = [
    {
      q: "What two asset categories does PropDesk specialize in?",
      a: "PropDesk exclusively deals in: (1) Bank-auctioned, seized, and NPA distress recovery assets (SARFAESI / DRT) priced below market appraisal, and (2) High-value direct commercial properties, Grade-A office floors, and freehold development land mandated directly by verified owners and corporate sellers."
    },
    {
      q: "How does a buyer or investor complete a purchase through PropDesk?",
      a: "You can freely browse specifications as a guest. When you identify an asset of interest, submit a confidential inquiry. Our transaction desk provides the verified private valuation schedule, bank reserve notice, and title dossier. Once you confirm buying interest, our admin desk coordinates due diligence, bidding or seller escrow, and legal closing end-to-end."
    },
    {
      q: "How can property owners, corporate sellers, or banks enlist their assets?",
      a: "Click 'Enlist Property' in the navigation bar to submit your asset details directly to our central admin desk. Your submission is recorded as a private intake record (never auto-published). Our underwriters verify title chain and pricing benchmarks before discreetly syndicating the mandate to pre-screened institutional capital."
    },
    {
      q: "Why are property prices strictly confidential and not published publicly?",
      a: "Public pricing creates price staleness, invites low-ball speculators, and damages the commercial prestige of high-value and distressed assets. PropDesk operates an inquiry-led pricing protocol where certified valuation schedules and payment milestones are provided directly by our desk upon verified inquiry."
    },
    {
      q: "Who can access the Joint Venture (JV) opportunities?",
      a: "Large-scale land parcels and revenue-sharing development joint ventures are restricted to verified builder and developer accounts to protect confidential landowner development covenants."
    },
    {
      q: "Do I need to sign up or upload government IDs to browse listings?",
      a: "No. You can freely explore all public listings as a guest without an account. When submitting an inquiry, we require only basic contact information authenticated via passwordless email OTP. We never collect Aadhaar, PAN, or banking credentials in public discovery."
    }
  ];

  return (
    <div className="space-y-24 pb-28">
      {/* Hero Section with Interactive 3D WebGL Canvas & Architectural Backdrop */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Full-bleed Architectural Estate Backdrop */}
        <div className="absolute inset-0 -z-20 pointer-events-none select-none overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
            alt="Curated commercial and architectural real estate"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 transform-gpu opacity-40 dark:opacity-25"
          />
          {/* Ambient Lighting Gradients */}
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-[#060911]/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/90 dark:from-[#060911] dark:via-transparent dark:to-[#060911]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(29,78,216,0.18)_0%,_rgba(6,9,17,0.85)_75%,_#060911_100%)]" />
        </div>

        {/* 3D WebGL Three.js Interactive Floating Asset Geometry */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <HeroScene3D />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill text-xs shadow-xl border border-royal-500/30">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Institutional Transaction Desk</span>
            <span className="text-slate-400">•</span>
            <span className="text-royal-600 dark:text-gold-400 font-medium">Bank Auctions & Commercial Real Estate</span>
          </div>

          {/* Institutional Headline */}
          <h1 className="font-claude-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.08] text-balance drop-shadow-md">
            Bank-seized distress assets & <br />
            <span className="italic font-normal text-royal-600 dark:text-gold-400">prime commercial mandates.</span>
          </h1>

          {/* Crystal Clear Subhead Explaining Company Model */}
          <p className="font-claude-sans text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-pretty drop-shadow-sm">
            We enlist verified bank-auctioned recovery properties and premier commercial mandates across India. Inquire to receive verified private valuation dossiers and close transactions securely through our institutional desk.
          </p>

          {/* Liquid Glass Search & Quick Category Container */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="liquid-glass-elevated p-3 sm:p-4 rounded-2xl flex flex-col gap-3 transition-all duration-300 shadow-2xl border border-royal-500/20">
              {/* Quick Filter Pill Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedCategory === "ALL"
                      ? "bg-royal-600 text-white font-semibold shadow-sm"
                      : "liquid-glass text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All Inventory
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("AUCTION")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    selectedCategory === "AUCTION"
                      ? "bg-gold-500 text-slate-950 font-bold shadow-sm"
                      : "liquid-glass text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Gavel className="w-3.5 h-3.5 text-gold-500 dark:text-gold-400" />
                  <span>Bank Auctions & NPA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("COMMERCIAL")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    selectedCategory === "COMMERCIAL"
                      ? "bg-royal-600 text-white font-semibold shadow-sm"
                      : "liquid-glass text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Commercial & Office</span>
                </button>
              </div>

              {/* Input Row */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 liquid-glass rounded-xl border border-slate-200/30 dark:border-white/[0.1]">
                  <MapPin className="w-4 h-4 text-royal-500 dark:text-gold-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="City (e.g. Mumbai, Bengaluru, Delhi NCR)"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 liquid-glass rounded-xl border border-slate-200/30 dark:border-white/[0.1]">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Project, bank name, or locality"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <Link
                  href={`/properties?city=${encodeURIComponent(searchCity)}&q=${encodeURIComponent(searchKeyword)}`}
                  className="py-2.5 px-6 liquid-glass-btn-royal text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shrink-0 active:scale-[0.98] shadow-lg"
                >
                  <span>Search Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Institutional Proof Signals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 text-left max-w-3xl mx-auto">
            <div className="liquid-glass p-3 rounded-xl text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-md">
              <Gavel className="w-3.5 h-3.5 text-gold-500 dark:text-gold-400 shrink-0" />
              <span>SARFAESI & DRT Auctions</span>
            </div>
            <div className="liquid-glass p-3 rounded-xl text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-md">
              <Building2 className="w-3.5 h-3.5 text-royal-500 dark:text-royal-400 shrink-0" />
              <span>Direct Commercial</span>
            </div>
            <div className="liquid-glass p-3 rounded-xl text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-md">
              <Lock className="w-3.5 h-3.5 text-gold-500 dark:text-gold-400 shrink-0" />
              <span>Private Dossier Pricing</span>
            </div>
            <div className="liquid-glass p-3 rounded-xl text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>End-to-End Closing</span>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL PILLARS SECTION: Bank Auctions vs Direct Commercial */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] uppercase tracking-widest text-royal-600 dark:text-gold-400 font-bold liquid-glass-pill px-3.5 py-1 rounded-full border border-royal-500/20">
            Core Asset Inventory Streams
          </span>
          <h2 className="font-claude-serif text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 font-bold tracking-tight">
            Two distinct real estate channels, one verified desk
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-claude-sans">
            We eliminate unverified broker chains by directly enlisting bank-mandated auction assets and owner-mandated commercial real estate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1: Bank Auctions & NPA Mandates */}
          <div className="liquid-glass-elevated rounded-3xl p-8 sm:p-10 space-y-6 relative overflow-hidden border-t-2 border-t-gold-500">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl liquid-glass bg-gold-500/10 text-gold-500 dark:text-gold-400 flex items-center justify-center border border-gold-500/30">
                <Gavel className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 liquid-glass-pill px-3 py-1 rounded-full border border-gold-500/30">
                SARFAESI / DRT / Insolvency
              </span>
            </div>

            <div>
              <h3 className="font-claude-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                Bank-Auctioned & Seized Assets
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Distressed commercial buildings, prime industrial plots, and seized residential assets sold under statutory banking recovery at significant discounts to prevailing market valuation.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-200/20 dark:border-white/[0.08] text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Statutory bank reserve price schedules & auction timelines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Verified encumbrance audits, possession status & court clearances</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                <span>End-to-end bidding assistance, EMD handling, and sale certificate registration</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/properties?subtype=Bank+Auction"
                className="w-full py-3 px-4 liquid-glass-btn-gold rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <span>Browse Bank Auctions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Direct Commercial & Land Mandates */}
          <div className="liquid-glass-elevated rounded-3xl p-8 sm:p-10 space-y-6 relative overflow-hidden border-t-2 border-t-royal-500">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl liquid-glass bg-royal-500/10 text-royal-600 dark:text-royal-400 flex items-center justify-center border border-royal-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400 liquid-glass-pill px-3 py-1 rounded-full border border-royal-500/30">
                Grade-A Offices & Land
              </span>
            </div>

            <div>
              <h3 className="font-claude-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                Direct Commercial Mandates
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Institutional-grade corporate office floors, high-street retail spaces, logistic parks, and freehold development plots directly mandated by corporate owners and institutional sellers.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-200/20 dark:border-white/[0.08] text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-royal-500 shrink-0" />
                <span>Verified rent rolls, lease covenants, and stabilized yields</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-royal-500 shrink-0" />
                <span>Confidential off-market syndication protecting commercial prestige</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-royal-500 shrink-0" />
                <span>Structured transaction advisory and escrow documentation coordination</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/properties?category=COMMERCIAL"
                className="w-full py-3 px-4 liquid-glass-btn-royal rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <span>Browse Commercial Mandates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TWO-WAY TRANSACTION FLOW: For Buyers vs For Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] uppercase tracking-widest text-royal-600 dark:text-gold-400 font-bold liquid-glass-pill px-3.5 py-1 rounded-full border border-royal-500/20">
            How Transactions Are Completed
          </span>
          <h2 className="font-claude-serif text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 font-bold tracking-tight">
            Transparent tracks for both buyers and asset sellers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-claude-sans">
            Whether you want to acquire an asset or enlist a property to sell, PropDesk executes the process through our central desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Track A: For Buyers & Capital Investors */}
          <div className="liquid-glass rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-royal-600/20 text-royal-600 dark:text-royal-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-claude-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                  Track 1: For Buyers & Investors
                </h3>
                <span className="text-xs text-slate-500">From guest discovery to asset deed possession</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full liquid-glass text-royal-600 dark:text-royal-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-royal-500/30">
                  1
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Browse Public Inventory</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Explore specifications, localities, and built-up areas without login or signup barriers.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full liquid-glass text-royal-600 dark:text-royal-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-royal-500/30">
                  2
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Request Private Valuation Dossier</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Submit an inquiry with your investment parameters to receive certified owner pricing or bank auction reserve schedules.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full liquid-glass text-royal-600 dark:text-royal-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-royal-500/30">
                  3
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Register Buying Interest</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Show confirmed acquisition interest. Our desk provides title search, physical inspection scheduling, and bank SARFAESI clearances.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full liquid-glass text-royal-600 dark:text-royal-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-royal-500/30">
                  4
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">End-to-End Deal Completion</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Our admins coordinate contract execution, earnest money escrow, bank auction certificate delivery, and title registration.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-royal-600 dark:text-royal-400 hover:underline font-semibold"
              >
                <span>Explore all open inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Track B: For Property Owners, Sellers & Banks */}
          <div className="liquid-glass rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-claude-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                  Track 2: For Owners, Sellers & Banks
                </h3>
                <span className="text-xs text-slate-500">Enlist property directly to desk admins for sale</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full liquid-glass text-gold-600 dark:text-gold-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-gold-500/30">
                  1
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Enlist Property Intake</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Submit property documents, asking benchmarks, and asset specs directly through our private submission portal.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full liquid-glass text-gold-600 dark:text-gold-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-gold-500/30">
                  2
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Admin Title & Pricing Audit</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Our underwriting desk reviews the intake record (submissions are never auto-published), conducting title and valuation due diligence.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full liquid-glass text-gold-600 dark:text-gold-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-gold-500/30">
                  3
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Confidential Syndication</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">We publish verified specs with ZERO public price leaks, syndicating directly to active corporate investors and family offices.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full liquid-glass text-gold-600 dark:text-gold-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-gold-500/30">
                  4
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Expedited Deal Closing</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">We bring qualified buyers with verified capacity, managing negotiation, contract signing, and final payout execution.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/submit-property"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gold-600 dark:text-gold-400 hover:underline font-semibold"
              >
                <span>Enlist your asset with our admins</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY BAR & CURATED PROPERTY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="liquid-glass rounded-2xl p-2.5 sm:p-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium shrink-0 transition-all duration-300 active:scale-[0.98] ${
                    isSelected
                      ? "liquid-glass-btn-royal text-white font-semibold shadow-md"
                      : "liquid-glass text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-royal-400/30"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            <Link
              href="/joint-ventures"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 shrink-0 ml-auto transition-all"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Joint Ventures</span>
              <span className="text-[10px] bg-emerald-900 text-emerald-200 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                BUILDERS
              </span>
            </Link>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Verified Asset Portfolio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-claude-sans">
              Admin-verified listings with no public prices. Inquire to receive verified private valuation schedules.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600 dark:text-slate-400 liquid-glass px-3 py-1 rounded-full border border-royal-500/20">
              {filteredProperties.length} active listings
            </span>
            <Link
              href="/properties"
              className="text-xs sm:text-sm text-royal-600 dark:text-gold-400 hover:underline inline-flex items-center gap-1.5 font-semibold"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grid or Empty/Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl liquid-glass animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 liquid-glass rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 liquid-glass text-slate-400 rounded-full flex items-center justify-center mx-auto border border-royal-500/20">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-claude-serif text-xl font-bold text-slate-900 dark:text-slate-100">No properties matched your criteria</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your city filter or switching category to view available bank auctions and commercial properties.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchCity("");
                setSearchKeyword("");
              }}
              className="py-2 px-4 liquid-glass-btn text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onCompareToggle={handleCompareToggle}
                isCompared={comparedIds.includes(property.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* WHY INQUIRY-LED PRICING & DISCRETION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] uppercase tracking-widest text-royal-600 dark:text-gold-400 font-bold liquid-glass-pill px-3 py-1 rounded-full border border-royal-500/20">
            Institutional Standards
          </span>
          <h2 className="font-claude-serif text-2xl sm:text-4xl text-slate-900 dark:text-slate-100 font-bold tracking-tight">
            Engineered for high-value transaction discretion
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-claude-sans">
            Three core operating principles that protect buyers and asset owners from public marketplace distortion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass liquid-glass-interactive rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl liquid-glass text-white flex items-center justify-center border border-royal-500/30 bg-royal-500/10">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-claude-serif text-lg font-bold text-slate-900 dark:text-slate-100">Admin-Only Publishing</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every property submission is an intake record reviewed and audited by desk underwriters. Unverified broker cascades and ghost listings are structurally impossible.
            </p>
          </div>

          <div className="liquid-glass liquid-glass-interactive rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl liquid-glass text-white flex items-center justify-center border border-gold-500/30 bg-gold-500/10">
              <Lock className="w-5 h-5 text-gold-500 dark:text-gold-400" />
            </div>
            <h3 className="font-claude-serif text-lg font-bold text-slate-900 dark:text-slate-100">Zero Public Prices</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Prices never leak in public UI, APIs, metadata, or search engines. Serious buyers and corporate investors receive verified valuation schedules upon direct desk inquiry.
            </p>
          </div>

          <div className="liquid-glass liquid-glass-interactive rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl liquid-glass text-white flex items-center justify-center border border-royal-500/30 bg-royal-500/10">
              <Briefcase className="w-5 h-5 text-royal-500 dark:text-royal-400" />
            </div>
            <h3 className="font-claude-serif text-lg font-bold text-slate-900 dark:text-slate-100">Protected Builder JV Area</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Large development land parcels and joint venture agreements are visible only to verified builder entities, keeping confidential landowner terms secure.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-widest text-royal-600 dark:text-gold-400 font-bold liquid-glass-pill px-3 py-1 rounded-full border border-royal-500/20">
            Platform Clarity
          </span>
          <h2 className="font-claude-serif text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="liquid-glass rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  <span className="font-claude-sans">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-royal-600 dark:text-gold-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in duration-200 border-t border-slate-200/20 dark:border-white/[0.05] pt-3 font-claude-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL ELEVATED CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="liquid-glass-elevated rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden border border-royal-500/30 shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          
          <h2 className="font-claude-serif text-2xl sm:text-4xl text-slate-900 dark:text-slate-100 font-bold tracking-tight leading-tight">
            Engage with India's Premier Institutional Real Estate Desk
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-claude-sans leading-relaxed text-pretty">
            Browse bank-auctioned recovery assets and prime commercial properties as a guest, or enlist your property directly with our central desk for private underwriting and sale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/properties"
              className="w-full sm:w-auto py-3 px-6 liquid-glass-btn-royal text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg"
            >
              Browse Verified Inventory
            </Link>
            <Link
              href="/submit-property"
              className="w-full sm:w-auto py-3 px-6 liquid-glass-btn-gold text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg"
            >
              Enlist Property with Admins
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Drawer */}
      <ComparisonDrawer
        comparedProperties={comparedProperties}
        onRemove={handleCompareToggle}
        onClear={() => setComparedIds([])}
      />
    </div>
  );
}
