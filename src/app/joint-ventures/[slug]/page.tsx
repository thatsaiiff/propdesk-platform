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
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Builder Access Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            This joint venture land development opportunity is strictly restricted to verified builder and developer accounts.
          </p>
        </div>
        <button
          onClick={() => quickLoginAs("builder@apexinfra.demo")}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md"
        >
          Sign In as Verified Builder (Vikram Sharma)
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-96 w-full bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!jv) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">JV Opportunity Not Found</h2>
        <Link href="/joint-ventures" className="text-xs text-brand-600 font-bold">
          &larr; Back to Joint Ventures
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link href="/joint-ventures" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to JV Opportunities
      </Link>

      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900">
        <Image
          src={jv.media?.[0]?.url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
          alt={jv.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white">
            {jv.collaborationType.replace("_", " ")}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold">{jv.title}</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{jv.location}, {jv.city}, {jv.state}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Project Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {jv.description}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Developer Eligibility & Terms</h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {jv.requirements?.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 sticky top-24">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Landholding Area</span>
              <div className="text-2xl font-extrabold text-slate-900">
                {jv.landArea} {jv.areaUnit}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900">
              Direct Landowner Mandate curated by PropDesk Advisory.
            </div>

            <button
              onClick={() => setInquiryModalOpen(true)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
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
