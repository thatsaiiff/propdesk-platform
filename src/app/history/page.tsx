"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PublicPropertyDTO, PropertyActivity, UserRole } from "@/types";
import { 
  ArrowLeft, 
  Heart, 
  Zap, 
  Clock, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Maximize2, 
  User as UserIcon,
  CheckCircle2
} from "lucide-react";

interface ActivityItem {
  activity: PropertyActivity;
  property: PublicPropertyDTO;
}

interface ActivityResponse {
  interested: ActivityItem[];
  contactRequests: ActivityItem[];
  skipped: ActivityItem[];
  recentlyViewed: ActivityItem[];
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, updateOnboarding, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<"interested" | "contactRequests" | "recentlyViewed" | "skipped" | "profile">("interested");
  const [activity, setActivity] = useState<ActivityResponse>({
    interested: [],
    contactRequests: [],
    skipped: [],
    recentlyViewed: [],
  });
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Profile Edit State
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(user?.roles || []);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user?.roles) {
      setSelectedRoles(user.roles);
    }
  }, [user]);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me/activity");
      const data = await res.json();
      if (data.success && data.activity) {
        setActivity(data.activity);
      }
    } catch (err) {
      console.error("Failed to load user activity", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchActivity();
    }
  }, [user]);

  const handleResetCycle = async () => {
    setResetting(true);
    try {
      await fetch("/api/me/reset-cycle", { method: "POST" });
      await fetchActivity();
      setStatusMessage("Discovery cycle reset! You can now reconsider previously skipped properties.");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      console.error("Failed to reset cycle");
    } finally {
      setResetting(false);
    }
  };

  const handleSaveRoles = async () => {
    if (selectedRoles.length === 0) return;
    setSavingProfile(true);
    const res = await updateOnboarding({ roles: selectedRoles });
    setSavingProfile(false);
    if (res.success) {
      setStatusMessage("Roles updated successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const toggleRole = (r: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(r) ? prev.filter((item) => item !== r) : [...prev, r]
    );
  };

  const currentList = 
    activeTab === "interested" ? activity.interested :
    activeTab === "contactRequests" ? activity.contactRequests :
    activeTab === "skipped" ? activity.skipped :
    activeTab === "recentlyViewed" ? activity.recentlyViewed : [];

  return (
    <div className="min-h-screen bg-[#060911] text-white">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#060911]/90 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/discover"
            className="p-2 rounded-xl liquid-glass text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-claude-serif text-lg sm:text-xl font-bold text-white tracking-tight">
              My Property Activity & History
            </h1>
            <p className="text-xs text-slate-400">
              {user ? `${user.name || user.email} • ${user.roles.join(", ")}` : "Guest"}
            </p>
          </div>
        </div>

        <Link
          href="/discover"
          className="py-2 px-4 rounded-xl liquid-glass-btn-royal text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          Resume Swiping &rarr;
        </Link>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {statusMessage && (
          <div className="p-4 rounded-2xl liquid-glass bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("interested")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "interested"
                ? "liquid-glass-btn-royal text-white shadow-lg border-amber-400/40"
                : "liquid-glass text-slate-400 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Interested ({activity.interested.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("contactRequests")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "contactRequests"
                ? "liquid-glass-btn-royal text-white shadow-lg border-amber-400/40"
                : "liquid-glass text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Contact Requests ({activity.contactRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("recentlyViewed")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "recentlyViewed"
                ? "liquid-glass-btn-royal text-white shadow-lg border-amber-400/40"
                : "liquid-glass text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Recently Viewed ({activity.recentlyViewed.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("skipped")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "skipped"
                ? "liquid-glass-btn-royal text-white shadow-lg border-amber-400/40"
                : "liquid-glass text-slate-400 hover:text-white"
            }`}
          >
            <X className="w-4 h-4 text-red-400" />
            <span>Skipped ({activity.skipped.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 ml-auto transition-all ${
              activeTab === "profile"
                ? "liquid-glass-btn-royal text-white shadow-lg border-amber-400/40"
                : "liquid-glass text-slate-400 hover:text-white"
            }`}
          >
            <UserIcon className="w-4 h-4 text-slate-300" />
            <span>Profile & Roles</span>
          </button>
        </div>

        {/* Tab 1-4: Properties Activity Grid */}
        {activeTab !== "profile" && (
          <div className="space-y-6">
            {activeTab === "skipped" && activity.skipped.length > 0 && (
              <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Reconsider Skipped Properties</h4>
                  <p className="text-xs text-slate-400">
                    Resetting makes these properties reappear in your discovery feed.
                  </p>
                </div>
                <button
                  onClick={handleResetCycle}
                  disabled={resetting}
                  className="py-2 px-4 rounded-xl liquid-glass-btn-royal font-bold text-xs text-white shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>{resetting ? "Resetting..." : "Reset Skipped List"}</span>
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-3xl liquid-glass animate-pulse" />
                ))}
              </div>
            ) : currentList.length === 0 ? (
              <div className="py-20 text-center liquid-glass rounded-3xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center mx-auto text-slate-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-claude-serif text-xl font-bold text-white">No properties recorded in this category yet.</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Start discovering properties using the Tinder swipe experience to populate your activity list.
                </p>
                <Link
                  href="/discover"
                  className="inline-block py-2.5 px-6 rounded-xl liquid-glass-btn-royal text-xs font-bold shadow-lg"
                >
                  Explore Discovery Feed
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentList.map(({ activity: act, property: prop }) => (
                  <div
                    key={act.id}
                    className="liquid-glass-elevated rounded-3xl overflow-hidden flex flex-col justify-between border border-white/15 shadow-xl hover:border-amber-400/40 transition-all group"
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                        <Image
                          src={prop.images[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                          alt={prop.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                          {act.isContactRequested && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                              Priority Contact
                            </span>
                          )}
                          {act.action === "INTERESTED" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                              Interested
                            </span>
                          )}
                          {act.action === "SKIPPED" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-600/80 text-white shadow-md">
                              Skipped
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span className="truncate">{prop.locality}, {prop.city}</span>
                        </div>
                        <h4 className="font-claude-serif text-base font-bold text-white line-clamp-1">
                          {prop.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <div className="flex items-center gap-1 font-semibold">
                            <Maximize2 className="w-3 h-3 text-amber-400" />
                            <span>{prop.area.toLocaleString()} {prop.areaUnit}</span>
                          </div>
                          <span>•</span>
                          <span className="text-[10px] uppercase font-bold text-royal-400">{prop.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Activity Record */}
                    <div className="p-4 pt-0 text-[10px] text-slate-400 border-t border-white/10 flex items-center justify-between">
                      <span>Viewed {act.viewCount} times</span>
                      <span>{new Date(act.lastViewedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Profile & Roles Update */}
        {activeTab === "profile" && (
          <div className="max-w-2xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl">
            <div>
              <h3 className="font-claude-serif text-2xl font-bold text-white">Your Roles & Profile</h3>
              <p className="text-xs text-slate-300 mt-1">
                You can hold multiple roles simultaneously. Select all that fit your real estate activity.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "INDIVIDUAL_BUYER", label: "Individual Buyer" },
                  { id: "INVESTOR", label: "Investor" },
                  { id: "BUILDER", label: "Builder" },
                  { id: "BROKER", label: "Broker" },
                  { id: "PROPERTY_OWNER", label: "Business Partner" },
                  { id: "RENTAL_SEEKER", label: "Rental Seeker" },
                ].map((item) => {
                  const isChecked = selectedRoles.includes(item.id as UserRole);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleRole(item.id as UserRole)}
                      className={`p-3.5 rounded-xl text-left transition-all border ${
                        isChecked
                          ? "liquid-glass-btn-royal border-amber-400/50 text-white font-bold shadow-lg"
                          : "liquid-glass border-white/10 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm">{item.label}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => signOut()}
                  className="py-2.5 px-4 rounded-xl liquid-glass text-red-400 text-xs font-semibold hover:bg-red-500/10"
                >
                  Sign Out of Account
                </button>
                <button
                  onClick={handleSaveRoles}
                  disabled={savingProfile || selectedRoles.length === 0}
                  className="py-2.5 px-6 rounded-xl liquid-glass-btn-royal text-xs font-bold text-white shadow-lg"
                >
                  {savingProfile ? "Saving..." : "Save Role Updates"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
