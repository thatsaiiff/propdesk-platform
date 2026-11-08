"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole, PropertyCategory, PropertyPurpose, BuilderOpportunityType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Building2, 
  Home, 
  Landmark, 
  Factory, 
  Warehouse, 
  MapPin, 
  AlertTriangle, 
  Lock,
  Layers,
  KeyRound
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OnboardingStep = 
  | "EMAIL"
  | "OTP"
  | "NAME_PHONE"
  | "ROLES"
  | "INVENTORY_TYPE"
  | "CATEGORY"
  | "PURPOSE";

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const router = useRouter();
  const { user, requestOtp, verifyOtp, updateOnboarding } = useAuth();

  const [step, setStep] = useState<OnboardingStep>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // Selections
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [selectedInventoryType, setSelectedInventoryType] = useState<"BANK_NBFC" | "NON_BANK_NBFC" | "BOTH">("BOTH");
  const [selectedCategories, setSelectedCategories] = useState<PropertyCategory[]>(["FLAT"]);
  const [isJvOpportunity, setIsJvOpportunity] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState<PropertyPurpose>("BUY");

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [liveDispatched, setLiveDispatched] = useState(false);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Countdown timer for resend OTP cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Clear throttling error once cooldown reaches 0
  useEffect(() => {
    if (cooldown === 0 && error && error.toLowerCase().includes("wait")) {
      setError(null);
    }
  }, [cooldown, error]);

  if (!isOpen) return null;

  // Step 1: Send OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);

    const res = await requestOtp(email);
    setLoading(false);

    if (res.success) {
      setIsNewUser(!!res.isNewUser);
      setDevCode(res.devCode || null);
      setLiveDispatched(!!res.liveDispatched);
      setDispatchNotice((res as any).dispatchError || null);
      setCooldown(res.cooldownSeconds || 30);
      setStep("OTP");
    } else {
      setError(res.error || "Failed to send code.");
      if (res.cooldownSeconds) setCooldown(res.cooldownSeconds);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter the verification code.");
      return;
    }
    setError(null);
    setLoading(true);

    const res = await verifyOtp(email, otp);
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.roles && res.user.roles.length > 0) {
        setSelectedRoles(res.user.roles);
      }
      if (res.isNewUser || !res.user.name) {
        setStep("NAME_PHONE");
      } else if (!res.user.isOnboarded || res.user.roles.length === 0) {
        setStep("ROLES");
      } else {
        // First thing user is asked after sign-in: Inventory type!
        setStep("INVENTORY_TYPE");
      }
    } else {
      setError(res.error || "Incorrect or expired code.");
    }
  };

  // Step 3: Save Name and Phone
  const handleSaveNamePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setError("Please enter a valid contact phone number.");
      return;
    }
    setError(null);
    setLoading(true);

    const res = await updateOnboarding({ name, phone });
    setLoading(false);

    if (res.success) {
      setStep("ROLES");
    } else {
      setError(res.error || "Failed to save profile.");
    }
  };

  // Step 4: Toggle Roles (Multi-select)
  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleRolesContinue = async () => {
    if (selectedRoles.length === 0) {
      setError("Please select at least one role to continue.");
      return;
    }
    setError(null);
    setLoading(true);

    const res = await updateOnboarding({ roles: selectedRoles });
    setLoading(false);

    if (res.success) {
      // Step 1 after sign in: Select Bank / NBFC listed, Non Bank / NBFC listed, Both
      setStep("INVENTORY_TYPE");
    } else {
      setError(res.error || "Failed to update roles.");
    }
  };

  // Step 5: Inventory Type Selection
  const handleInventoryContinue = async () => {
    setLoading(true);
    await updateOnboarding({
      preferences: {
        inventoryTypePreference: selectedInventoryType,
        builderOpportunityType: selectedRoles.includes("BUILDER") && isJvOpportunity
          ? "JOINT_VENTURE"
          : selectedInventoryType === "BANK_NBFC"
          ? "BANK_NBFC"
          : "NON_BANK_NBFC",
      },
    });
    setLoading(false);
    setStep("CATEGORY");
  };

  // Step 6: Multi-Select Categories
  const toggleCategory = (cat: PropertyCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1
          ? prev.filter((c) => c !== cat)
          : prev
        : [...prev, cat]
    );
  };

  const handleCategoryContinue = async () => {
    if (selectedCategories.length === 0) {
      setError("Please select at least one property category.");
      return;
    }
    setError(null);
    setLoading(true);
    await updateOnboarding({
      preferences: {
        categories: selectedCategories,
        category: selectedCategories[0],
      },
    });
    setLoading(false);
    setStep("PURPOSE");
  };

  // Step 7: Final Purpose & Go to Discover
  const handleFinalSubmit = async () => {
    setLoading(true);
    const res = await updateOnboarding({
      roles: selectedRoles.length > 0 ? selectedRoles : undefined,
      preferences: {
        inventoryTypePreference: selectedInventoryType,
        categories: selectedCategories,
        category: selectedCategories[0] || "FLAT",
        purpose: selectedPurpose,
        builderOpportunityType: selectedRoles.includes("BUILDER") && isJvOpportunity
          ? "JOINT_VENTURE"
          : selectedInventoryType === "BANK_NBFC"
          ? "BANK_NBFC"
          : "NON_BANK_NBFC",
      },
      isOnboarded: true,
    });
    setLoading(false);

    if (res.success) {
      onClose();
      router.push("/discover");
    } else {
      setError(res.error || "Failed to complete onboarding.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg liquid-glass-elevated rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/20 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl liquid-glass text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
            {step === "EMAIL" || step === "OTP" || step === "NAME_PHONE"
              ? "Discreet Authentication"
              : "Guided Preference Onboarding"}
          </span>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP A: ASK EMAIL */}
          {step === "EMAIL" && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Let’s get you started.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  Enter your email address to receive passwordless verification.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoFocus
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl liquid-glass-input text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl liquid-glass-btn-royal font-semibold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>{loading ? "Sending Code..." : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-[11px] text-slate-400 text-center leading-relaxed">
                By continuing, you agree to our confidential mandate discovery standards. Zero public pricing disclosures.
              </div>
            </motion.div>
          )}

          {/* STEP B: ENTER OTP */}
          {step === "OTP" && (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Enter verification code.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  We sent a 6-digit access code to <strong className="text-white">{email}</strong>. Check your inbox or spam folder.
                </p>
              </div>

              {/* Live email dispatched indicator */}
              {liveDispatched && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verification code sent to <strong>{email}</strong>. Check your inbox and spam folder.</span>
                </div>
              )}

              {/* Dev/Sandbox Fallback helper if email service is not configured in Vercel */}
              {devCode && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Verification Code</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(devCode)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors flex items-center gap-1 shadow cursor-pointer active:scale-95"
                    >
                      <span>Auto-fill</span>
                      <span className="font-mono tracking-wider">{devCode}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {dispatchNotice ? (
                      <span>Email Delivery Notice: <strong className="text-amber-300">{dispatchNotice}</strong>. (Note: Free tier Resend accounts only deliver to the account owner’s email until a custom domain is added). Use the code above to sign in immediately.</span>
                    ) : (
                      <span>Notice: Outbound email service is in standalone mode. Use the code above to verify instantly.</span>
                    )}
                  </p>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="• • • • • •"
                  autoFocus
                  required
                  className="w-full tracking-[0.4em] text-center py-3.5 rounded-xl liquid-glass-input text-2xl font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl liquid-glass-btn-royal font-semibold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>{loading ? "Verifying..." : "Verify & Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("EMAIL");
                      setDevCode(null);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={loading || cooldown > 0}
                    className="text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-40 font-semibold cursor-pointer disabled:cursor-not-allowed"
                  >
                    {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP C: ASK NAME & MOBILE (NEW USERS) */}
          {step === "NAME_PHONE" && (
            <motion.div
              key="step-name-phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Welcome to PropDesk.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  Please provide your contact details so our advisory desk can coordinate verified valuation dossiers and site visits.
                </p>
              </div>

              <form onSubmit={handleSaveNamePhone} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Singhania"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl liquid-glass-input text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98200 00000"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl liquid-glass-input text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl liquid-glass-btn-royal font-semibold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>{loading ? "Saving..." : "Continue to Roles"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: SIX CATEGORIES USER ROLE SELECTION */}
          {step === "ROLES" && (
            <motion.div
              key="step-roles"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Who are you?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Select all that apply. You can hold multiple roles simultaneously.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {[
                  { id: "INDIVIDUAL_BUYER", label: "Individual Buyer", desc: "Private home or asset purchase" },
                  { id: "INVESTOR", label: "Investor", desc: "Yield capital & commercial growth" },
                  { id: "BUILDER", label: "Builder", desc: "Development land & Joint Ventures" },
                  { id: "BROKER", label: "Broker", desc: "Institutional mandates & client advisory" },
                  { id: "PROPERTY_OWNER", label: "Business Partner", desc: "Direct asset partner, owner or co-mandate" },
                  { id: "RENTAL_SEEKER", label: "Rental Seeker", desc: "Grade-A lease or luxury residence" },
                ].map((item) => {
                  const isSelected = selectedRoles.includes(item.id as UserRole);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleRole(item.id as UserRole)}
                      className={`p-3.5 rounded-2xl text-left transition-all duration-300 relative border ${
                        isSelected
                          ? "liquid-glass-btn-royal border-royal-400 text-white shadow-lg scale-[1.02]"
                          : "liquid-glass border-white/10 text-slate-300 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300/80 mt-1 line-clamp-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleRolesContinue}
                disabled={loading || selectedRoles.length === 0}
                className="w-full py-3.5 px-6 rounded-xl liquid-glass-btn-royal font-semibold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 5: INVENTORY TYPE SELECTION (FIRST STEP AFTER SIGN-IN/ROLES) */}
          {step === "INVENTORY_TYPE" && (
            <motion.div
              key="step-inventory-type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Select Property Portfolio
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Which listings would you like to explore?
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "BANK_NBFC",
                    label: "Bank / NBFC listed Properties",
                    icon: Landmark,
                  },
                  {
                    id: "NON_BANK_NBFC",
                    label: "Non Bank / NBFC Listed",
                    icon: Building2,
                  },
                  {
                    id: "BOTH",
                    label: "Both",
                    icon: Layers,
                  },
                ].map((item) => {
                  const isSelected = selectedInventoryType === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedInventoryType(item.id as "BANK_NBFC" | "NON_BANK_NBFC" | "BOTH")}
                      className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-center justify-between border ${
                        isSelected
                          ? "liquid-glass-btn-royal border-royal-400 text-white shadow-lg scale-[1.01]"
                          : "liquid-glass border-white/10 text-slate-300 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center shrink-0 border border-white/20">
                          <Icon className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold">{item.label}</span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Exclusive Builder Joint Venture Opportunity Option */}
              {selectedRoles.includes("BUILDER") && (
                <div
                  onClick={() => setIsJvOpportunity(!isJvOpportunity)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isJvOpportunity
                      ? "bg-emerald-950/40 border-emerald-500/50 text-white"
                      : "liquid-glass border-white/10 text-slate-300 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
                      <Lock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold">Joint Venture Proposals</span>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                          Builder Exclusive
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300/80">Include confidential revenue & area-sharing covenants</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${isJvOpportunity ? "bg-emerald-500 border-emerald-400 text-black" : "border-white/30"}`}>
                    {isJvOpportunity && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleInventoryContinue}
                className="w-full py-3.5 px-6 rounded-xl liquid-glass-btn-royal font-semibold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Continue to Categories</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 6: PROPERTY CATEGORY MULTI-SELECTION (NO PLACEHOLDER TEXT) */}
          {step === "CATEGORY" && (
            <motion.div
              key="step-category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  What are you looking for?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Select one or multiple property categories to discover.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {[
                  { id: "HOUSE", label: "House", icon: Home },
                  { id: "FLAT", label: "Flat / Apartment", icon: Building2 },
                  { id: "PLOT", label: "Vacant Plot / Land", icon: MapPin },
                  { id: "INDUSTRIAL_LAND", label: "Industrial Land", icon: Layers },
                  { id: "WAREHOUSE", label: "Warehouse", icon: Warehouse },
                  { id: "FACTORY", label: "Factory", icon: Factory },
                  { id: "BUILDING_WITH_LAND", label: "Building with Land", icon: Landmark },
                  { 
                    id: "DISPUTED", 
                    label: "Disputed Property", 
                    icon: AlertTriangle,
                    specialTag: "Maximum Discount Opportunities" 
                  },
                ].map((item) => {
                  const isSelected = selectedCategories.includes(item.id as PropertyCategory);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleCategory(item.id as PropertyCategory)}
                      className={`p-3.5 rounded-2xl text-left transition-all duration-300 border relative flex flex-col justify-between min-h-[72px] ${
                        isSelected
                          ? "liquid-glass-btn-royal border-royal-400 text-white shadow-lg scale-[1.01]"
                          : item.specialTag
                          ? "liquid-glass border-amber-500/40 text-amber-200 hover:border-amber-400"
                          : "liquid-glass border-white/10 text-slate-300 hover:border-white/30"
                      }`}
                    >
                      {item.specialTag && (
                        <div className="mb-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-400/40">
                            {item.specialTag}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" 
                              : "bg-white/5 text-slate-400 border border-white/10"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleCategoryContinue}
                disabled={selectedCategories.length === 0}
                className="w-full py-3.5 px-6 rounded-xl liquid-glass-btn-royal font-semibold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <span>Continue ({selectedCategories.length} selected)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 7: PROPERTY PURPOSE SELECTION */}
          {step === "PURPOSE" && (
            <motion.div
              key="step-purpose"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-claude-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  What is your purpose?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  We filter available inventory so you never see rental properties when looking to buy, or vice versa.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "BUY", label: "Buy", desc: "Outright purchase" },
                  { id: "RENT", label: "Rent", desc: "Lease tenure" },
                  { id: "BUY_OR_RENT", label: "Buy or Rent", desc: "Explore both" },
                ].map((item) => {
                  const isSelected = selectedPurpose === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPurpose(item.id as PropertyPurpose)}
                      className={`p-4 rounded-2xl text-center transition-all duration-300 border ${
                        isSelected
                          ? "liquid-glass-btn-royal border-royal-400 text-white shadow-lg scale-[1.02]"
                          : "liquid-glass border-white/10 text-slate-300 hover:border-white/30"
                      }`}
                    >
                      <h4 className="text-sm sm:text-base font-bold">{item.label}</h4>
                      <p className="text-[11px] text-slate-300/80 mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl liquid-glass-btn-royal font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>{loading ? "Preparing Discovery..." : "Start Exploring Properties →"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
