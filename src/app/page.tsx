"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  HelpCircle,
  ChevronDown
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
      a: "Open portals display obsolete and unverified prices that lead to commercial dispute and market distortion. PropDesk operates an inquiry led pricing model where certified schedules and payment milestones are provided directly by our advisory desk upon complete inquiry."
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
    <div className="space-y-24 pb-24">
      {/* Hero Section per A2 and B5 */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[680px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#272727] text-[#9B9B9B] caption-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Curated Indian Real Estate Discovery
          </div>

          {/* Heading 1 with left to right text gradient (#FFFFFF to #9B9B9B) and meaningful breaks */}
          <h1 className="heading-2 sm:heading-1 hero-text-gradient tracking-tight">
            Curated Indian inventory <br />
            without portal spam
          </h1>

          <p className="body-4 sm:body-2 text-[#9B9B9B] text-pretty">
            Browse verified luxury residential, Grade A commercial, and land parcels across India as a guest. Receive private certified pricing upon inquiry.
          </p>

          {/* Search Box */}
          <div className="pt-4">
            <div className="bg-[#181818] p-2.5 rounded-2xl border border-[#272727] flex flex-col sm:flex-row gap-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-[#1F1F1F] rounded-xl border border-[#272727]">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai, Bengaluru, Pune)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent body-5 text-white placeholder:text-[#666666] focus:outline-none"
                />
              </div>

              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-[#1F1F1F] rounded-xl border border-[#272727]">
                <Search className="w-4 h-4 text-[#666666] shrink-0" />
                <input
                  type="text"
                  placeholder="Locality, project, or keyword"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent body-5 text-white placeholder:text-[#666666] focus:outline-none"
                />
              </div>

              <Link
                href={`/properties?city=${encodeURIComponent(searchCity)}&q=${encodeURIComponent(searchKeyword)}`}
                className="py-2.5 px-5 bg-white hover:bg-[#e0e0e0] text-black button-sm rounded-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Proof signals row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 text-left">
            <div className="bg-[#181818] border border-[#272727] p-3 rounded-xl caption-4 text-[#9B9B9B] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Guest browsing</span>
            </div>
            <div className="bg-[#181818] border border-[#272727] p-3 rounded-xl caption-4 text-[#9B9B9B] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Private pricing</span>
            </div>
            <div className="bg-[#181818] border border-[#272727] p-3 rounded-xl caption-4 text-[#9B9B9B] flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Builder JV area</span>
            </div>
            <div className="bg-[#181818] border border-[#272727] p-3 rounded-xl caption-4 text-[#9B9B9B] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Target response</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory B11 Tagline Reveal Section */}
      <TaglineReveal
        phrase="Curated Indian real estate discovery with zero public prices, certified mandate verification, and direct advisory response."
        subtext="Eliminating speculative listings, unverified broker cascades, and outdated rates through an admin managed catalogue."
      />

      {/* Category Pills Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#181818] rounded-2xl border border-[#272727] p-3 sm:p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl button-sm shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] ${
                    isSelected
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-[#1F1F1F] hover:bg-[#272727] text-[#9B9B9B] hover:text-white border border-[#272727]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-black" : "text-[#666666]"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            <Link
              href="/joint-ventures"
              className="flex items-center gap-2 px-4 py-2 rounded-xl button-sm bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 shrink-0 ml-auto transition-all"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Joint Ventures</span>
              <span className="caption-5 bg-emerald-900 text-emerald-200 px-1.5 py-0.2 rounded font-bold">
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
            <h2 className="heading-4 sm:heading-3 text-white">
              Curated Property Portfolio
            </h2>
            <p className="body-5 text-[#9B9B9B] mt-1">
              Admin verified listings. Inquire to receive verified private pricing schedules and inspection slots.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="caption-2 text-[#666666]">
              {filteredProperties.length} active listings
            </span>
            <Link
              href="/properties"
              className="button-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-[#181818] border border-[#272727] animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-[#181818] rounded-3xl border border-[#272727] p-8 space-y-4">
            <div className="w-12 h-12 bg-[#1F1F1F] text-[#666666] rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="title-2 text-white">No properties found</h3>
            <p className="body-5 text-[#9B9B9B] max-w-sm mx-auto">
              Try adjusting your city filter or selecting another property category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchCity("");
                setSearchKeyword("");
              }}
              className="py-2 px-4 bg-white text-black button-sm rounded-xl"
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

      {/* Benefits Section per A2 Mid-page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[680px] mx-auto space-y-3 mb-12">
          <span className="caption-3 uppercase tracking-wider text-[#9B9B9B] font-bold">
            Platform Benefits
          </span>
          <h2 className="heading-4 sm:heading-3 text-white">
            Engineered for high value transaction integrity
          </h2>
          <p className="body-5 text-[#9B9B9B]">
            Three structural differentiators that separate PropDesk from open portal marketplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#181818] border border-[#272727] rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#272727] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="title-2 text-white">Admin Only Publishing</h3>
            <p className="body-5 text-[#9B9B9B] leading-relaxed">
              Every property intake is manually reviewed before public catalog listing. Fake broker inventory and duplicate listings are structurally prevented.
            </p>
          </div>

          <div className="bg-[#181818] border border-[#272727] rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#272727] text-white flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="title-2 text-white">Inquiry Led Pricing</h3>
            <p className="body-5 text-[#9B9B9B] leading-relaxed">
              Prices never leak in public UI, APIs, metadata, or search engines. Serious buyers and investors receive verified owner pricing upon direct inquiry.
            </p>
          </div>

          <div className="bg-[#181818] border border-[#272727] rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#272727] text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="title-2 text-white">Protected Builder JV Area</h3>
            <p className="body-5 text-[#9B9B9B] leading-relaxed">
              Large land parcels and revenue share collaborations are visible only to verified developer entities. Landowner terms remain fully confidential.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#131209] border-y border-[#1F1F1F] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-[680px] mx-auto space-y-3">
            <span className="caption-3 uppercase tracking-wider text-amber-400 font-bold">
              Discovery Journey
            </span>
            <h2 className="heading-4 sm:heading-3 text-white">
              How the discovery and inquiry process works
            </h2>
            <p className="body-5 text-[#9B9B9B]">
              Three frictionless steps from guest browsing to verified pricing schedule delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-3xl font-bold font-mono text-[#313131]">01</div>
              <h3 className="title-2 text-white">Browse Without Barriers</h3>
              <p className="body-5 text-[#9B9B9B] leading-relaxed">
                Explore verified residential, commercial, and land assets across India as a guest with zero mandatory signup walls.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-3xl font-bold font-mono text-[#313131]">02</div>
              <h3 className="title-2 text-white">Submit Contextual Inquiry</h3>
              <p className="body-5 text-[#9B9B9B] leading-relaxed">
                Specify your intent, timeline, and objective. Authenticate effortlessly with a passwordless email verification code.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-3xl font-bold font-mono text-[#313131]">03</div>
              <h3 className="title-2 text-white">Receive Private Pricing</h3>
              <p className="body-5 text-[#9B9B9B] leading-relaxed">
                An assigned advisory desk manager connects with certified owner pricing schedules, payment plans, and inspection slots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section per A2 Bottom */}
      <section className="max-w-[680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="caption-3 uppercase tracking-wider text-[#9B9B9B] font-bold">
            Frequently Asked Questions
          </span>
          <h2 className="heading-4 sm:heading-3 text-white">
            Answers to common platform questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#181818] border border-[#272727] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 title-4 text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#9B9B9B] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 body-5 text-[#9B9B9B] leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section per A2 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#181818] border border-[#272727] rounded-3xl p-8 sm:p-16 text-center space-y-6 max-w-[680px] mx-auto shadow-2xl">
          <h2 className="heading-3 sm:heading-2 hero-text-gradient">
            Explore curated inventory across India
          </h2>
          <p className="body-4 sm:body-2 text-[#9B9B9B] text-pretty">
            Start browsing immediately without account registration, or submit your property mandate for platform review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/properties"
              className="w-full sm:w-auto py-3 px-6 bg-white hover:bg-[#e0e0e0] text-black button-md rounded-xl transition-all duration-300 active:scale-[0.98]"
            >
              Browse Public Inventory
            </Link>
            <Link
              href="/submit-property"
              className="w-full sm:w-auto py-3 px-6 bg-[#272727] hover:bg-[#313131] text-white button-md rounded-xl border border-[#313131] transition-all duration-300 active:scale-[0.98]"
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
