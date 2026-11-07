"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { JointVentureOpportunity } from "@/types";
import { useAuth } from "@/context/AuthContext";
import InquiryModal from "@/components/inquiry/InquiryModal";
import { 
  Briefcase, 
  MapPin, 
  Maximize2, 
  Layers, 
  Send, 
  CheckCircle2, 
  Lock, 
  ArrowLeft 
} from "lucide-react";

export default function JVOpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user, quickLoginAs } = useAuth();
  const [jv, setJv] = useState<JointVentureOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  useEffect(() => {
    async function fetchJVDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/joint-ventures/${slug}`);
        if (res.status === 403) {
          setForbidden(true);
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          setJv(data.data);
          setForbidden(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchJVDetail();
  }, [slug, user]);

  if (forbidden) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-950/80 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-800">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="heading-4 text-white">Builder Access Required</h2>
          <p className="body-5 text-[#9B9B9B] leading-relaxed max-w-sm mx-auto">
            This joint venture land development opportunity is strictly restricted to verified builder and developer accounts.
          </p>
        </div>
        <button
          onClick={() => quickLoginAs("builder@apexinfra.demo")}
          className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white button-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          Sign In as Verified Builder (Vikram Sharma)
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 w-48 bg-[#181818] rounded-xl animate-pulse" />
        <div className="h-96 w-full bg-[#181818] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!jv) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="heading-4 text-white">JV Opportunity Not Found</h2>
        <Link href="/joint-ventures" className="button-sm text-blue-400">
          &larr; Back to Joint Ventures
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link href="/joint-ventures" className="caption-3 text-[#9B9B9B] hover:text-white flex items-center gap-1.5 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to JV Opportunities
      </Link>

      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-[#181818] border border-[#272727] shadow-2xl">
        <Image
          src={jv.media?.[0]?.url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
          alt={jv.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
          <span className="px-3 py-1 rounded-xl caption-3 font-semibold uppercase tracking-wider bg-emerald-600 text-white">
            {jv.collaborationType.replace("_", " ")}
          </span>
          <h1 className="heading-3 sm:heading-2 font-bold">{jv.title}</h1>
          <div className="flex items-center gap-1.5 caption-4 text-[#9B9B9B]">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{jv.location}, {jv.city}, {jv.state}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#181818] rounded-3xl border border-[#272727] p-8 shadow-xl space-y-4">
            <h3 className="title-2 text-white">Project Overview</h3>
            <p className="body-5 text-[#9B9B9B] leading-relaxed whitespace-pre-line text-pretty">
              {jv.description}
            </p>
          </div>

          <div className="bg-[#181818] rounded-3xl border border-[#272727] p-8 shadow-xl space-y-4">
            <h3 className="title-2 text-white">Developer Eligibility and Structure</h3>
            <ul className="space-y-2.5 body-5 text-[#9B9B9B]">
              {jv.requirements?.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#181818] rounded-3xl border border-[#272727] p-6 shadow-xl space-y-4 sticky top-24">
            <div className="space-y-1">
              <span className="caption-4 font-bold text-[#666666] uppercase">Landholding Area</span>
              <div className="heading-4 font-bold text-white">
                {jv.landArea} {jv.areaUnit}
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-900/60 rounded-xl caption-3 text-emerald-300">
              Direct Landowner Mandate curated by PropDesk Advisory.
            </div>

            <button
              onClick={() => setInquiryModalOpen(true)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white button-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit JV Proposal</span>
            </button>
          </div>
        </div>
      </div>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        jvOpportunity={jv}
      />
    </div>
  );
}
