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
  const [purpose, setPurpose] = useState("Self use / Primary residence");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg liquid-glass-elevated rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/[0.08] liquid-glass">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC785C] liquid-glass-pill px-2.5 py-0.5 rounded-full border-[#CC785C]/30">
              {jvOpportunity ? "Builder JV Inquiry" : "Price & Advisory Request"}
            </span>
            <h3 className="font-claude-serif text-lg font-semibold text-[#EDE8E1] mt-1.5 line-clamp-1">
              {property?.title || jvOpportunity?.title || "Property Inquiry"}
            </h3>
            <p className="text-xs text-[#A39E96]">
              {property ? `${property.locality}, ${property.city}` : jvOpportunity ? `${jvOpportunity.location}, ${jvOpportunity.city}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#A39E96] hover:text-[#EDE8E1] hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {successReference ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 liquid-glass text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-claude-serif text-2xl font-semibold text-[#EDE8E1]">Inquiry Received</h4>
                <p className="text-xs sm:text-sm text-[#A39E96] max-w-sm mx-auto leading-relaxed">
                  Your inquiry has been routed to our property advisory desk. A representative will contact you with official pricing schedules and verified documentation.
                </p>
              </div>

              <div className="liquid-glass rounded-2xl p-4 max-w-xs mx-auto border-white/[0.08]">
                <div className="text-[10px] uppercase tracking-wider text-[#706D67] font-bold">
                  Public Inquiry Reference
                </div>
                <div className="text-xl font-mono font-bold text-[#CC785C] mt-1">
                  {successReference}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#706D67] pt-2">
                <Clock className="w-4 h-4 text-[#CC785C]" />
                <span>Operational Target: Response within business hours</span>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-3 liquid-glass-btn-accent text-white text-xs font-semibold rounded-xl transition-all active:scale-[0.98]"
              >
                Close & Return to Browsing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/40 text-red-300 text-xs rounded-xl border border-red-900/60">
                  {error}
                </div>
              )}

              {/* Informative notice on pricing */}
              <div className="liquid-glass rounded-2xl p-4 flex items-start gap-3 text-xs text-[#A39E96] border-white/[0.08]">
                <ShieldCheck className="w-4 h-4 text-[#CC785C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#EDE8E1] block font-bold mb-0.5 font-claude-sans">Inquiry-Led Pricing Model</strong>
                  Prices are not displayed publicly. Complete this inquiry to receive verified owner pricing, payment plans, and inspection scheduling.
                </div>
              </div>

              {/* Intent Selection */}
              {!jvOpportunity && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                    Your Participant Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["BUY", "RENT", "INVEST"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setIntent(cat)}
                        className={`py-2 px-3 rounded-xl text-xs transition-all duration-300 font-medium ${
                          intent === cat
                            ? "liquid-glass-btn-accent text-white font-semibold shadow-sm"
                            : "liquid-glass text-[#A39E96] hover:text-[#EDE8E1]"
                        }`}
                      >
                        {cat === "BUY" ? "Buyer" : cat === "RENT" ? "Tenant" : "Investor"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contextual Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                    Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
                  >
                    <option className="bg-[#121215]">Immediate (within 30 days)</option>
                    <option className="bg-[#121215]">1 to 3 months</option>
                    <option className="bg-[#121215]">3 to 6 months</option>
                    <option className="bg-[#121215]">Exploring / Long term</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                    Objective
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
                  >
                    <option className="bg-[#121215]">Self use / Primary residence</option>
                    <option className="bg-[#121215]">Rental yield / Investment</option>
                    <option className="bg-[#121215]">Corporate / Commercial operations</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#706D67] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Arjun Verma"
                      required
                      className="w-full pl-9 pr-3 py-2 liquid-glass-input rounded-xl text-xs sm:text-sm text-[#EDE8E1] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#706D67] absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        disabled={!!user}
                        className="w-full pl-9 pr-3 py-2 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                      Phone Number (For Price Call)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#706D67] absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-9 pr-3 py-2 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                    Specific Requirements or Questions
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
                  />
                </div>
              </div>

              {/* In-modal OTP Step for guests */}
              {!user && otpStep && (
                <div className="liquid-glass p-4 rounded-2xl border-white/[0.1] space-y-2">
                  <div className="text-xs font-bold text-[#EDE8E1] flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#CC785C]" />
                    Enter 6-Digit Email Code
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2.5 liquid-glass-input rounded-xl text-center font-mono text-base tracking-widest text-[#EDE8E1] focus:outline-none"
                  />
                  {demoOtpHint && (
                    <div className="text-xs text-[#A39E96] flex justify-between items-center">
                      <span>{demoOtpHint}</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode("123456")}
                        className="text-[#CC785C] font-bold underline"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mandatory Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-[#A39E96] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    required
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-[#CC785C] focus:ring-0"
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
                className="w-full py-3 liquid-glass-btn-accent text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
