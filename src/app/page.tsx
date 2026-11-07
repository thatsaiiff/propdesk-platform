"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Clock, 
  ArrowRight, 
  Sparkles,
  Compass,
  Home,
  Factory,
  Layers,
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const [properties, setProperties] = useState<PublicPropertyDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchCity, setSearchCity] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [comparedIds, setComparedIds] = useState<string[]>([]);

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
    { id: "MIXED_USE", label: "Mixed-Use", icon: Layers },
    { id: "INDUSTRIAL", label: "Industrial", icon: Factory },
    { id: "LAND", label: "Land & Plots", icon: MapPin },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-850 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-brand-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Real Estate Discovery • Pan-India Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Curated Indian Inventory. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-blue-200 bg-clip-text text-transparent">
              Inquiry-Led Private Pricing.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse verified luxury residential, Grade A commercial, industrial logistics, and development land across India without sign-in barriers. Pricing and documentation provided through our dedicated advisory desk.
          </p>

          {/* Integrated Search Bar */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2.5 items-stretch text-slate-800">
              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai, Bengaluru, Pune)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              {/* Keyword / Locality */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Locality, project, or keyword"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              {/* Search CTA */}
              <Link
                href={`/properties?city=${encodeURIComponent(searchCity)}&q=${encodeURIComponent(searchKeyword)}`}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <span>Search Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Key Value Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 p-2.5 rounded-xl backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Guest browsing without mandatory login</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 p-2.5 rounded-xl backdrop-blur-sm">
              <Lock className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Zero public prices — verified schedules</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 p-2.5 rounded-xl backdrop-blur-sm">
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Builder-only Joint Venture opportunities</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 p-2.5 rounded-xl backdrop-blur-sm">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Target 2-min advisory response</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-3 sm:p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-brand-300" : "text-slate-500"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {/* Direct JV button for builders */}
            <Link
              href="/joint-ventures"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 transition-all ml-auto"
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Joint Ventures</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-extrabold">
                BUILDERS
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Curated Property Portfolio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Admin-curated inventory. Click &quot;Get Price&quot; to receive certified rates and scheduling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredProperties.length} listings
            </span>
            <Link
              href="/properties"
              className="text-xs font-bold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No properties found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your city filter or selecting another property category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchCity("");
                setSearchKeyword("");
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
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

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-brand-400 font-bold uppercase tracking-wider text-xs">
              Operating Model
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why PropDesk Operates Differently
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We eliminated the spam, fabricated listings, and outdated pricing common on open property portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">1. Curated, Admin-Only Publishing</h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Owners and brokers submit mandates for platform review. Listings are never auto-published, ensuring every property exists and title relationships are confirmed.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">2. Inquiry-Led Price Protection</h3>
              <p className="text-xs leading-relaxed text-slate-300">
                To prevent commercial undercutting and protect high-value asset privacy, pricing is never public. Inquire with your requirements to receive verified schedules.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">3. Builder-Exclusive JV Opportunities</h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Large land parcels for joint development partnerships and revenue shares are strictly protected and visible only to verified builder/developer entities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner / Broker Intake Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-brand-300 text-xs font-bold uppercase tracking-wider">
              For Property Owners & Authorized Brokers
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Have an asset to list for sale or lease?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Submit your property details to our curation team. We verify the mandate, take professional photography where needed, and coordinate qualified buyer inquiries.
            </p>
          </div>

          <Link
            href="/submit-property"
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            Submit Property for Review &rarr;
          </Link>
        </div>
      </section>

      {/* Persistent Comparison Drawer */}
      <ComparisonDrawer
        comparedProperties={comparedProperties}
        onRemove={handleCompareToggle}
        onClear={() => setComparedIds([])}
      />
    </div>
  );
}
