"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import Link from "next/link";
import { UserRoleType } from "@/types";
import { 
  User as UserIcon, 
  Layers, 
  Send, 
  FileText, 
  Plus, 
  Check, 
  Clock
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
        <div className="w-16 h-16 liquid-glass rounded-2xl flex items-center justify-center mx-auto text-[#706D67] border border-white/10">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="font-claude-serif text-2xl text-[#EDE8E1]">Sign In to Your Account</h2>
        <p className="text-xs sm:text-sm text-[#A39E96]">
          Access your multi-role preferences, inquiry tracking, and property submissions.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="py-2.5 px-5 liquid-glass-btn-accent text-white text-xs font-semibold rounded-xl shadow-md"
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
      <div className="liquid-glass-elevated rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl liquid-glass text-[#CC785C] font-claude-serif text-xl font-bold flex items-center justify-center border border-white/20">
            {user.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-claude-serif text-2xl font-semibold text-[#EDE8E1]">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider liquid-glass-pill text-[#CC785C] border-[#CC785C]/40">
                Active: {user.activeRole || "BUYER"}
              </span>
            </div>
            <div className="text-xs text-[#A39E96]">{user.email} • {user.phone || "No phone added"}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/submit-property"
            className="py-2 px-3.5 liquid-glass hover:border-white/30 text-[#EDE8E1] text-xs font-semibold rounded-xl"
          >
            Submit a Property
          </Link>
          {user.staffRoles && user.staffRoles.length > 0 && (
            <Link
              href="/admin"
              className="py-2 px-3.5 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 text-xs font-semibold rounded-xl"
            >
              Admin Console
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] text-xs font-semibold font-claude-sans">
        <button
          onClick={() => setActiveTab("ROLES")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "ROLES"
              ? "border-[#CC785C] text-[#EDE8E1]"
              : "border-transparent text-[#706D67] hover:text-[#A39E96]"
          }`}
        >
          <Layers className="w-4 h-4" />
          My Roles & Preferences ({user.roles.length})
        </button>
        <button
          onClick={() => setActiveTab("INQUIRIES")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "INQUIRIES"
              ? "border-[#CC785C] text-[#EDE8E1]"
              : "border-transparent text-[#706D67] hover:text-[#A39E96]"
          }`}
        >
          <Send className="w-4 h-4" />
          My Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("SUBMISSIONS")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "SUBMISSIONS"
              ? "border-[#CC785C] text-[#EDE8E1]"
              : "border-transparent text-[#706D67] hover:text-[#A39E96]"
          }`}
        >
          <FileText className="w-4 h-4" />
          Property Submissions ({submissions.length})
        </button>
      </div>

      {/* Tab 1: Roles Manager */}
      {activeTab === "ROLES" && (
        <div className="space-y-6">
          <div className="liquid-glass rounded-2xl p-5 text-xs text-[#A39E96] leading-relaxed border-white/[0.08]">
            <strong className="text-[#EDE8E1] block mb-0.5 font-claude-sans">Multi-Role Architecture:</strong>
            A single PropDesk account can carry multiple roles. Select an active role to customize your navigation and discovery view. Adding the <strong>Builder</strong> role grants access to confidential Joint Venture opportunities.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPossibleRoles.map((item) => {
              const isAssigned = user.roles.includes(item.role);
              const isActive = user.activeRole === item.role;

              return (
                <div
                  key={item.role}
                  className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                    isActive
                      ? "liquid-glass-elevated border-[#CC785C]/50 shadow-xl"
                      : isAssigned
                      ? "liquid-glass"
                      : "liquid-glass opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-claude-serif text-base font-semibold text-[#EDE8E1]">{item.label}</span>
                      {isActive && (
                        <span className="text-[10px] bg-[#CC785C] text-white px-2 py-0.5 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A39E96] leading-relaxed font-claude-sans">{item.desc}</p>
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] mt-4">
                    {isActive ? (
                      <div className="text-xs font-semibold text-[#CC785C] flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Currently Active View
                      </div>
                    ) : isAssigned ? (
                      <button
                        onClick={() => handleSetActiveRole(item.role)}
                        className="w-full py-2 liquid-glass-btn text-[#EDE8E1] text-xs font-semibold rounded-xl"
                      >
                        Switch to {item.role}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddRole(item.role)}
                        className="w-full py-2 liquid-glass-btn-accent text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
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
        <div className="space-y-3">
          {loadingHistory ? (
            <div className="p-12 text-center text-xs text-[#706D67]">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-20 liquid-glass rounded-3xl p-8 space-y-3">
              <h3 className="font-claude-serif text-xl text-[#EDE8E1]">No Inquiries Submitted Yet</h3>
              <p className="text-xs text-[#A39E96] max-w-sm mx-auto">
                When you click &quot;Get Pricing&quot; on any property, your inquiry status updates will appear here.
              </p>
              <Link
                href="/properties"
                className="inline-block mt-2 py-2 px-4 liquid-glass-btn text-[#EDE8E1] text-xs font-semibold rounded-xl"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            inquiries.map((inq) => (
              <div
                key={inq.id}
                className="liquid-glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#CC785C] liquid-glass-pill px-2 py-0.5 rounded">
                      {inq.publicReference}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full liquid-glass text-[#EDE8E1] uppercase">
                      {inq.status}
                    </span>
                  </div>
                  <div className="font-claude-serif text-base font-semibold text-[#EDE8E1]">
                    {inq.propertyTitle || inq.jvTitle || "General Advisory Inquiry"}
                  </div>
                  <p className="text-xs text-[#A39E96] line-clamp-1">{inq.message}</p>
                </div>

                <div className="text-xs text-[#706D67] shrink-0 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold block mt-0.5">
                    Advisory desk assigned
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Submissions History */}
      {activeTab === "SUBMISSIONS" && (
        <div className="space-y-3">
          {loadingHistory ? (
            <div className="p-12 text-center text-xs text-[#706D67]">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 liquid-glass rounded-3xl p-8 space-y-3">
              <h3 className="font-claude-serif text-xl text-[#EDE8E1]">No Property Submissions Yet</h3>
              <p className="text-xs text-[#A39E96] max-w-sm mx-auto">
                Are you a property owner or mandated broker? Submit your property for platform verification.
              </p>
              <Link
                href="/submit-property"
                className="inline-block mt-2 py-2 px-4 liquid-glass-btn text-[#EDE8E1] text-xs font-semibold rounded-xl"
              >
                Submit Property for Review
              </Link>
            </div>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="liquid-glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 uppercase">
                      Status: {sub.status}
                    </span>
                    <span className="text-xs text-[#706D67]">
                      {sub.category} ({sub.subtype})
                    </span>
                  </div>
                  <div className="font-claude-serif text-base font-semibold text-[#EDE8E1]">{sub.title}</div>
                  <div className="text-xs text-[#A39E96]">
                    {sub.locality}, {sub.city} • {sub.area} {sub.areaUnit}
                  </div>
                </div>

                <div className="text-xs text-[#706D67] shrink-0 text-right">
                  <div>{new Date(sub.createdAt).toLocaleDateString()}</div>
                  <span className="text-xs text-[#A39E96] block mt-0.5">
                    Intake record under review
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
