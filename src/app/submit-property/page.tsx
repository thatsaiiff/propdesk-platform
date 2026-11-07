"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Info, 
  AlertCircle,
  Landmark,
  Building2,
  FileText
} from "lucide-react";

export default function SubmitPropertyPage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [relationship, setRelationship] = useState<"OWNER" | "AUTHORIZED_REPRESENTATIVE" | "BROKER" | "BUILDER">("OWNER");
  const [category, setCategory] = useState<"RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE" | "INDUSTRIAL" | "LAND">("COMMERCIAL");
  const [subtype, setSubtype] = useState("Bank-Auctioned Commercial Floor");
  const [transactionType, setTransactionType] = useState<"SALE" | "RENT" | "LEASE">("SALE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [city, setCity] = useState("Mumbai");
  const [locality, setLocality] = useState("");
  const [area, setArea] = useState<number>(5000);
  const [areaUnit, setAreaUnit] = useState<"sq.ft." | "sq.yards" | "acres">("sq.ft.");
  const [expectedValue, setExpectedValue] = useState("");
  const [contactPreference, setContactPreference] = useState<"PHONE" | "EMAIL" | "WHATSAPP">("PHONE");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSubmissionId, setSuccessSubmissionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!title || !description || !locality) {
      setError("Please complete all required property facts and locality.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/property-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationshipToProperty: relationship,
          category,
          subtype,
          transactionType,
          title,
          description,
          state,
          city,
          locality,
          area: Number(area),
          areaUnit,
          contactPreference,
          expectedPriceOrRent: expectedValue,
        }),
      });

      const data = await res.json();
      if (data.success && data.submission) {
        setSuccessSubmissionId(data.submission.id);
      } else {
        setError(data.error?.message || "Failed to submit property.");
      }
    } catch {
      setError("Network error while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-xs font-bold border border-royal-500/30 text-royal-600 dark:text-gold-400">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
          <span>Admin Underwriting Intake</span>
        </div>
        <h1 className="font-claude-serif text-3xl sm:text-5xl text-slate-900 dark:text-slate-100 font-bold tracking-tight">
          Enlist Property with PropDesk Admins
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-claude-sans">
          Enlist bank-auctioned recovery assets, Grade-A commercial office floors, industrial parks, or freehold land parcels. Our central desk conducts internal title audits and syndicates your property directly to verified institutional buyers with zero public price leaks.
        </p>
      </div>

      {/* Critical Invariant Callout */}
      <div className="liquid-glass rounded-3xl p-6 flex items-start gap-3.5 text-slate-600 dark:text-slate-300 shadow-xl border border-royal-500/20">
        <Info className="w-5 h-5 text-royal-600 dark:text-gold-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-100 block font-bold mb-0.5 font-claude-sans">Strict Intake Policy:</strong>
          Submitting this form creates an internal administrative record with status <code className="bg-slate-200 dark:bg-white/10 text-royal-600 dark:text-gold-400 px-1.5 py-0.5 rounded font-mono font-bold">RECEIVED</code>. Submissions are never auto-published to preserve confidentiality and title integrity. Our transaction underwriters will contact you to verify mandate documentation.
        </div>
      </div>

      {successSubmissionId ? (
        <div className="liquid-glass-elevated rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl border border-royal-500/30">
          <div className="w-16 h-16 liquid-glass text-emerald-500 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-claude-serif text-2xl text-slate-900 dark:text-slate-100 font-bold">
              Property Intake Mandate Received
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Your property has been registered for central administrative review with status <strong className="text-emerald-500 font-semibold">RECEIVED</strong>. Our desk underwriters will review the documentation and contact you.
            </p>
          </div>

          <div className="liquid-glass rounded-2xl p-4 max-w-xs mx-auto border border-slate-200/40 dark:border-white/[0.08]">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Intake Reference ID
            </div>
            <div className="text-lg font-mono font-bold text-royal-600 dark:text-gold-400 mt-1">
              {successSubmissionId}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/account"
              className="py-2.5 px-5 liquid-glass-btn-royal text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Track in My Submissions
            </Link>
            <button
              onClick={() => {
                setSuccessSubmissionId(null);
                setTitle("");
                setDescription("");
                setLocality("");
              }}
              className="py-2.5 px-5 liquid-glass text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl"
            >
              Enlist Another Asset
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="liquid-glass-elevated rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 border border-royal-500/20">
          {error && (
            <div className="p-4 bg-red-950/40 text-red-300 text-xs rounded-2xl border border-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Relationship to Property */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Your Mandate Authority / Submitting Entity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "OWNER", label: "Direct Property Owner" },
                { id: "AUTHORIZED_REPRESENTATIVE", label: "Bank / Financial Entity / ARC" },
                { id: "BROKER", label: "Mandated Institutional Broker" },
                { id: "BUILDER", label: "Developer / Builder" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRelationship(r.id as any)}
                  className={`p-3 rounded-xl text-xs transition-all duration-300 font-medium ${
                    relationship === r.id
                      ? "liquid-glass-btn-royal text-white font-bold shadow-sm"
                      : "liquid-glass text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Intent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Asset Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="COMMERCIAL">Commercial Office & Retail</option>
                <option value="INDUSTRIAL">Industrial & Warehousing</option>
                <option value="LAND">Development Land / Freehold Plot</option>
                <option value="RESIDENTIAL">Luxury Residential Estate</option>
                <option value="MIXED_USE">Mixed Use Commercial Hub</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Transaction Intent
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as any)}
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="SALE">Outright Sale / Bank Auction</option>
                <option value="LEASE">Long-Term Commercial Lease</option>
                <option value="RENT">Pre-Leased Yield / Rent</option>
              </select>
            </div>
          </div>

          {/* Subtype & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Asset Subtype / Tag
              </label>
              <input
                type="text"
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                placeholder="e.g. Bank Auction, Grade-A IT Park, Warehouse"
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Asset Title / Mandate Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bank Seized Commercial Complex in BKC or Freehold Plot in Whitefield"
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Locality / Hub
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. BKC, Indiranagar, Cyber City"
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Area & Expected Reserve / Benchmark */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Built-up / Plot Area
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Unit
              </label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="sq.ft.">sq.ft.</option>
                <option value="sq.yards">sq.yards</option>
                <option value="acres">acres</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Asking Benchmark / Reserve Price (Private Admin Note)
              </label>
              <input
                type="text"
                value={expectedValue}
                onChange={(e) => setExpectedValue(e.target.value)}
                placeholder="e.g. 24.5 Cr Reserve or 45 L/month"
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Asset Details, Bank Mandate Info, or Specifications
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State bank SARFAESI notice details, current lease covenants, ceiling heights, floor plates, power approvals, or possession terms."
              required
              className="w-full p-3 liquid-glass-input rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-200/40 dark:border-white/[0.08] flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              {user ? `Submitting mandate as ${user.name} (${user.email})` : "Email verification required upon submission"}
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-6 liquid-glass-btn-gold text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {submitting ? "Registering Mandate..." : "Enlist Asset with Admins"}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
