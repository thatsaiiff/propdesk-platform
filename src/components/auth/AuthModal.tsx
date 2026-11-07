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
        setDemoHint(res.demoCodeHint || "Demo OTP: 123456");
        setStep("OTP");
      } else {
        setError(res.error?.message || "Failed to send OTP.");
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
      setError("Please enter the 6-digit OTP code.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {step === "EMAIL" ? "Sign In to PropDesk" : "Enter Verification Code"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === "EMAIL"
                ? "Passwordless authentication via Email OTP"
                : `We sent a 6-digit code to ${email}`}
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
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {step === "EMAIL" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700">Quick Test Accounts:</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setEmail("arjun@example.demo")}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-brand-500"
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmail("builder@apexinfra.demo")}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-brand-500"
                  >
                    Builder (JV)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmail("admin@propdesk.demo")}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-brand-500"
                  >
                    Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Sending Code..." : "Continue with Email"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {demoHint && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
                  <span>{demoHint}</span>
                  <button
                    type="button"
                    onClick={() => setOtp("123456")}
                    className="font-bold underline text-emerald-900"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep("EMAIL")}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
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
