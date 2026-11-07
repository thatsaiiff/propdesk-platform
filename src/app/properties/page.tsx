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
  Building2, 
  Check, 
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curated Indian Property Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified residential, commercial, industrial, and plot opportunities across India. Prices disclosed on inquiry.
          </p>
        </div>

        {/* Search input top right */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by locality, title, city..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-600" />
                Refine Search
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Category
              </label>
              <div className="space-y-1">
                {[
                  { id: "ALL", label: "All Categories" },
                  { id: "RESIDENTIAL", label: "Residential" },
                  { id: "COMMERCIAL", label: "Commercial" },
                  { id: "MIXED_USE", label: "Mixed-Use" },
                  { id: "INDUSTRIAL", label: "Industrial" },
                  { id: "LAND", label: "Land & Plots" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-smooth ${
                      category === c.id
                        ? "bg-slate-900 text-white font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Type Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Intent
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["ALL", "SALE", "LEASE", "RENT"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransactionType(t)}
                    className={`py-2 px-3 rounded-xl border text-center font-medium ${
                      transactionType === t
                        ? "bg-brand-50 border-brand-500 text-brand-700 font-semibold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t === "ALL" ? "Any" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Bedrooms Filter (Applicable for residential) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Bedrooms (BHK)
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs text-center">
                {["ALL", "2", "3", "4", "5"].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBedrooms(b)}
                    className={`py-2 rounded-xl border font-medium ${
                      bedrooms === b
                        ? "bg-slate-900 text-white font-semibold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
          {/* Active Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-slate-500">
              {properties.length} {properties.length === 1 ? "Property" : "Properties"} found
            </span>
            {category !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200/80 text-slate-800 rounded-lg font-medium">
                Category: {category}
                <button onClick={() => setCategory("ALL")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {transactionType !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200/80 text-slate-800 rounded-lg font-medium">
                Intent: {transactionType}
                <button onClick={() => setTransactionType("ALL")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200/80 text-slate-800 rounded-lg font-medium">
                City: {city}
                <button onClick={() => setCity("")}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No matching properties</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn&apos;t find any published listings matching your current filter set. Try broadening your criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filter Properties</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["ALL", "RESIDENTIAL", "COMMERCIAL", "MIXED_USE", "INDUSTRIAL", "LAND"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`py-2 px-3 rounded-xl border text-center font-medium ${
                      category === c ? "bg-slate-900 text-white" : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {c.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Bengaluru"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold text-xs shadow-md"
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
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading catalogue...</div>}>
      <PropertiesCatalogueContent />
    </Suspense>
  );
}
