"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicPropertyDTO } from "@/types";
import { useAuth } from "@/context/AuthContext";
import PropertyCard from "@/components/property/PropertyCard";
import { Heart, ArrowLeft } from "lucide-react";

export default function SavedPropertiesPage() {
  const { favourites } = useAuth();
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
      <div className="flex items-center justify-between pb-6 border-b border-[#272727]">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h1 className="heading-4 sm:heading-3 hero-text-gradient tracking-tight">
              Saved Properties
            </h1>
          </div>
          <p className="body-5 text-[#9B9B9B] mt-1">
            Properties bookmarked for valuation review and inquiry scheduling.
          </p>
        </div>

        <Link
          href="/properties"
          className="button-sm text-[#9B9B9B] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Browsing
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-[#181818] border border-[#272727] animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-[#181818] rounded-3xl border border-[#272727] p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-[#1F1F1F] text-red-400 rounded-full flex items-center justify-center mx-auto border border-[#272727]">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="title-2 text-white">No saved properties yet</h3>
          <p className="body-5 text-[#9B9B9B] max-w-sm mx-auto">
            Tap the heart icon on any property card to save it here for fast inquiry access.
          </p>
          <Link
            href="/properties"
            className="inline-block py-2.5 px-5 bg-white text-black button-sm rounded-xl shadow-md"
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
