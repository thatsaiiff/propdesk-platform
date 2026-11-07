"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicPropertyDTO } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import ComparisonDrawer from "@/components/property/ComparisonDrawer";
import TaglineReveal from "@/components/landing/TaglineReveal";
import { 
  Building2, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  Compass,
  Home,
  Factory,
  Layers,
  CheckCircle2,
  ChevronDown,
  Sparkles
} from "lucide-react";

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
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
    if (searchCity && !p.city.toLowerCase().includes(searchCity.toLowerCase())) return false;
    if (
      searchKeyword &&
      !p.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !p.locality.toLowerCase().includes(searchKeyword.toLowerCase())
    )
      return false;
    return true;
  });

  const comparedProperties = properties.filter((p) => comparedIds.includes(p.id));

  const categories = [
    { id: "ALL", label: "All Properties", icon: Compass },
    { id: "RESIDENTIAL", label: "Residential", icon: Home },
    { id: "COMMERCIAL", label: "Commercial", icon: Building2 },
    { id: "MIXED_USE", label: "Mixed Use", icon: Layers },
    { id: "INDUSTRIAL", label: "Industrial", icon: Factory },
    { id: "LAND", label: "Land & Plots", icon: MapPin },
  ];

  const faqs = [
    {
      q: "Why are property prices not displayed publicly on PropDesk?",
      a: "Open portals display obsolete and speculative rates that degrade asset prestige and lead to commercial misalignments. PropDesk operates an inquiry-led pricing model where certified valuations and payment milestones are provided directly by our advisory desk upon complete inquiry."
    },
    {
      q: "Who is allowed to access Joint Venture opportunities?",
      a: "Joint Venture opportunities and large development land parcels are strictly restricted to verified builder and developer accounts. This protects confidential landowner terms and ensures proposals come only from experienced developers with proven delivery capacity."
    },
    {
      q: "How does property submission work for owners and brokers?",
      a: "Submitting a property creates an intake record with status RECEIVED. Submissions are never automatically published. Our curation team conducts internal title verification and inspection before publishing an authorized listing."
    },
    {
      q: "Can one user account hold multiple roles?",
      a: "Yes. You can be an individual buyer, an investor, and a property owner on the same account. Your active role preference customizes your interface, while your assigned permissions govern access to restricted areas like Joint Ventures."
    },
    {
      q: "What is the expected response time after sending an inquiry?",
      a: "Our operational target is to connect with you within staffed business hours to provide verified price schedules, floor plans, and site visit scheduling."
    },
    {
      q: "Does PropDesk collect government identity documents during inquiry?",
      a: "No. In accordance with data minimization principles, we do not collect Aadhaar, PAN, or bank credentials for browsing or inquiry. We only collect essential contact information and verify account access via Email OTP."
    }
  ];

  return (
    <div className="space-y-24 pb-28">
      {/* Hero Section with Claude Editorial Typography & Liquid Glass */}
      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[#EDE8E1] text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CC785C] animate-pulse" />
            <span className="font-medium text-[#EDE8E1]">Curated Indian Real Estate</span>
            <span className="text-[#706D67]">•</span>
            <span className="text-[#A39E96]">Strict Discretion Assured</span>
          </div>

          {/* Claude Signature Headline */}
          <h1 className="font-claude-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#EDE8E1] leading-[1.08] text-balance">
            Curated Indian real estate, <br />
            <span className="italic font-normal text-[#CC785C]">refined with discretion.</span>
          </h1>

          <p className="font-claude-sans text-base sm:text-lg text-[#A39E96] max-w-2xl mx-auto leading-relaxed text-pretty">
            Browse verified luxury residential, Grade A commercial, and prime development assets across India as a guest. Receive private certified pricing upon inquiry.
          </p>

          {/* Liquid Glass Search Container */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="liquid-glass-elevated p-2.5 sm:p-3 rounded-2xl flex flex-col sm:flex-row gap-2 transition-all duration-300">
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 liquid-glass rounded-xl border-white/[0.08]">
                <MapPin className="w-4 h-4 text-[#CC785C] shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai, Bengaluru, Pune)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#EDE8E1] placeholder:text-[#706D67] focus:outline-none"
                />
              </div>

              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 liquid-glass rounded-xl border-white/[0.08]">
                <Search className="w-4 h-4 text-[#706D67] shrink-0" />
                <input
                  type="text"
                  placeholder="Locality, project, or keyword"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#EDE8E1] placeholder:text-[#706D67] focus:outline-none"
                />
              </div>

              <Link
                href={`/properties?city=${encodeURIComponent(searchCity)}&q=${encodeURIComponent(searchKeyword)}`}
                className="py-2.5 px-6 liquid-glass-btn-accent text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shrink-0 active:scale-[0.98]"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Proof signals row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 text-left max-w-3xl mx-auto">
            <div className="liquid-glass p-3 rounded-xl text-xs text-[#A39E96] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Guest browsing</span>
            </div>
            <div className="liquid-glass p-3 rounded-xl text-xs text-[#A39E96] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#CC785C] shrink-0" />
              <span>Private pricing</span>
            </div>
            <div className="liquid-glass p-3 rounded-xl text-xs text-[#A39E96] flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Builder JV area</span>
            </div>
            <div className="liquid-glass p-3 rounded-xl text-xs text-[#A39E96] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Target response</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline Reveal Section */}
      <TaglineReveal
        phrase="Curated Indian real estate discovery with zero public prices, certified mandate verification, and confidential advisory response."
        subtext="Eliminating speculative portal listings, unverified broker cascades, and distorted rates through an admin-managed catalog."
      />

      {/* Category Pills Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      ? "liquid-glass-btn-accent text-white font-semibold shadow-md"
                      : "liquid-glass text-[#A39E96] hover:text-[#EDE8E1] hover:border-white/30"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-[#706D67]"}`} />
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
      </section>

      {/* Curated Property Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-claude-serif text-2xl sm:text-3xl font-semibold text-[#EDE8E1] tracking-tight">
              Curated Property Portfolio
            </h2>
            <p className="text-xs sm:text-sm text-[#A39E96] mt-1 font-claude-sans">
              Admin-verified listings. Inquire to receive verified private pricing schedules and inspection slots.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#706D67] liquid-glass px-2.5 py-1 rounded-full">
              {filteredProperties.length} active listings
            </span>
            <Link
              href="/properties"
              className="text-xs sm:text-sm text-[#CC785C] hover:text-[#D9886D] inline-flex items-center gap-1.5 font-medium"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl liquid-glass animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 liquid-glass rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 liquid-glass text-[#706D67] rounded-full flex items-center justify-center mx-auto border border-white/10">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-claude-serif text-xl text-[#EDE8E1]">No properties found</h3>
            <p className="text-xs text-[#A39E96] max-w-sm mx-auto">
              Try adjusting your city filter or selecting another property category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchCity("");
                setSearchKeyword("");
              }}
              className="py-2 px-4 liquid-glass-btn text-[#EDE8E1] text-xs font-semibold rounded-xl"
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

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] uppercase tracking-widest text-[#CC785C] font-semibold liquid-glass-pill px-3 py-1 rounded-full">
            Platform Benefits
          </span>
          <h2 className="font-claude-serif text-2xl sm:text-4xl text-[#EDE8E1] font-medium tracking-tight">
            Engineered for high-value transaction integrity
          </h2>
          <p className="text-xs sm:text-sm text-[#A39E96] font-claude-sans">
            Three structural differentiators that separate PropDesk from open portal marketplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass liquid-glass-interactive rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl liquid-glass text-white flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-claude-serif text-lg font-semibold text-[#EDE8E1]">Admin-Only Publishing</h3>
            <p className="text-xs sm:text-sm text-[#A39E96] leading-relaxed">
              Every property intake is manually reviewed before public catalog listing. Fake broker inventory and duplicate listings are structurally prevented.
            </p>
          </div>

          <div className="liquid-glass liquid-glass-interactive rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl liquid-glass text-white flex items-center justify-center border border-white/20">
              <Lock className="w-5 h-5 text-[#CC785C]" />
            </div>
            <h3 className="font-claude-serif text-lg font-semibold text-[#EDE8E1]">Inquiry-Led Pricing</h3>
            <p className="text-xs sm:text-sm text-[#A39E96] leading-relaxed">
              Prices never leak in public UI, APIs, metadata, or search engines. Serious buyers and investors receive verified owner pricing upon direct inquiry.
            </p>
          </div>

          <div className="liquid-glass liquid-glass-interactive rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl liquid-glass text-white flex items-center justify-center border border-white/20">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-claude-serif text-lg font-semibold text-[#EDE8E1]">Protected Builder JV Area</h3>
            <p className="text-xs sm:text-sm text-[#A39E96] leading-relaxed">
              Large land parcels and revenue-share collaborations are visible only to verified developer entities. Landowner terms remain fully confidential.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-[#CC785C] font-semibold liquid-glass-pill px-3 py-1 rounded-full">
              Discovery Journey
            </span>
            <h2 className="font-claude-serif text-2xl sm:text-4xl text-[#EDE8E1] font-medium tracking-tight">
              How the discovery and inquiry process works
            </h2>
            <p className="text-xs sm:text-sm text-[#A39E96] font-claude-sans">
              Three frictionless steps from guest browsing to verified pricing schedule delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="liquid-glass rounded-3xl p-7 space-y-3.5">
              <div className="text-3xl font-mono text-[#CC785C]/60 font-semibold">01</div>
              <h3 className="font-claude-serif text-lg font-semibold text-[#EDE8E1]">Browse Without Barriers</h3>
              <p className="text-xs sm:text-sm text-[#A39E96] leading-relaxed">
                Explore verified residential, commercial, and land assets across India as a guest with zero mandatory signup walls.
              </p>
            </div>

            <div className="liquid-glass rounded-3xl p-7 space-y-3.5">
              <div className="text-3xl font-mono text-[#CC785C]/60 font-semibold">02</div>
              <h3 className="font-claude-serif text-lg font-semibold text-[#EDE8E1]">Submit Contextual Inquiry</h3>
              <p className="text-xs sm:text-sm text-[#A39E96] leading-relaxed">
                Specify your intent, timeline, and objective. Authenticate effortlessly with a passwordless email verification code.
              </p>
            </div>

            <div className="liquid-glass rounded-3xl p-7 space-y-3.5">
              <div className="text-3xl font-mono text-[#CC785C]/60 font-semibold">03</div>
              <h3 className="font-claude-serif text-lg font-semibold text-[#EDE8E1]">Receive Private Pricing</h3>
              <p className="text-xs sm:text-sm text-[#A39E96] leading-relaxed">
                An assigned advisory desk manager connects with certified owner pricing schedules, payment plans, and inspection slots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Liquid Glass Accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-widest text-[#CC785C] font-semibold liquid-glass-pill px-3 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="font-claude-serif text-2xl sm:text-3xl text-[#EDE8E1] font-medium tracking-tight">
            Answers to common platform questions
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
                  className="w-full text-left p-5 flex items-center justify-between gap-4 text-sm font-medium text-[#EDE8E1]"
                >
                  <span className="font-claude-sans">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A39E96] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
                      isOpen ? "rotate-180 text-[#CC785C]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#A39E96] leading-relaxed animate-in fade-in duration-200 border-t border-white/[0.05] pt-3 font-claude-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section with Liquid Glass Elevated Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="liquid-glass-elevated rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#CC785C]/60 to-transparent" />
          
          <h2 className="font-claude-serif text-2xl sm:text-4xl text-[#EDE8E1] font-medium tracking-tight leading-tight">
            Explore curated inventory across India
          </h2>
          <p className="text-xs sm:text-sm text-[#A39E96] max-w-lg mx-auto font-claude-sans leading-relaxed text-pretty">
            Start browsing immediately without account registration, or submit your property mandate for platform review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/properties"
              className="w-full sm:w-auto py-3 px-6 liquid-glass-btn-accent text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 active:scale-[0.98]"
            >
              Browse Public Inventory
            </Link>
            <Link
              href="/submit-property"
              className="w-full sm:w-auto py-3 px-6 liquid-glass hover:border-white/30 text-[#EDE8E1] text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 active:scale-[0.98]"
            >
              Submit Property for Review
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
