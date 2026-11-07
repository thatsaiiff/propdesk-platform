"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { 
  Building2, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  AlertTriangle,
  Lock,
  Layers,
  MapPin
} from "lucide-react";

export default function SubmitPropertyPage() {
  const { user } = useAuth();
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [category, setCategory] = useState("FLAT");
  const [purpose, setPurpose] = useState("SALE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [locality, setLocality] = useState("");
  const [area, setArea] = useState<number>(3500);
  const [areaUnit, setAreaUnit] = useState("sq.ft.");
  const [askingPrice, setAskingPrice] = useState<number>(180000000);
  const [isJointVenture, setIsJointVenture] = useState(false);
  const [isDisputed, setIsDisputed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setOnboardingOpen(true);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          purpose,
          title,
          description,
          city,
          state,
          locality,
          area: Number(area),
          areaUnit,
          askingPrice: Number(askingPrice),
          isJointVenture,
          isDisputed,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.submission) {
        setSubmittedId(data.submission.id);
      } else {
        setError(data.error || "Failed to submit property.");
      }
    } catch {
      setLoading(false);
      setError("Network error submitting property.");
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-white flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 sm:px-10 py-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <span className="text-xs font-semibold text-slate-300">Property Owner & Broker Intake Desk</span>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full flex-1">
        {submittedId ? (
          <div className="liquid-glass-elevated rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-white/20 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl liquid-glass bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white">
                Property Mandate Received
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your submission is registered under status <strong className="text-amber-400">PENDING_REVIEW</strong>. Our central desk will review title facts and contact you before public curation.
              </p>
            </div>

            <div className="p-3 rounded-xl liquid-glass max-w-xs mx-auto text-xs font-mono text-slate-300 border border-white/10">
              Reference: <strong className="text-white">{submittedId}</strong>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/discover"
                className="py-3 px-6 rounded-xl liquid-glass-btn-royal font-bold text-xs text-white shadow-lg"
              >
                Go to Discovery Feed
              </Link>
              <button
                onClick={() => setSubmittedId(null)}
                className="py-3 px-6 rounded-xl liquid-glass text-xs font-semibold text-slate-300 hover:text-white"
              >
                Submit Another Mandate
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-bold text-amber-400 border border-amber-500/30 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin-Curated Mandate Intake</span>
              </div>
              <h1 className="font-claude-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Submit Property for Platform Review
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                Submissions are reviewed by our central underwriting desk. Only approved and verified properties enter the public discovery catalog.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="liquid-glass-elevated rounded-3xl p-6 sm:p-8 space-y-6 border border-white/15 shadow-2xl">
              <div>
                <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">
                  Property Title / Mandate Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5,000 sq.ft. Commercial Office Floor in BKC"
                  required
                  className="w-full p-3 rounded-xl liquid-glass-input text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl liquid-glass-input text-xs text-white focus:outline-none"
                  >
                    <option value="FLAT" className="bg-[#121B33]">Flat / Apartment</option>
                    <option value="HOUSE" className="bg-[#121B33]">House / Villa</option>
                    <option value="PLOT" className="bg-[#121B33]">Vacant Plot</option>
                    <option value="INDUSTRIAL_LAND" className="bg-[#121B33]">Industrial Land</option>
                    <option value="WAREHOUSE" className="bg-[#121B33]">Warehouse</option>
                    <option value="FACTORY" className="bg-[#121B33]">Factory</option>
                    <option value="BUILDING_WITH_LAND" className="bg-[#121B33]">Building with Land</option>
                    <option value="DISPUTED" className="bg-[#121B33]">Disputed (Maximum Discount)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">Purpose</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-3 rounded-xl liquid-glass-input text-xs text-white focus:outline-none"
                  >
                    <option value="SALE" className="bg-[#121B33]">Outright Sale</option>
                    <option value="RENT" className="bg-[#121B33]">Rental Lease</option>
                    <option value="BOTH" className="bg-[#121B33]">Both (Sale or Lease)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl liquid-glass-input text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl liquid-glass-input text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">Locality</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    required
                    placeholder="e.g. Bandra West"
                    className="w-full p-3 rounded-xl liquid-glass-input text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">Total Area</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    required
                    className="w-full p-3 rounded-xl liquid-glass-input text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">Expected Asking Benchmark (₹)</label>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(Number(e.target.value))}
                    required
                    className="w-full p-3 rounded-xl liquid-glass-input text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isJointVenture}
                    onChange={(e) => setIsJointVenture(e.target.checked)}
                    className="rounded"
                  />
                  <span>Joint Venture Proposal (Builder-Exclusive)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDisputed}
                    onChange={(e) => setIsDisputed(e.target.checked)}
                    className="rounded"
                  />
                  <span>Disputed Property</span>
                </label>
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-slate-300 block mb-1">Description & Salient Highlights</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail condition, road width, power sanction, title documents, or tenant status."
                  required
                  className="w-full p-3 rounded-xl liquid-glass-input text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl liquid-glass-btn-royal font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Submitting for Review..." : "Submit Mandate for Admin Review"}</span>
              </button>
            </form>
          </div>
        )}
      </main>

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
}
