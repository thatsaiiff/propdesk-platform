"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicPropertyDTO } from "@/types";
import { useAuth } from "@/context/AuthContext";
import PropertyCard from "@/components/property/PropertyCard";
import { Heart, ArrowLeft, Search } from "lucide-react";

export default function SavedPropertiesPage() {
  const { user, favourites } = useAuth();
  const [properties, setProperties] = useState<PublicPropertyDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavourites() {
      setLoading(true);
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        if (data.success && data.data) {
          const favs = data.data.filter((p: PublicPropertyDTO) => favourites.includes(p.id));
          setProperties(favs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFavourites();
  }, [favourites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Saved Properties
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Properties you have bookmarked for inquiry and price evaluation.
          </p>
        </div>

        <Link
          href="/properties"
          className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Browsing
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No saved properties yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tap the heart icon on any property card to save it here for fast inquiry access.
          </p>
          <Link
            href="/properties"
            className="inline-block px-5 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl"
          >
            Explore Public Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
