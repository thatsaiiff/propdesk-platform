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
  RotateCcw 
} from "lucide-react";

function PropertiesCatalogueContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const initialCity = searchParams.get("city") || "";
  const initialQ = searchParams.get("q") || "";

  const [properties, setProperties] = useState<PublicPropertyDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [category, setCategory] = useState<string>(initialCategory);
  const [transactionType, setTransactionType] = useState<string>("ALL");
  const [city, setCity] = useState<string>(initialCity);
  const [bedrooms, setBedrooms] = useState<string>("ALL");
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
        if (bedrooms !== "ALL") queryParams.set("bedrooms", bedrooms);
        if (searchQuery) queryParams.set("q", searchQuery);

        const res = await fetch(`/api/properties?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProperties(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [category, transactionType, city, bedrooms, searchQuery]);

  const handleCompareToggle = (id: string) => {
    setComparedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const resetFilters = () => {
    setCategory("ALL");
    setTransactionType("ALL");
    setCity("");
    setBedrooms("ALL");
    setSearchQuery("");
  };

  const comparedProperties = properties.filter((p) => comparedIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
        <div>
          <h1 className="font-claude-serif text-3xl sm:text-4xl text-[#EDE8E1] font-semibold tracking-tight">
            Curated Indian Property Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-[#A39E96] mt-1 font-claude-sans">
            Certified residential, commercial, industrial, and plot opportunities across India. Prices disclosed on inquiry.
          </p>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-[#706D67] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locality, project, or city"
              className="w-full pl-9 pr-3.5 py-2 liquid-glass-input rounded-xl text-xs sm:text-sm text-[#EDE8E1] placeholder:text-[#706D67] focus:outline-none"
            />
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden p-2 rounded-xl liquid-glass text-[#A39E96] hover:text-[#EDE8E1]"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-1 space-y-6">
          <div className="liquid-glass-elevated rounded-3xl p-6 space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h3 className="text-sm font-semibold text-[#EDE8E1] flex items-center gap-2 font-claude-sans">
                <Filter className="w-4 h-4 text-[#CC785C]" />
                Refine Search
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-[#A39E96] hover:text-[#EDE8E1] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Category
              </label>
              <div className="space-y-1">
                {[
                  { id: "ALL", label: "All Categories" },
                  { id: "RESIDENTIAL", label: "Residential" },
                  { id: "COMMERCIAL", label: "Commercial" },
                  { id: "MIXED_USE", label: "Mixed Use" },
                  { id: "INDUSTRIAL", label: "Industrial" },
                  { id: "LAND", label: "Land & Plots" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-300 ${
                      category === c.id
                        ? "liquid-glass-btn-accent text-white font-semibold shadow-sm"
                        : "text-[#A39E96] hover:text-[#EDE8E1] hover:bg-white/[0.05]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Type Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Intent
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {["ALL", "SALE", "LEASE", "RENT"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransactionType(t)}
                    className={`py-2 px-3 rounded-xl text-xs transition-all duration-300 font-medium ${
                      transactionType === t
                        ? "liquid-glass text-[#CC785C] border-[#CC785C]/40 font-semibold shadow-sm"
                        : "liquid-glass text-[#A39E96] hover:text-[#EDE8E1]"
                    }`}
                  >
                    {t === "ALL" ? "Any" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-[#706D67] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] placeholder:text-[#706D67] focus:outline-none"
                />
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Bedrooms (BHK)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["ALL", "2", "3", "4", "5"].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBedrooms(b)}
                    className={`py-2 rounded-xl text-xs transition-all duration-300 font-medium ${
                      bedrooms === b
                        ? "liquid-glass text-white border-white/30 font-semibold"
                        : "liquid-glass text-[#A39E96] hover:text-[#EDE8E1]"
                    }`}
                  >
                    {b === "ALL" ? "Any" : `${b} BHK`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Properties Grid Column */}
        <main className="col-span-1 md:col-span-3 space-y-6">
          {/* Active Filter Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#A39E96] font-medium">
              {properties.length} {properties.length === 1 ? "Property" : "Properties"} available
            </span>
            {category !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 liquid-glass text-[#EDE8E1] rounded-lg">
                Category: {category}
                <button onClick={() => setCategory("ALL")}><X className="w-3 h-3 text-[#A39E96]" /></button>
              </span>
            )}
            {transactionType !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 liquid-glass text-[#EDE8E1] rounded-lg">
                Intent: {transactionType}
                <button onClick={() => setTransactionType("ALL")}><X className="w-3 h-3 text-[#A39E96]" /></button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 liquid-glass text-[#EDE8E1] rounded-lg">
                City: {city}
                <button onClick={() => setCity("")}><X className="w-3 h-3 text-[#A39E96]" /></button>
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
              <div className="w-12 h-12 liquid-glass text-[#706D67] rounded-full flex items-center justify-center mx-auto border border-white/10">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-claude-serif text-xl text-[#EDE8E1]">No matching properties</h3>
              <p className="text-xs text-[#A39E96] max-w-sm mx-auto">
                We could not find any published listings matching your current filters. Try broadening your criteria.
              </p>
              <button
                onClick={resetFilters}
                className="py-2 px-4 liquid-glass-btn text-[#EDE8E1] text-xs font-semibold rounded-xl"
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
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-claude-serif text-lg text-[#EDE8E1] font-semibold">Filter Properties</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#A39E96]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase text-[#706D67] font-bold">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {["ALL", "RESIDENTIAL", "COMMERCIAL", "MIXED_USE", "INDUSTRIAL", "LAND"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                      category === c ? "liquid-glass-btn-accent text-white font-semibold" : "liquid-glass text-[#A39E96]"
                    }`}
                  >
                    {c.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase text-[#706D67] font-bold">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Bengaluru"
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 liquid-glass-btn-accent text-white text-xs font-semibold rounded-xl"
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
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#A39E96]">Loading catalogue...</div>}>
      <PropertiesCatalogueContent />
    </Suspense>
  );
}
