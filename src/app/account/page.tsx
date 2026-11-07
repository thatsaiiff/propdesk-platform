"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import Link from "next/link";
import { UserRoleType } from "@/types";
import { 
  User as UserIcon, 
  ShieldCheck, 
  Layers, 
  Send, 
  FileText, 
  Plus, 
  Check, 
  Clock, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function AccountPage() {
  const { user, switchActiveRole, addRole } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ROLES" | "INQUIRIES" | "SUBMISSIONS">("ROLES");

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function loadUserData() {
      setLoadingHistory(true);
      try {
        const inqRes = await fetch("/api/me/inquiries");
        const inqData = await inqRes.json();
        if (inqData.success) {
          setInquiries(inqData.inquiries || []);
        }

        const subRes = await fetch("/api/me/property-submissions");
        const subData = await subRes.json();
        if (subData.success) {
          setSubmissions(subData.submissions || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign In to Your Account</h2>
        <p className="text-xs text-slate-500">
          Access your multi-role preferences, inquiry tracking, and property submissions.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md"
        >
          Sign In with Email OTP
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const allPossibleRoles: { role: UserRoleType; label: string; desc: string }[] = [
    { role: "BUYER", label: "Individual Buyer", desc: "Browse and inquire on luxury residential and commercial properties." },
    { role: "TENANT", label: "Rental Seeker / Tenant", desc: "Discover prime residential and corporate rental spaces." },
    { role: "INVESTOR", label: "Real Estate Investor", desc: "Explore high-yield commercial assets and land growth corridors." },
    { role: "OWNER", label: "Property Owner / Seller", desc: "Submit properties for admin review and mandate curation." },
    { role: "BROKER", label: "Mandated Broker / Dealer", desc: "Represent client mandates and coordinate with our listing desk." },
    { role: "BUILDER", label: "Builder / Developer", desc: "Exclusive access to Joint Venture opportunities and land parcels." },
  ];

  const handleAddRole = async (r: UserRoleType) => {
    await addRole(r);
  };

  const handleSetActiveRole = async (r: UserRoleType) => {
    await switchActiveRole(r);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-900 to-brand-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                Active: {user.activeRole || "BUYER"}
              </span>
            </div>
            <div className="text-xs text-slate-500">{user.email} • {user.phone || "No phone added"}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/submit-property"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
          >
            Submit a Property
          </Link>
          {user.staffRoles && user.staffRoles.length > 0 && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl"
            >
              Admin Console
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab("ROLES")}
          className={`py-3 px-4 border-b-2 transition-smooth flex items-center gap-1.5 ${
            activeTab === "ROLES"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          My Roles & Preferences ({user.roles.length})
        </button>
        <button
          onClick={() => setActiveTab("INQUIRIES")}
          className={`py-3 px-4 border-b-2 transition-smooth flex items-center gap-1.5 ${
            activeTab === "INQUIRIES"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Send className="w-4 h-4" />
          My Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("SUBMISSIONS")}
          className={`py-3 px-4 border-b-2 transition-smooth flex items-center gap-1.5 ${
            activeTab === "SUBMISSIONS"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          Property Submissions ({submissions.length})
        </button>
      </div>

      {/* Tab 1: Roles Manager */}
      {activeTab === "ROLES" && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 block mb-0.5">Multi-Role Architecture:</strong>
            A single PropDesk account can carry multiple roles (e.g. you can be a Buyer, Investor, and Owner at the same time). Select an active role to customize your navigation and discovery experience. Adding the <strong>Builder</strong> role grants access to our confidential Joint Venture opportunities.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPossibleRoles.map((item) => {
              const isAssigned = user.roles.includes(item.role);
              const isActive = user.activeRole === item.role;

              return (
                <div
                  key={item.role}
                  className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                    isActive
                      ? "bg-brand-50/50 border-brand-500 shadow-md ring-1 ring-brand-500"
                      : isAssigned
                      ? "bg-white border-slate-300 shadow-sm"
                      : "bg-white border-slate-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{item.label}</span>
                      {isActive && (
                        <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full font-bold">
                          ACTIVE ROLE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-4">
                    {isActive ? (
                      <div className="text-xs font-semibold text-brand-700 flex items-center gap-1">
                        <Check className="w-4 h-4 text-brand-600" />
                        Currently Active View
                      </div>
                    ) : isAssigned ? (
                      <button
                        onClick={() => handleSetActiveRole(item.role)}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                      >
                        Switch to {item.role}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddRole(item.role)}
                        className="w-full py-2 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Role to Account
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Inquiries History */}
      {activeTab === "INQUIRIES" && (
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">No Inquiries Submitted Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When you click &quot;Get Price&quot; on any property, your inquiry and pricing updates will appear here.
              </p>
              <Link
                href="/properties"
                className="inline-block mt-3 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                        {inq.publicReference}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        inq.status === "ASSIGNED"
                          ? "bg-blue-100 text-blue-800"
                          : inq.status === "CONTACTED"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      {inq.propertyTitle || inq.jvTitle || "General Advisory Inquiry"}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{inq.message}</p>
                  </div>

                  <div className="text-xs text-slate-400 shrink-0 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                      Advisory desk assigned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Submissions History */}
      {activeTab === "SUBMISSIONS" && (
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">No Property Submissions Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Are you a property owner or mandated broker? Submit your property for platform verification.
              </p>
              <Link
                href="/submit-property"
                className="inline-block mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Submit Property for Review
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                        Status: {sub.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {sub.category} ({sub.subtype})
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">{sub.title}</div>
                    <div className="text-xs text-slate-500">
                      {sub.locality}, {sub.city} • {sub.area} {sub.areaUnit}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 shrink-0 text-right">
                    <div>{new Date(sub.createdAt).toLocaleDateString()}</div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Intake record under review
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
