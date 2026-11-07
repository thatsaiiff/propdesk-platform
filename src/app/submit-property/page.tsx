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
  AlertCircle
} from "lucide-react";

export default function SubmitPropertyPage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [relationship, setRelationship] = useState<"OWNER" | "AUTHORIZED_REPRESENTATIVE" | "BROKER" | "BUILDER">("OWNER");
  const [category, setCategory] = useState<"RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE" | "INDUSTRIAL" | "LAND">("RESIDENTIAL");
  const [subtype, setSubtype] = useState("Luxury Apartment");
  const [transactionType, setTransactionType] = useState<"SALE" | "RENT" | "LEASE">("SALE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [city, setCity] = useState("Mumbai");
  const [locality, setLocality] = useState("");
  const [area, setArea] = useState<number>(2500);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-[#EDE8E1] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#CC785C]" />
          <span>Admin Curation Intake</span>
        </div>
        <h1 className="font-claude-serif text-3xl sm:text-5xl text-[#EDE8E1] font-semibold tracking-tight">
          Submit Property for Listing Review
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E96] leading-relaxed max-w-2xl font-claude-sans">
          We operate an admin-curated platform. Submissions are intake requests reviewed by our listing desk to verify title documentation and photography before publication.
        </p>
      </div>

      {/* Critical Invariant Callout */}
      <div className="liquid-glass rounded-3xl p-6 flex items-start gap-3.5 text-[#A39E96] shadow-xl">
        <Info className="w-5 h-5 text-[#CC785C] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="text-[#EDE8E1] block font-bold mb-0.5 font-claude-sans">Important Publication Rule:</strong>
          Submitting this form creates an internal intake record with status <code className="bg-white/10 text-white px-1.5 py-0.5 rounded font-mono font-bold">RECEIVED</code>. Submissions are never automatically published to the public website. A platform administrator will contact you to verify mandate details.
        </div>
      </div>

      {successSubmissionId ? (
        <div className="liquid-glass-elevated rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 liquid-glass text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-claude-serif text-2xl text-[#EDE8E1] font-semibold">
              Property Submission Received
            </h3>
            <p className="text-xs sm:text-sm text-[#A39E96] max-w-md mx-auto leading-relaxed">
              Your submission has been queued for platform review with status <strong className="text-emerald-400 font-semibold">RECEIVED</strong>. Our listing team will review your property details and contact you.
            </p>
          </div>

          <div className="liquid-glass rounded-2xl p-4 max-w-xs mx-auto border-white/[0.08]">
            <div className="text-[10px] uppercase tracking-wider text-[#706D67] font-bold">
              Submission Reference ID
            </div>
            <div className="text-lg font-mono font-bold text-[#EDE8E1] mt-1">
              {successSubmissionId}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/account"
              className="py-2.5 px-5 liquid-glass-btn-accent text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
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
              className="py-2.5 px-5 liquid-glass-btn text-[#EDE8E1] text-xs font-semibold rounded-xl"
            >
              Submit Another Property
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="liquid-glass-elevated rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {error && (
            <div className="p-4 bg-red-950/40 text-red-300 text-xs rounded-2xl border border-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Relationship to Property */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
              Your Authority / Relationship to Property
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "OWNER", label: "Direct Owner" },
                { id: "AUTHORIZED_REPRESENTATIVE", label: "Family / POA" },
                { id: "BROKER", label: "Mandated Broker" },
                { id: "BUILDER", label: "Builder / Developer" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRelationship(r.id as any)}
                  className={`p-3 rounded-xl text-xs transition-all duration-300 font-medium ${
                    relationship === r.id
                      ? "liquid-glass-btn-accent text-white font-semibold shadow-sm"
                      : "liquid-glass text-[#A39E96] hover:text-[#EDE8E1]"
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
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Property Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              >
                <option value="RESIDENTIAL" className="bg-[#121215]">Residential</option>
                <option value="COMMERCIAL" className="bg-[#121215]">Commercial</option>
                <option value="MIXED_USE" className="bg-[#121215]">Mixed Use</option>
                <option value="INDUSTRIAL" className="bg-[#121215]">Industrial</option>
                <option value="LAND" className="bg-[#121215]">Land / Plot</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Transaction Intent
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as any)}
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              >
                <option value="SALE" className="bg-[#121215]">Outright Sale</option>
                <option value="LEASE" className="bg-[#121215]">Commercial Lease</option>
                <option value="RENT" className="bg-[#121215]">Residential Rent</option>
              </select>
            </div>
          </div>

          {/* Subtype & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Subtype
              </label>
              <input
                type="text"
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                placeholder="e.g. 4 BHK Penthouse, Office Floor"
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Listing Title / Building Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sea Facing 4 BHK at Worli or Grade A Office in BKC"
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Locality / Area Name
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Indiranagar, Worli, Baner"
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>
          </div>

          {/* Area & Private Expected Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Area Dimension
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                required
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Unit
              </label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              >
                <option value="sq.ft." className="bg-[#121215]">sq.ft.</option>
                <option value="sq.yards" className="bg-[#121215]">sq.yards</option>
                <option value="acres" className="bg-[#121215]">acres</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
                Expected Value (Private Admin Note)
              </label>
              <input
                type="text"
                value={expectedValue}
                onChange={(e) => setExpectedValue(e.target.value)}
                placeholder="e.g. 14.5 Cr or 2.5 L/month"
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706D67] block">
              Property Description & Salient Features
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe layout, condition, amenities, road width, power sanction, or other highlights."
              required
              className="w-full p-3 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
            <span className="text-xs text-[#706D67]">
              {user ? `Submitting as ${user.name} (${user.email})` : "Email verification required upon submission"}
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 liquid-glass-btn-accent text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {submitting ? "Submitting for Review..." : "Submit Property to Admin Desk"}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
