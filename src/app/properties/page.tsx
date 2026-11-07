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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-[#272727]">
        <div>
          <h1 className="heading-4 sm:heading-3 hero-text-gradient">
            Curated Indian Property Catalogue
          </h1>
          <p className="body-5 text-[#9B9B9B] mt-1 text-pretty">
            Certified residential, commercial, industrial, and plot opportunities across India. Prices disclosed on inquiry.
          </p>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locality, project, or city"
              className="w-full pl-9 pr-3 py-2 bg-[#181818] border border-[#272727] rounded-xl body-5 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#3a3a3a]"
            />
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden p-2 rounded-xl border border-[#272727] bg-[#181818] text-[#9B9B9B]"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-1 space-y-6">
          <div className="bg-[#181818] rounded-3xl border border-[#272727] p-6 space-y-6 sticky top-24 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#272727]">
              <h3 className="title-3 text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                Refine Search
              </h3>
              <button
                onClick={resetFilters}
                className="caption-3 text-[#9B9B9B] hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="caption-3 font-bold uppercase tracking-wider text-[#666666] block">
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
                    className={`w-full text-left px-3 py-2 rounded-xl body-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      category === c.id
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-[#9B9B9B] hover:text-white hover:bg-[#1F1F1F]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Type Filter */}
            <div className="space-y-2">
              <label className="caption-3 font-bold uppercase tracking-wider text-[#666666] block">
                Intent
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {["ALL", "SALE", "LEASE", "RENT"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransactionType(t)}
                    className={`py-2 px-3 rounded-xl border button-xsm transition-all duration-300 ${
                      transactionType === t
                        ? "bg-blue-600/20 border-blue-500 text-blue-400 font-semibold"
                        : "border-[#272727] bg-[#1F1F1F] text-[#9B9B9B] hover:text-white"
                    }`}
                  >
                    {t === "ALL" ? "Any" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="caption-3 font-bold uppercase tracking-wider text-[#666666] block">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#666666] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#3a3a3a]"
                />
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-2">
              <label className="caption-3 font-bold uppercase tracking-wider text-[#666666] block">
                Bedrooms (BHK)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["ALL", "2", "3", "4", "5"].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBedrooms(b)}
                    className={`py-2 rounded-xl border button-xsm transition-all duration-300 ${
                      bedrooms === b
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "border-[#272727] bg-[#1F1F1F] text-[#9B9B9B] hover:text-white"
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
          <div className="flex items-center gap-2 flex-wrap caption-3">
            <span className="text-[#9B9B9B] font-medium">
              {properties.length} {properties.length === 1 ? "Property" : "Properties"} available
            </span>
            {category !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#272727] text-white rounded-lg">
                Category: {category}
                <button onClick={() => setCategory("ALL")}><X className="w-3 h-3 text-[#9B9B9B]" /></button>
              </span>
            )}
            {transactionType !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#272727] text-white rounded-lg">
                Intent: {transactionType}
                <button onClick={() => setTransactionType("ALL")}><X className="w-3 h-3 text-[#9B9B9B]" /></button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#272727] text-white rounded-lg">
                City: {city}
                <button onClick={() => setCity("")}><X className="w-3 h-3 text-[#9B9B9B]" /></button>
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 rounded-3xl bg-[#181818] border border-[#272727] animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-[#181818] rounded-3xl border border-[#272727] p-8 space-y-4">
              <div className="w-12 h-12 bg-[#1F1F1F] text-[#666666] rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="title-2 text-white">No matching properties</h3>
              <p className="body-5 text-[#9B9B9B] max-w-sm mx-auto">
                We could not find any published listings matching your current filters. Try broadening your criteria.
              </p>
              <button
                onClick={resetFilters}
                className="py-2 px-4 bg-white text-black button-sm rounded-xl"
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
          <div className="w-full max-w-md bg-[#181818] rounded-3xl border border-[#272727] p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#272727]">
              <h3 className="title-2 text-white">Filter Properties</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#9B9B9B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="caption-3 uppercase text-[#666666] font-bold">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {["ALL", "RESIDENTIAL", "COMMERCIAL", "MIXED_USE", "INDUSTRIAL", "LAND"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`py-2 px-3 rounded-xl border button-xsm ${
                      category === c ? "bg-white text-black font-semibold" : "border-[#272727] bg-[#1F1F1F] text-[#9B9B9B]"
                    }`}
                  >
                    {c.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="caption-3 uppercase text-[#666666] font-bold">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Bengaluru"
                className="w-full p-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-white text-black button-md rounded-xl font-bold"
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
    <Suspense fallback={<div className="p-12 text-center body-5 text-[#9B9B9B]">Loading catalogue...</div>}>
      <PropertiesCatalogueContent />
    </Suspense>
  );
}
