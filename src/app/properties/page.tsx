"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PublicPropertyDTO } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import ComparisonDrawer from "@/components/property/ComparisonDrawer";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  MapPin, 
  RotateCcw,
  Gavel,
  Building2
} from "lucide-react";

function PropertiesCatalogueContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const initialSubtype = searchParams.get("subtype") || "";
  const initialCity = searchParams.get("city") || "";
  const initialQ = searchParams.get("q") || "";

  const [properties, setProperties] = useState<PublicPropertyDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [category, setCategory] = useState<string>(initialCategory);
  const [subtype, setSubtype] = useState<string>(initialSubtype);
  const [transactionType, setTransactionType] = useState<string>("ALL");
  const [city, setCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState<string>(initialQ);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== "ALL") queryParams.set("category", category);
        if (transactionType !== "ALL") queryParams.set("transactionType", transactionType);
        if (city) queryParams.set("city", city);
        if (searchQuery) queryParams.set("q", searchQuery);

        const res = await fetch(`/api/properties?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success && data.data) {
          let list: PublicPropertyDTO[] = data.data;
          if (subtype) {
            list = list.filter((p) =>
              p.subtype?.toLowerCase().includes(subtype.toLowerCase()) ||
              p.description?.toLowerCase().includes(subtype.toLowerCase())
            );
          }
          setProperties(list);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [category, subtype, transactionType, city, searchQuery]);

  const handleCompareToggle = (id: string) => {
    setComparedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const resetFilters = () => {
    setCategory("ALL");
    setSubtype("");
    setTransactionType("ALL");
    setCity("");
    setSearchQuery("");
  };

  const comparedProperties = properties.filter((p) => comparedIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-slate-200/50 dark:border-white/[0.08]">
        <div>
          <h1 className="font-claude-serif text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 font-bold tracking-tight">
            Institutional Real Estate Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-claude-sans">
            Bank-auctioned recovery assets & prime commercial mandates across India. Verified pricing schedules upon inquiry.
          </p>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locality, bank, or city"
              className="w-full pl-9 pr-3.5 py-2 liquid-glass-input rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden p-2 rounded-xl liquid-glass text-slate-600 dark:text-slate-300"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-1 space-y-6">
          <div className="liquid-glass-elevated rounded-3xl p-6 space-y-6 sticky top-24 border border-royal-500/20">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-white/[0.08]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-claude-sans">
                <Filter className="w-4 h-4 text-royal-600 dark:text-gold-400" />
                Refine Mandates
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Asset Channel Quick Toggle */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Primary Asset Channel
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSubtype("Bank Auction");
                    setCategory("ALL");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-300 flex items-center justify-between ${
                    subtype === "Bank Auction"
                      ? "liquid-glass-btn-gold text-slate-950 font-bold shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Gavel className="w-3.5 h-3.5" />
                    Bank Auctions & NPA
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSubtype("");
                    setCategory("COMMERCIAL");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-300 flex items-center justify-between ${
                    category === "COMMERCIAL" && !subtype
                      ? "liquid-glass-btn-royal text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    Commercial Mandates
                  </span>
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-200/40 dark:border-white/[0.08]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                All Property Classes
              </label>
              <div className="space-y-1">
                {[
                  { id: "ALL", label: "All Classes" },
                  { id: "COMMERCIAL", label: "Commercial" },
                  { id: "INDUSTRIAL", label: "Industrial & Warehouses" },
                  { id: "LAND", label: "Land & Freehold Plots" },
                  { id: "RESIDENTIAL", label: "Residential Estates" },
                  { id: "MIXED_USE", label: "Mixed Use" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategory(c.id);
                      setSubtype("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-300 ${
                      category === c.id && !subtype
                        ? "liquid-glass-btn-royal text-white font-semibold shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Type Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-200/40 dark:border-white/[0.08]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {["ALL", "SALE", "LEASE"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransactionType(t)}
                    className={`py-2 px-3 rounded-xl text-xs transition-all duration-300 font-medium ${
                      transactionType === t
                        ? "liquid-glass text-royal-600 dark:text-gold-400 border-royal-500/40 font-bold shadow-sm"
                        : "liquid-glass text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {t === "ALL" ? "Any" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-200/40 dark:border-white/[0.08]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Properties Grid Column */}
        <main className="col-span-1 md:col-span-3 space-y-6">
          {/* Active Filter Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {properties.length} {properties.length === 1 ? "Mandate" : "Mandates"} available
            </span>
            {subtype && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 liquid-glass text-gold-600 dark:text-gold-400 rounded-lg font-bold border border-gold-500/30">
                Channel: {subtype}
                <button onClick={() => setSubtype("")}><X className="w-3 h-3 text-slate-400" /></button>
              </span>
            )}
            {category !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 liquid-glass text-slate-900 dark:text-slate-100 rounded-lg">
                Class: {category}
                <button onClick={() => setCategory("ALL")}><X className="w-3 h-3 text-slate-400" /></button>
              </span>
            )}
            {transactionType !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 liquid-glass text-slate-900 dark:text-slate-100 rounded-lg">
                Type: {transactionType}
                <button onClick={() => setTransactionType("ALL")}><X className="w-3 h-3 text-slate-400" /></button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 liquid-glass text-slate-900 dark:text-slate-100 rounded-lg">
                City: {city}
                <button onClick={() => setCity("")}><X className="w-3 h-3 text-slate-400" /></button>
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 rounded-3xl liquid-glass animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 liquid-glass rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 liquid-glass text-slate-400 rounded-full flex items-center justify-center mx-auto border border-royal-500/20">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-claude-serif text-xl font-bold text-slate-900 dark:text-slate-100">No matching mandates found</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                We could not find any active listings matching your current filters. Try resetting to view available bank auctions and commercial properties.
              </p>
              <button
                onClick={resetFilters}
                className="py-2 px-4 liquid-glass-btn text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onCompareToggle={handleCompareToggle}
                  isCompared={comparedIds.includes(property.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md liquid-glass-elevated rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-white/[0.08]">
              <h3 className="font-claude-serif text-lg text-slate-900 dark:text-slate-100 font-bold">Filter Mandates</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-400 font-bold">Channel</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSubtype("Bank Auction");
                    setCategory("ALL");
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold ${
                    subtype === "Bank Auction" ? "liquid-glass-btn-gold text-slate-950" : "liquid-glass text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Bank Auctions
                </button>
                <button
                  onClick={() => {
                    setSubtype("");
                    setCategory("COMMERCIAL");
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold ${
                    category === "COMMERCIAL" && !subtype ? "liquid-glass-btn-royal text-white" : "liquid-glass text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Commercial
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-400 font-bold">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Bengaluru"
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 liquid-glass-btn-royal text-white text-xs font-semibold rounded-xl"
            >
              Apply Filters ({properties.length} results)
            </button>
          </div>
        </div>
      )}

      {/* Comparison Drawer */}
      <ComparisonDrawer
        comparedProperties={comparedProperties}
        onRemove={handleCompareToggle}
        onClear={() => setComparedIds([])}
      />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading catalog...</div>}>
      <PropertiesCatalogueContent />
    </Suspense>
  );
}
