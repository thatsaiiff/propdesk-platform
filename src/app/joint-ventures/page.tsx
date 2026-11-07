"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { JointVentureOpportunity } from "@/types";
import { useAuth } from "@/context/AuthContext";
import InquiryModal from "@/components/inquiry/InquiryModal";
import AuthModal from "@/components/auth/AuthModal";
import { 
  Briefcase, 
  Lock, 
  ShieldAlert, 
  MapPin, 
  Maximize2, 
  Layers, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function JointVenturesPage() {
  const { user, addRole, switchActiveRole, quickLoginAs } = useAuth();
  const [opportunities, setOpportunities] = useState<JointVentureOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedJvForInquiry, setSelectedJvForInquiry] = useState<JointVentureOpportunity | undefined>();

  const isBuilder = user?.roles?.includes("BUILDER") || (user?.staffRoles && user.staffRoles.length > 0);

  useEffect(() => {
    async function fetchJVs() {
      setLoading(true);
      try {
        const res = await fetch("/api/joint-ventures");
        if (res.status === 403) {
          setForbidden(true);
          setOpportunities([]);
          return;
        }

        const data = await res.json();
        if (data.success && data.data) {
          setOpportunities(data.data);
          setForbidden(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJVs();
  }, [user]);

  const handleClaimBuilderRole = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    await addRole("BUILDER");
    await switchActiveRole("BUILDER");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            Exclusive Builder & Developer Division
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Joint-Venture & Development Mandates
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Curated landholdings and development collaborations with verified landowners across top Indian metropolitan zones. Accessible strictly to certified developers and builders.
          </p>
        </div>
      </div>

      {/* Access Gate Condition */}
      {!isBuilder || forbidden ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              Builder Role Authorization Required
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Joint Venture opportunities and large development land parcels are strictly protected server-side and visible only to verified builder/developer entities to maintain landowner privacy.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 text-left space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <Sparkles className="w-4 h-4 text-brand-600" />
              For Testing & Reviewers:
            </div>
            <p className="text-[11px] text-slate-500">
              You can instantly simulate a Builder session using the buttons below:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => quickLoginAs("builder@apexinfra.demo")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm"
              >
                Switch to Demo Builder (Vikram Sharma)
              </button>
              {user && !user.roles.includes("BUILDER") && (
                <button
                  onClick={handleClaimBuilderRole}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs"
                >
                  Add Builder Role to My Account
                </button>
              )}
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {opportunities.length} Active Joint Venture Mandates
            </span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Server-Side Builder Authenticated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {opportunities.map((jv) => (
              <div
                key={jv.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-slate-900">
                    <Image
                      src={jv.media?.[0]?.url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
                      alt={jv.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                        {jv.collaborationType.replace("_", " ")}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{jv.location}, {jv.city}</span>
                      </div>
                      <h3 className="font-extrabold text-lg mt-1">{jv.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Land Area Spec */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900">
                          {jv.landArea} {jv.areaUnit}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900">
                          Clear Freehold Title
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {jv.description}
                    </p>

                    {/* Builder Requirements list */}
                    {jv.requirements && jv.requirements.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Developer Requirements & Structure:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {jv.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-500">
                    Direct landowner representation by PropDesk Advisory
                  </div>
                  <button
                    onClick={() => setSelectedJvForInquiry(jv)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal / Inquire</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JV Inquiry Modal */}
      {selectedJvForInquiry && (
        <InquiryModal
          isOpen={!!selectedJvForInquiry}
          onClose={() => setSelectedJvForInquiry(undefined)}
          jvOpportunity={selectedJvForInquiry}
        />
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
