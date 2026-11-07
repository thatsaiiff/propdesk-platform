"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import Link from "next/link";
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  MapPin, 
  Maximize2, 
  Info, 
  AlertCircle,
  ArrowRight
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Explanatory Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
          Admin Curation Intake
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Submit a Property for Listing Review
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          We operate an admin-curated platform. Submissions are intake requests reviewed by our listing desk to verify title documentation and photography before publication.
        </p>
      </div>

      {/* Critical Invariant Callout */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Important Publication Rule:</strong>
          Submitting this form creates an internal intake record with status <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono font-bold">RECEIVED</code>. Submissions are never automatically published to the public website. A platform administrator will contact you to verify mandate details.
        </div>
      </div>

      {successSubmissionId ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              Property Submission Received
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your submission has been queued for platform review with status <strong className="text-emerald-700">RECEIVED</strong>. Our listing team will review your property details and contact you.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Submission Reference ID
            </div>
            <div className="text-lg font-mono font-extrabold text-slate-900 mt-1">
              {successSubmissionId}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/account"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm"
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
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl"
            >
              Submit Another Property
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Relationship to Property */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Authority / Relationship to Property
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: "OWNER", label: "Direct Owner" },
                { id: "AUTHORIZED_REPRESENTATIVE", label: "Family / Power of Attorney" },
                { id: "BROKER", label: "Mandated Broker" },
                { id: "BUILDER", label: "Builder / Developer" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRelationship(r.id as any)}
                  className={`p-3 rounded-xl border text-center font-medium transition-smooth ${
                    relationship === r.id
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Intent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Property Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="MIXED_USE">Residential-cum-commercial (Mixed-Use)</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="LAND">Land / Plot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Transaction Intent
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="SALE">Outright Sale</option>
                <option value="LEASE">Commercial Lease</option>
                <option value="RENT">Residential Rent</option>
              </select>
            </div>
          </div>

          {/* Subtype & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Subtype
              </label>
              <input
                type="text"
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                placeholder="e.g. 4 BHK Penthouse, Office Floor"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Listing Title / Building Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sea Facing 4 BHK at Worli or Grade A Office in BKC"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Locality / Area Name
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Indiranagar, Worli, Baner"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Area & Private Expected Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Area Dimension
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Unit
              </label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="sq.ft.">sq.ft.</option>
                <option value="sq.yards">sq.yards</option>
                <option value="acres">acres</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Expected Price / Rent (Private Admin Note)
              </label>
              <input
                type="text"
                value={expectedValue}
                onChange={(e) => setExpectedValue(e.target.value)}
                placeholder="e.g. 14.5 Cr or 2.5 L/month"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Property Description & Salient Features
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe layout, condition, amenities, road width, power sanction, or other highlights."
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              {user ? `Submitting as ${user.name} (${user.email})` : "Email verification required upon submission"}
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
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
