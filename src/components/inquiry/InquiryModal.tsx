"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PublicPropertyDTO, JointVentureOpportunity } from "@/types";
import { 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User as UserIcon, 
  Building,
  KeyRound
} from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: PublicPropertyDTO;
  jvOpportunity?: JointVentureOpportunity;
}

export default function InquiryModal({ isOpen, onClose, property, jvOpportunity }: InquiryModalProps) {
  const { user, requestOtp, verifyOtp, refreshUser } = useAuth();

  const [intent, setIntent] = useState<"BUY" | "RENT" | "INVEST" | "BUILDER" | "JV">(
    jvOpportunity ? "JV" : property?.transactionType === "RENT" ? "RENT" : "BUY"
  );
  const [timeline, setTimeline] = useState("Immediate (within 30 days)");
  const [purpose, setPurpose] = useState("Self-use / Primary residence");
  const [contactName, setContactName] = useState(user?.name || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState(
    jvOpportunity
      ? "Interested in reviewing preliminary feasibility, FAR, and sharing structure for this JV opportunity."
      : "Please share verified pricing breakdown, floor plans, and site inspection slots for this property."
  );
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Authentication sub-step if user is not logged in
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!contactPhone || contactPhone.length < 10) {
      setError("Please provide a valid 10-digit phone number for pricing follow-up.");
      return;
    }

    if (!consentAgreed) {
      setError("You must consent to being contacted by our advisory desk.");
      return;
    }

    // If user is not authenticated, request OTP first
    if (!user && !otpStep) {
      setSubmitting(true);
      try {
        const otpRes = await requestOtp(contactEmail);
        if (otpRes.success) {
          setDemoOtpHint(otpRes.demoCodeHint || "Demo code: 123456");
          setOtpStep(true);
          setSubmitting(false);
          return;
        } else {
          setError(otpRes.error?.message || "Failed to initiate verification.");
          setSubmitting(false);
          return;
        }
      } catch {
        setError("Error requesting verification code.");
        setSubmitting(false);
        return;
      }
    }

    // If in OTP step, verify it before creating inquiry
    if (!user && otpStep) {
      setSubmitting(true);
      try {
        const verified = await verifyOtp(contactEmail, otpCode);
        if (!verified) {
          setError("Invalid verification code. Use 123456 for demo.");
          setSubmitting(false);
          return;
        }
        await refreshUser();
      } catch {
        setError("Verification error.");
        setSubmitting(false);
        return;
      }
    }

    // Now submit the inquiry
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property?.id,
          jvOpportunityId: jvOpportunity?.id,
          intent,
          contactName,
          contactEmail,
          contactPhone,
          message,
          answers: {
            timeline,
            purpose,
            collaborationType: jvOpportunity?.collaborationType,
          },
          consentAgreed: true,
          consentVersion: "2026-v1",
        }),
      });

      const data = await res.json();
      if (data.success && data.inquiry) {
        setSuccessReference(data.inquiry.publicReference);
      } else {
        setError(data.error?.message || "Failed to submit inquiry.");
      }
    } catch {
      setError("Network error while submitting inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              {jvOpportunity ? "Builder JV Inquiry" : "Price & Advisory Request"}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
              {property?.title || jvOpportunity?.title || "Property Inquiry"}
            </h3>
            <p className="text-xs text-slate-500">
              {property ? `${property.locality}, ${property.city}` : jvOpportunity ? `${jvOpportunity.location}, ${jvOpportunity.city}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {successReference ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Inquiry Received</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Your inquiry has been assigned to our property desk. An advisor will contact you with official pricing schedules and verified documentation.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Public Inquiry Reference
                </div>
                <div className="text-xl font-mono font-extrabold text-brand-700 mt-1">
                  {successReference}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>Operational Target: Response within business hours</span>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Close & Return to Browsing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              {/* Informative notice on pricing */}
              <div className="bg-brand-50/60 border border-brand-100 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-brand-900">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Inquiry-Led Pricing Model</strong>
                  Prices are not displayed publicly. Complete this inquiry to receive verified owner pricing, payment plans, and inspection scheduling.
                </div>
              </div>

              {/* Intent Selection */}
              {!jvOpportunity && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Primary Intent / Category
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["BUY", "RENT", "INVEST"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setIntent(cat)}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition-smooth ${
                          intent === cat
                            ? "bg-brand-50 border-brand-500 text-brand-700 font-semibold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {cat === "BUY" ? "Buyer" : cat === "RENT" ? "Tenant" : "Investor"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contextual Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option>Immediate (within 30 days)</option>
                    <option>1 to 3 months</option>
                    <option>3 to 6 months</option>
                    <option>Exploring / Long term</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Objective
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option>Self-use / Primary residence</option>
                    <option>Rental yield / Investment</option>
                    <option>Corporate / Commercial operations</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Arjun Verma"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        disabled={!!user}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-75"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (For Price Call)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Requirements or Questions
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              {/* In-modal OTP Step for guests */}
              {!user && otpStep && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <KeyRound className="w-4 h-4 text-brand-600" />
                    Enter 6-Digit Email Code
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-center font-mono text-sm tracking-widest"
                  />
                  {demoOtpHint && (
                    <div className="text-[11px] text-slate-500 flex justify-between items-center">
                      <span>{demoOtpHint}</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode("123456")}
                        className="text-brand-600 font-bold underline"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mandatory Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    required
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="leading-tight">
                    I consent to being contacted by PropDesk representatives regarding this property and private pricing details.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Processing Inquiry..."
                ) : !user && !otpStep ? (
                  <>
                    <span>Verify Email & Request Price</span>
                    <Send className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Send Inquiry to Advisory Desk</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
