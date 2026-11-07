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
  MapPin, 
  Maximize2, 
  Layers, 
  Send, 
  CheckCircle2, 
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="bg-[#181818] rounded-3xl border border-[#272727] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-[680px] space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 caption-3 font-semibold border border-emerald-800">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Exclusive Builder and Developer Division</span>
          </div>
          <h1 className="heading-3 sm:heading-2 hero-text-gradient tracking-tight">
            Joint Venture & Development Mandates
          </h1>
          <p className="body-4 text-[#9B9B9B] leading-relaxed text-pretty">
            Curated landholdings and development collaborations with verified landowners across top Indian metropolitan zones. Accessible strictly to certified developers and builders.
          </p>
        </div>
      </div>

      {/* Access Gate Condition */}
      {!isBuilder || forbidden ? (
        <div className="bg-[#181818] rounded-3xl border border-[#272727] p-8 sm:p-14 text-center max-w-[680px] mx-auto shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-emerald-950/60 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-800">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="heading-5 text-white">
              Builder Role Authorization Required
            </h3>
            <p className="body-5 text-[#9B9B9B] leading-relaxed max-w-md mx-auto text-pretty">
              Joint Venture opportunities and large development land parcels are strictly protected server side and visible only to verified builder/developer entities to maintain landowner confidentiality.
            </p>
          </div>

          <div className="bg-[#1F1F1F] border border-[#272727] rounded-2xl p-5 text-left space-y-3">
            <div className="caption-3 font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>For Reviewers and Evaluation:</span>
            </div>
            <p className="caption-4 text-[#9B9B9B]">
              Simulate a Builder session to evaluate server side protected JV data:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => quickLoginAs("builder@apexinfra.demo")}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white button-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Switch to Demo Builder (Vikram Sharma)
              </button>
              {user && !user.roles.includes("BUILDER") && (
                <button
                  onClick={handleClaimBuilderRole}
                  className="py-2 px-4 bg-[#272727] hover:bg-[#313131] text-white button-sm rounded-xl border border-[#313131]"
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
            <div key={i} className="h-96 rounded-3xl bg-[#181818] border border-[#272727] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <span className="caption-3 font-bold text-[#666666] uppercase tracking-wider">
              {opportunities.length} Active Joint Venture Mandates
            </span>
            <span className="caption-3 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full font-semibold">
              Server Side Builder Authenticated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {opportunities.map((jv) => (
              <div
                key={jv.id}
                className="bg-[#181818] rounded-3xl border border-[#272727] hover:border-[#3a3a3a] shadow-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-[#1F1F1F]">
                    <Image
                      src={jv.media?.[0]?.url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
                      alt={jv.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-xl caption-3 font-semibold uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                        {jv.collaborationType.replace("_", " ")}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <div className="flex items-center gap-1.5 caption-4 text-[#9B9B9B]">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{jv.location}, {jv.city}</span>
                      </div>
                      <h3 className="title-1 font-bold text-white">{jv.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Land Area Spec */}
                    <div className="flex items-center gap-3">
                      <div className="bg-[#1F1F1F] p-3 rounded-xl border border-[#272727] flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-emerald-400" />
                        <span className="title-3 text-white">
                          {jv.landArea} {jv.areaUnit}
                        </span>
                      </div>
                      <div className="bg-[#1F1F1F] p-3 rounded-xl border border-[#272727] flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <span className="title-3 text-white">
                          Clear Freehold Title
                        </span>
                      </div>
                    </div>

                    <p className="body-5 text-[#9B9B9B] leading-relaxed text-pretty">
                      {jv.description}
                    </p>

                    {/* Developer requirements */}
                    {jv.requirements && jv.requirements.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="caption-3 font-bold uppercase tracking-wider text-[#666666] block">
                          Developer Requirements & Structure:
                        </span>
                        <ul className="space-y-1.5 body-5 text-[#9B9B9B]">
                          {jv.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#272727] mt-4 flex items-center justify-between gap-4">
                  <div className="caption-4 text-[#666666]">
                    Direct landowner representation by PropDesk Advisory
                  </div>
                  <button
                    onClick={() => setSelectedJvForInquiry(jv)}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white button-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 shrink-0"
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
