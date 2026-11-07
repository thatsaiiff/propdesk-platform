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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181818] rounded-3xl shadow-2xl border border-[#272727] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#272727] bg-[#1F1F1F]">
          <div>
            <span className="caption-5 font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-900/50 px-2 py-0.5 rounded">
              {jvOpportunity ? "Builder JV Inquiry" : "Price & Advisory Request"}
            </span>
            <h3 className="title-2 font-bold text-white mt-1 line-clamp-1">
              {property?.title || jvOpportunity?.title || "Property Inquiry"}
            </h3>
            <p className="caption-3 text-[#9B9B9B]">
              {property ? `${property.locality}, ${property.city}` : jvOpportunity ? `${jvOpportunity.location}, ${jvOpportunity.city}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#9B9B9B] hover:text-white hover:bg-[#272727]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {successReference ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-950/80 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="title-1 font-bold text-white">Inquiry Received</h4>
                <p className="body-5 text-[#9B9B9B] max-w-sm mx-auto text-pretty">
                  Your inquiry has been routed to our property advisory desk. A representative will contact you with official pricing schedules and verified documentation.
                </p>
              </div>

              <div className="bg-[#1F1F1F] border border-[#272727] rounded-2xl p-4 max-w-xs mx-auto">
                <div className="caption-4 uppercase tracking-wider text-[#666666] font-bold">
                  Public Inquiry Reference
                </div>
                <div className="heading-4 font-mono font-bold text-blue-400 mt-1">
                  {successReference}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 caption-3 text-[#666666] pt-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Operational Target: Response within business hours</span>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-3 bg-white text-black button-sm rounded-xl font-semibold transition-all active:scale-[0.98]"
              >
                Close & Return to Browsing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/40 text-red-300 caption-3 rounded-xl border border-red-900">
                  {error}
                </div>
              )}

              {/* Informative notice on pricing */}
              <div className="bg-[#1F1F1F] border border-[#272727] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#9B9B9B]">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold mb-0.5">Inquiry Led Pricing Model</strong>
                  Prices are not displayed publicly. Complete this inquiry to receive verified owner pricing, payment plans, and inspection scheduling.
                </div>
              </div>

              {/* Intent Selection */}
              {!jvOpportunity && (
                <div className="space-y-1.5">
                  <label className="caption-3 uppercase text-[#666666] font-bold block">
                    Your Participant Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["BUY", "RENT", "INVEST"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setIntent(cat)}
                        className={`py-2 px-3 rounded-xl border button-xsm transition-all duration-300 ${
                          intent === cat
                            ? "bg-white text-black font-semibold shadow-sm"
                            : "border-[#272727] bg-[#1F1F1F] text-[#9B9B9B] hover:text-white"
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
                  <label className="caption-3 uppercase text-[#666666] font-bold block">
                    Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full p-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white focus:outline-none"
                  >
                    <option>Immediate (within 30 days)</option>
                    <option>1 to 3 months</option>
                    <option>3 to 6 months</option>
                    <option>Exploring / Long term</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="caption-3 uppercase text-[#666666] font-bold block">
                    Objective
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white focus:outline-none"
                  >
                    <option>Self use / Primary residence</option>
                    <option>Rental yield / Investment</option>
                    <option>Corporate / Commercial operations</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="caption-3 uppercase text-[#666666] font-bold block">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#666666] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Arjun Verma"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="caption-3 uppercase text-[#666666] font-bold block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        disabled={!!user}
                        className="w-full pl-9 pr-3 py-2 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white focus:outline-none disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="caption-3 uppercase text-[#666666] font-bold block">
                      Phone Number (For Price Call)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#666666] absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="caption-3 uppercase text-[#666666] font-bold block">
                    Specific Requirements or Questions
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* In-modal OTP Step for guests */}
              {!user && otpStep && (
                <div className="bg-[#1F1F1F] p-4 rounded-2xl border border-[#272727] space-y-2">
                  <div className="caption-3 font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-blue-400" />
                    Enter 6-Digit Email Code
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2.5 bg-[#181818] border border-[#272727] rounded-xl text-center font-mono text-base tracking-widest text-white focus:outline-none"
                  />
                  {demoOtpHint && (
                    <div className="caption-4 text-[#9B9B9B] flex justify-between items-center">
                      <span>{demoOtpHint}</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode("123456")}
                        className="text-blue-400 font-bold underline"
                      >
                        Auto fill
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mandatory Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 caption-4 text-[#9B9B9B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    required
                    className="mt-0.5 rounded border-[#272727] bg-[#1F1F1F] text-blue-600 focus:ring-0"
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
                className="w-full py-3 bg-white hover:bg-[#e0e0e0] text-black button-sm rounded-xl font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
