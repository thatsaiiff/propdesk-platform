"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, KeyRound, CheckCircle2, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultEmail?: string;
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultEmail }: AuthModalProps) {
  const { requestOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState(defaultEmail || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoHint, setDemoHint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await requestOtp(email);
      if (res.success) {
        setDemoHint(res.demoCodeHint || "Demo code: 123456");
        setStep("OTP");
      } else {
        setError(res.error?.message || "Failed to send verification code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const success = await verifyOtp(email, otp);
      if (success) {
        onSuccess?.();
        onClose();
      } else {
        setError("Invalid or expired code. Please use 123456 for demo.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#181818] rounded-3xl shadow-2xl border border-[#272727] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#272727]">
          <div>
            <h3 className="title-1 font-bold text-white">
              {step === "EMAIL" ? "Sign In to PropDesk" : "Enter Verification Code"}
            </h3>
            <p className="caption-3 text-[#9B9B9B] mt-0.5">
              {step === "EMAIL"
                ? "Passwordless authentication via Email OTP"
                : `We sent a 6-digit code to ${email}`}
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
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 text-red-300 caption-3 rounded-xl border border-red-900">
              {error}
            </div>
          )}

          {step === "EMAIL" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="caption-3 uppercase text-[#666666] font-bold block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#3a3a3a]"
                  />
                </div>
              </div>

              <div className="bg-[#1F1F1F] p-3 rounded-xl border border-[#272727] space-y-1.5">
                <div className="caption-4 font-bold text-[#9B9B9B]">Quick Evaluation Accounts:</div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEmail("arjun@example.demo")}
                    className="px-2 py-0.5 bg-[#272727] border border-[#313131] rounded caption-4 text-white hover:border-[#444]"
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmail("builder@apexinfra.demo")}
                    className="px-2 py-0.5 bg-[#272727] border border-[#313131] rounded caption-4 text-white hover:border-[#444]"
                  >
                    Builder (JV)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmail("admin@propdesk.demo")}
                    className="px-2 py-0.5 bg-[#272727] border border-[#313131] rounded caption-4 text-white hover:border-[#444]"
                  >
                    Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-[#e0e0e0] text-black button-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? "Sending Code..." : "Continue with Email"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="caption-3 uppercase text-[#666666] font-bold block">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl text-center text-lg font-mono tracking-widest text-white focus:outline-none"
                  />
                </div>
              </div>

              {demoHint && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-900/60 rounded-xl text-emerald-300 caption-3 flex items-center justify-between">
                  <span>{demoHint}</span>
                  <button
                    type="button"
                    onClick={() => setOtp("123456")}
                    className="font-bold underline text-white"
                  >
                    Auto fill
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-[#e0e0e0] text-black button-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep("EMAIL")}
                className="w-full text-center caption-3 text-[#9B9B9B] hover:text-white"
              >
                Change Email Address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
