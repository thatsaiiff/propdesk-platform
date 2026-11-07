"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Property, 
  User, 
  Lead, 
  LeadStatus, 
  PropertySubmission, 
  PlatformConfig,
  PropertyCategory
} from "@/types";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  Plus, 
  Eye, 
  Edit, 
  Check, 
  X, 
  Search, 
  Settings, 
  FileText, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Zap, 
  ArrowLeft,
  Sparkles,
  Layers,
  Trash2,
  KeyRound,
  Pencil
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, requestOtp, verifyOtp, refreshUser, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "leads" | "users" | "submissions" | "settings">("overview");

  // Overview stats & config
  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState<PlatformConfig | null>(null);

  // Lists
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([]);

  // Selected User Modal / Detail
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);

  // New Property Modal
  const [newPropertyModal, setNewPropertyModal] = useState(false);
  const [newProp, setNewProp] = useState<any>({
    title: "",
    description: "",
    category: "FLAT",
    inventoryType: "NON_BANK_NBFC",
    isJointVenture: false,
    isDisputed: false,
    purposeAvailability: "SALE",
    state: "Maharashtra",
    city: "Mumbai",
    locality: "Bandra West",
    area: 2500,
    areaUnit: "sq.ft.",
    demarcation: "North: 60ft Road, South: Park, East: Building 12, West: Avenue",
    status: "PUBLISHED",
    internalAskingPrice: 150000000,
    internalOwnershipDetails: "Direct owner mandate verified in desk custody.",
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85", label: "Front Facade", sortOrder: 1 },
      { id: "img-2", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85", label: "Master Suite", sortOrder: 2 },
    ],
  });

  // Settings State
  const [pricePromiseInput, setPricePromiseInput] = useState("");
  const [adminEmailInput, setAdminEmailInput] = useState("");

  // Edit Property Modal
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Admin Auth States
  const [adminEmail, setAdminEmail] = useState("admin@propdesk.demo");
  const [adminOtp, setAdminOtp] = useState("");
  const [adminOtpSent, setAdminOtpSent] = useState(false);
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const isAdmin = user?.staffRoles && user.staffRoles.length > 0;

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, propsRes, leadsRes, usersRes, subsRes] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/admin/properties"),
        fetch("/api/admin/leads"),
        fetch("/api/admin/users"),
        fetch("/api/admin/submissions"),
      ]);

      const [ovData, propsData, leadsData, usersData, subsData] = await Promise.all([
        overviewRes.json(),
        propsRes.json(),
        leadsRes.json(),
        usersRes.json(),
        subsRes.json(),
      ]);

      if (ovData.success) {
        setStats(ovData.stats);
        setConfig(ovData.config);
        setPricePromiseInput(ovData.config.pricePromiseText);
        setAdminEmailInput(ovData.config.adminNotificationEmail);
      }
      if (propsData.success) setProperties(propsData.properties);
      if (leadsData.success) setLeads(leadsData.leads);
      if (usersData.success) setUsersList(usersData.users);
      if (subsData.success) setSubmissions(subsData.submissions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProp),
      });
      const data = await res.json();
      if (data.success) {
        showNotice("Property created and published successfully!");
        setNewPropertyModal(false);
        loadAllAdminData();
      } else {
        alert(data.error || "Failed to create property");
      }
    } catch {
      alert("Network error creating property");
    }
  };

  const handleTogglePropertyStatus = async (prop: Property) => {
    const nextStatus = prop.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch("/api/admin/properties", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prop.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Property status updated to ${nextStatus}.`);
        loadAllAdminData();
      }
    } catch {
      alert("Error updating status");
    }
  };

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    try {
      const res = await fetch("/api/admin/properties", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProperty),
      });
      const data = await res.json();
      if (data.success) {
        showNotice("Property updated successfully!");
        setEditingProperty(null);
        loadAllAdminData();
      } else {
        alert(data.error || "Failed to update property");
      }
    } catch {
      alert("Error saving property changes");
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to permanently delete this property listing?")) return;
    try {
      const res = await fetch(`/api/admin/properties?id=${propertyId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showNotice("Property deleted successfully.");
        loadAllAdminData();
      } else {
        alert(data.error || "Failed to delete property");
      }
    } catch {
      alert("Error deleting property");
    }
  };

  const handleAdminRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminEmail.includes("@")) {
      setAdminAuthError("Please enter a valid administrator email.");
      return;
    }
    setAdminAuthLoading(true);
    setAdminAuthError(null);
    const res = await requestOtp(adminEmail);
    setAdminAuthLoading(false);
    if (res.success) {
      setAdminOtpSent(true);
    } else {
      setAdminAuthError(res.error || "Failed to send verification code.");
    }
  };

  const handleAdminVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminOtp || adminOtp.length < 4) {
      setAdminAuthError("Please enter the verification code sent to your email.");
      return;
    }
    setAdminAuthLoading(true);
    setAdminAuthError(null);
    const res = await verifyOtp(adminEmail, adminOtp);
    setAdminAuthLoading(false);
    if (res.success) {
      await refreshUser();
    } else {
      setAdminAuthError(res.error || "Invalid verification code.");
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, nextStatus: LeadStatus) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Lead status updated to ${nextStatus}.`);
        loadAllAdminData();
      }
    } catch {
      alert("Error updating lead");
    }
  };

  const handleReviewSubmission = async (subId: string, decision: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: subId, status: decision }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(data.message || "Submission reviewed successfully!");
        loadAllAdminData();
      }
    } catch {
      alert("Error reviewing submission");
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pricePromiseText: pricePromiseInput,
          adminNotificationEmail: adminEmailInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice("Platform configuration updated successfully!");
        loadAllAdminData();
      }
    } catch {
      alert("Error saving settings");
    }
  };

  const handleInspectUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedUserDetail(data);
      }
    } catch {
      alert("Failed to load user details");
    }
  };

  // If not logged in as Admin, show authentic Admin Login portal
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#060911] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="max-w-md w-full liquid-glass-elevated rounded-3xl p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl relative z-10">
          <div className="w-14 h-14 rounded-2xl liquid-glass bg-purple-900/30 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/40">
            <Lock className="w-7 h-7" />
          </div>
          
          <div className="text-center space-y-1">
            <h2 className="font-claude-serif text-2xl font-bold text-white">Administrator Portal</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sign in with your authorized administrator email address to access inventory governance and lead pipelines.
            </p>
          </div>

          {user && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 text-center space-y-2">
              <p>You are signed in as <strong>{user.email}</strong>, which does not have staff administrator privileges.</p>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-amber-400 hover:underline font-bold"
              >
                Sign out to switch account &rarr;
              </button>
            </div>
          )}

          {adminAuthError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
              {adminAuthError}
            </div>
          )}

          {!adminOtpSent ? (
            <form onSubmit={handleAdminRequestOtp} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@propdesk.demo"
                  required
                  className="w-full py-3 px-4 rounded-xl liquid-glass-input text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={adminAuthLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {adminAuthLoading ? "Sending Verification Code..." : "Send Verification Code →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminVerifyOtp} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={adminOtp}
                  onChange={(e) => setAdminOtp(e.target.value)}
                  placeholder="• • • • • •"
                  autoFocus
                  required
                  className="w-full tracking-[0.4em] text-center py-3.5 rounded-xl liquid-glass-input text-2xl font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                  Verification code dispatched to <strong>{adminEmail}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={adminAuthLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {adminAuthLoading ? "Verifying..." : "Verify & Unlock Admin Panel →"}
              </button>

              <button
                type="button"
                onClick={() => setAdminOtpSent(false)}
                className="block text-center text-xs text-slate-400 hover:text-white w-full pt-1"
              >
                Change admin email
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-white/10 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              &larr; Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060911] text-white">
      {/* Admin Top Header */}
      <header className="px-6 sm:px-10 py-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#060911]/95 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl liquid-glass text-slate-400 hover:text-white transition-all"
            title="Return to site"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-9 h-9 rounded-xl liquid-glass bg-purple-950 text-purple-400 flex items-center justify-center font-bold border border-purple-500/40">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-claude-serif text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              PropDesk Central Command
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-bold">
                ADMIN
              </span>
            </h1>
            <p className="text-xs text-slate-400">Underwriting, Lead Tracking & Inventory Governance</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewPropertyModal(true)}
            className="py-2 px-4 rounded-xl liquid-glass-btn-royal font-bold text-xs text-white shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
          <Link
            href="/discover"
            className="py-2 px-3 rounded-xl liquid-glass text-xs font-semibold text-slate-300 hover:text-white"
          >
            Test Swipe Feed
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {notice && (
          <div className="p-4 rounded-2xl liquid-glass bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          {[
            { id: "overview", label: "A. Overview", icon: TrendingUp },
            { id: "properties", label: "B. Properties", icon: Building2 },
            { id: "leads", label: "C. Leads Pipeline", icon: Zap },
            { id: "users", label: "D. Users & Activity", icon: Users },
            { id: "submissions", label: "E. Submissions", icon: FileText },
            { id: "settings", label: "F. Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? "liquid-glass-btn-royal text-white shadow-lg border-amber-400/40"
                    : "liquid-glass text-slate-400 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="liquid-glass-elevated rounded-3xl p-6 space-y-2 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Registered</span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white">{stats.totalUsers}</div>
                <span className="text-xs text-slate-400">All registered users</span>
              </div>

              <div className="liquid-glass-elevated rounded-3xl p-6 space-y-2 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Inventory</span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-royal-400">{stats.activeProperties}</div>
                <span className="text-xs text-slate-400">Published in discovery</span>
              </div>

              <div className="liquid-glass-elevated rounded-3xl p-6 space-y-2 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Interested Swipes</span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400">{stats.interestedSwipes}</div>
                <span className="text-xs text-slate-400">Right swipe signals</span>
              </div>

              <div className="liquid-glass-elevated rounded-3xl p-6 space-y-2 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact Requests</span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-400">{stats.contactRequests}</div>
                <span className="text-xs text-slate-400">Priority CTA clicks</span>
              </div>
            </div>

            {/* Six Role Breakdown Cards */}
            <div className="space-y-4">
              <h3 className="font-claude-serif text-xl font-bold text-white">Six-Role Distribution Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "Buyers", count: stats.roleCounts.buyers, color: "text-blue-400" },
                  { label: "Investors", count: stats.roleCounts.investors, color: "text-emerald-400" },
                  { label: "Builders", count: stats.roleCounts.builders, color: "text-purple-400" },
                  { label: "Brokers", count: stats.roleCounts.brokers, color: "text-amber-400" },
                  { label: "Owners", count: stats.roleCounts.owners, color: "text-rose-400" },
                  { label: "Rental Seekers", count: stats.roleCounts.rentalSeekers, color: "text-cyan-400" },
                ].map((item, idx) => (
                  <div key={idx} className="liquid-glass rounded-2xl p-4 border border-white/10 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{item.label}</span>
                    <div className={`text-2xl font-mono font-bold mt-1 ${item.color}`}>{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Status Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="liquid-glass rounded-3xl p-6 space-y-3 border border-white/10">
                <span className="text-[11px] uppercase font-bold tracking-wider text-amber-400">Leads Pending Follow-up</span>
                <div className="text-3xl font-bold font-mono text-white">{stats.pendingLeads}</div>
                <p className="text-xs text-slate-300">
                  New and in-progress leads created by right-swipes and priority contact requests.
                </p>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="text-xs text-amber-400 hover:underline font-semibold block pt-1"
                >
                  Manage leads pipeline &rarr;
                </button>
              </div>

              <div className="liquid-glass rounded-3xl p-6 space-y-3 border border-white/10">
                <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400">Closed Transactions</span>
                <div className="text-3xl font-bold font-mono text-white">{stats.closedTransactions}</div>
                <p className="text-xs text-slate-300">
                  Completed deals generating platform transaction commissions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTY MANAGEMENT */}
        {activeTab === "properties" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-claude-serif text-2xl font-bold text-white">Curated Property Inventory</h3>
                <p className="text-xs text-slate-400">Only admin-published properties appear in public discovery swipe decks.</p>
              </div>
              <button
                onClick={() => setNewPropertyModal(true)}
                className="py-2.5 px-4 rounded-xl liquid-glass-btn-royal text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Property</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="liquid-glass-elevated rounded-3xl p-6 space-y-4 border border-white/15 shadow-xl relative"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          prop.status === "PUBLISHED" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-700 text-slate-300"
                        }`}>
                          {prop.status}
                        </span>
                        {prop.isJointVenture && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            BUILDER JV
                          </span>
                        )}
                        {prop.isDisputed && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            DISPUTED
                          </span>
                        )}
                        <span className="text-xs text-slate-400">{prop.category}</span>
                      </div>
                      <h4 className="font-claude-serif text-lg font-bold text-white">{prop.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{prop.locality}, {prop.city}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setEditingProperty({ ...prop })}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1"
                        title="Edit Property"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleTogglePropertyStatus(prop)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          prop.status === "PUBLISHED"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                        }`}
                      >
                        {prop.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => handleDeleteProperty(prop.id)}
                        className="p-1.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl liquid-glass text-xs space-y-1.5 border border-white/10">
                    <div className="flex justify-between text-slate-400">
                      <span>Internal Asking Price:</span>
                      <strong className="text-amber-400">₹{prop.internalAskingPrice?.toLocaleString() || "N/A"}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Area:</span>
                      <span className="text-white">{prop.area.toLocaleString()} {prop.areaUnit}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Availability:</span>
                      <span className="text-white">{prop.purposeAvailability}</span>
                    </div>
                    {prop.internalOwnershipDetails && (
                      <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10 italic">
                        Note: {prop.internalOwnershipDetails}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LEADS PIPELINE */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="font-claude-serif text-2xl font-bold text-white">Lead Generation & Pipeline</h3>
              <p className="text-xs text-slate-400">Generated automatically whenever a user swipes right or clicks Contact Immediately.</p>
            </div>

            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="liquid-glass-elevated rounded-2xl p-5 border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{lead.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        lead.actionType === "CONTACT_IMMEDIATELY"
                          ? "bg-amber-500 text-slate-950"
                          : "bg-emerald-600 text-white"
                      }`}>
                        {lead.actionType}
                      </span>
                      <span className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="text-base font-bold text-white flex items-center gap-2">
                      <span>{lead.userName}</span>
                      <span className="text-xs font-normal text-slate-400">({lead.userRoles.join(", ")})</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {lead.userEmail}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {lead.userPhone}</span>
                    </div>

                    <div className="text-xs text-amber-400 pt-1">
                      Target Mandate: <strong>{lead.propertyTitle}</strong> ({lead.propertyLocation})
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="p-2.5 rounded-xl liquid-glass-input text-xs font-semibold text-white focus:outline-none"
                    >
                      <option value="NEW" className="bg-[#121B33]">NEW</option>
                      <option value="CONTACTED" className="bg-[#121B33]">CONTACTED</option>
                      <option value="FOLLOW_UP" className="bg-[#121B33]">FOLLOW UP</option>
                      <option value="SITE_VISIT" className="bg-[#121B33]">SITE VISIT</option>
                      <option value="NEGOTIATION" className="bg-[#121B33]">NEGOTIATION</option>
                      <option value="CONVERTED" className="bg-[#121B33]">CONVERTED</option>
                      <option value="CLOSED" className="bg-[#121B33]">CLOSED</option>
                      <option value="LOST" className="bg-[#121B33]">LOST</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: USERS & ACTIVITY HISTORY */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="font-claude-serif text-2xl font-bold text-white">Registered Users & Browsing History</h3>
              <p className="text-xs text-slate-400">Click any user to inspect their full property swipe and interaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {usersList.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleInspectUser(u.id)}
                  className="liquid-glass-elevated rounded-2xl p-5 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{u.name || "Anonymous User"}</h4>
                      <p className="text-xs text-slate-400">{u.email} • {u.phone || "No phone"}</p>
                    </div>
                    <span className="text-xs text-amber-400 font-semibold hover:underline">
                      View Activity &rarr;
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {u.roles.map((r: string) => (
                      <span key={r} className="text-[10px] font-bold px-2 py-0.5 rounded-full liquid-glass text-slate-300">
                        {r}
                      </span>
                    ))}
                  </div>

                  {u.metrics && (
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                      <div>
                        <div className="font-mono font-bold text-emerald-400">{u.metrics.interestedCount}</div>
                        <span className="text-[9px] text-slate-400 uppercase">Interested</span>
                      </div>
                      <div>
                        <div className="font-mono font-bold text-amber-400">{u.metrics.contactCount}</div>
                        <span className="text-[9px] text-slate-400 uppercase">Contact</span>
                      </div>
                      <div>
                        <div className="font-mono font-bold text-red-400">{u.metrics.skippedCount}</div>
                        <span className="text-[9px] text-slate-400 uppercase">Skipped</span>
                      </div>
                      <div>
                        <div className="font-mono font-bold text-slate-300">{u.metrics.viewedCount}</div>
                        <span className="text-[9px] text-slate-400 uppercase">Total Views</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROPERTY SUBMISSIONS */}
        {activeTab === "submissions" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="font-claude-serif text-2xl font-bold text-white">Owner & Broker Property Intake</h3>
              <p className="text-xs text-slate-400">Submissions are never auto-published. Review title facts and approve to convert into public listings.</p>
            </div>

            <div className="space-y-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="liquid-glass-elevated rounded-2xl p-6 border border-white/15 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-400">{sub.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          sub.status === "APPROVED" ? "bg-emerald-600 text-white" :
                          sub.status === "REJECTED" ? "bg-red-600 text-white" :
                          "bg-amber-500 text-slate-950"
                        }`}>
                          {sub.status}
                        </span>
                        <span className="text-xs text-slate-400">by {sub.submitterName} ({sub.submitterRole})</span>
                      </div>
                      <h4 className="font-claude-serif text-lg font-bold text-white">{sub.title}</h4>
                      <p className="text-xs text-slate-400">{sub.locality}, {sub.city}, {sub.state}</p>
                    </div>

                    {sub.status === "PENDING_REVIEW" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReviewSubmission(sub.id, "APPROVED")}
                          className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                        <button
                          onClick={() => handleReviewSubmission(sub.id, "REJECTED")}
                          className="py-1.5 px-3.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-xs font-bold text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{sub.description}</p>

                  <div className="p-3 rounded-xl liquid-glass text-xs flex items-center justify-between">
                    <span>Asking Price Benchmark: <strong className="text-amber-400">₹{(sub.askingPrice ?? 0).toLocaleString()}</strong></span>
                    <span>Area: <strong className="text-white">{sub.area} {sub.areaUnit}</strong></span>
                    <span>Contact: <strong className="text-white">{sub.submitterEmail} • {sub.submitterPhone}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CONFIGURABLE SETTINGS */}
        {activeTab === "settings" && config && (
          <div className="max-w-2xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl animate-in fade-in duration-300">
            <div>
              <h3 className="font-claude-serif text-2xl font-bold text-white">Platform Settings & Trust Promises</h3>
              <p className="text-xs text-slate-400 mt-1">Configure the landing page Price Promise text and automated admin lead alerts.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Landing Page Price Promise Statement
                </label>
                <textarea
                  rows={4}
                  value={pricePromiseInput}
                  onChange={(e) => setPricePromiseInput(e.target.value)}
                  className="w-full p-3 rounded-xl liquid-glass-input text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Admin Notification Email
                </label>
                <input
                  type="email"
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full p-3 rounded-xl liquid-glass-input text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="py-3 px-6 rounded-xl liquid-glass-btn-royal font-bold text-xs sm:text-sm text-white shadow-lg"
              >
                Save Configuration Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected User Activity History Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-2xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-claude-serif text-xl font-bold text-white">User Activity Dossier</h3>
                <p className="text-xs text-slate-400">{selectedUserDetail.user.name} ({selectedUserDetail.user.email})</p>
              </div>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Interested Properties ({selectedUserDetail.activity.interested.length})
              </h4>
              <div className="space-y-2">
                {selectedUserDetail.activity.interested.map(({ activity: act, property: prop }: any) => (
                  <div key={act.id} className="p-3 rounded-xl liquid-glass text-xs flex justify-between items-center">
                    <div>
                      <strong className="text-white block">{prop.title}</strong>
                      <span className="text-slate-400">{prop.locality}, {prop.city}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(act.lastViewedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 pt-2">
                Skipped Properties ({selectedUserDetail.activity.skipped.length})
              </h4>
              <div className="space-y-2">
                {selectedUserDetail.activity.skipped.map(({ activity: act, property: prop }: any) => (
                  <div key={act.id} className="p-3 rounded-xl liquid-glass text-xs flex justify-between items-center">
                    <span className="text-slate-300">{prop.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(act.lastViewedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Property Modal */}
      {newPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-claude-serif text-xl font-bold text-white">Add New Curated Listing</h3>
              <button
                onClick={() => setNewPropertyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={newProp.title}
                  onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                  required
                  placeholder="e.g. Sea Facing 4 BHK Penthouse"
                  className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={newProp.category}
                    onChange={(e) => setNewProp({ ...newProp, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  >
                    <option value="FLAT" className="bg-[#121B33]">Flat</option>
                    <option value="HOUSE" className="bg-[#121B33]">House</option>
                    <option value="PLOT" className="bg-[#121B33]">Vacant Plot</option>
                    <option value="INDUSTRIAL_LAND" className="bg-[#121B33]">Industrial Land</option>
                    <option value="WAREHOUSE" className="bg-[#121B33]">Warehouse</option>
                    <option value="FACTORY" className="bg-[#121B33]">Factory</option>
                    <option value="BUILDING_WITH_LAND" className="bg-[#121B33]">Building with Land</option>
                    <option value="DISPUTED" className="bg-[#121B33]">Disputed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Inventory Type</label>
                  <select
                    value={newProp.inventoryType}
                    onChange={(e) => setNewProp({ ...newProp, inventoryType: e.target.value })}
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  >
                    <option value="NON_BANK_NBFC" className="bg-[#121B33]">Non-Bank / Direct</option>
                    <option value="BANK_NBFC" className="bg-[#121B33]">Bank / NBFC Seized</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={newProp.city}
                    onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    value={newProp.state}
                    onChange={(e) => setNewProp({ ...newProp, state: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Locality</label>
                  <input
                    type="text"
                    value={newProp.locality}
                    onChange={(e) => setNewProp({ ...newProp, locality: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Area Dimension</label>
                  <input
                    type="number"
                    value={newProp.area}
                    onChange={(e) => setNewProp({ ...newProp, area: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Internal Price (Confidential)</label>
                  <input
                    type="number"
                    value={newProp.internalAskingPrice}
                    onChange={(e) => setNewProp({ ...newProp, internalAskingPrice: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProp.isJointVenture}
                    onChange={(e) => setNewProp({ ...newProp, isJointVenture: e.target.checked })}
                    className="rounded"
                  />
                  <span>Joint Venture Proposal (Builder-Only)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProp.isDisputed}
                    onChange={(e) => setNewProp({ ...newProp, isDisputed: e.target.checked })}
                    className="rounded"
                  />
                  <span>Disputed Property</span>
                </label>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Demarcation Details</label>
                <input
                  type="text"
                  value={newProp.demarcation}
                  onChange={(e) => setNewProp({ ...newProp, demarcation: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProp.description}
                  onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl liquid-glass-btn-royal font-bold text-sm text-white shadow-lg"
              >
                Create & Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-claude-serif text-xl font-bold text-white">Edit Property Listing</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{editingProperty.id}</p>
              </div>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProperty} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={editingProperty.title}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={editingProperty.category}
                    onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  >
                    <option value="FLAT" className="bg-[#121B33]">Flat</option>
                    <option value="HOUSE" className="bg-[#121B33]">House</option>
                    <option value="PLOT" className="bg-[#121B33]">Vacant Plot</option>
                    <option value="INDUSTRIAL_LAND" className="bg-[#121B33]">Industrial Land</option>
                    <option value="WAREHOUSE" className="bg-[#121B33]">Warehouse</option>
                    <option value="FACTORY" className="bg-[#121B33]">Factory</option>
                    <option value="BUILDING_WITH_LAND" className="bg-[#121B33]">Building with Land</option>
                    <option value="DISPUTED" className="bg-[#121B33]">Disputed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Status</label>
                  <select
                    value={editingProperty.status}
                    onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  >
                    <option value="PUBLISHED" className="bg-[#121B33]">Published</option>
                    <option value="DRAFT" className="bg-[#121B33]">Draft</option>
                    <option value="PAUSED" className="bg-[#121B33]">Paused</option>
                    <option value="SOLD" className="bg-[#121B33]">Sold</option>
                    <option value="RENTED" className="bg-[#121B33]">Rented</option>
                    <option value="ARCHIVED" className="bg-[#121B33]">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={editingProperty.city}
                    onChange={(e) => setEditingProperty({ ...editingProperty, city: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    value={editingProperty.state}
                    onChange={(e) => setEditingProperty({ ...editingProperty, state: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Locality</label>
                  <input
                    type="text"
                    value={editingProperty.locality}
                    onChange={(e) => setEditingProperty({ ...editingProperty, locality: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Area Dimension ({editingProperty.areaUnit})</label>
                  <input
                    type="number"
                    value={editingProperty.area}
                    onChange={(e) => setEditingProperty({ ...editingProperty, area: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Internal Price (Confidential ₹)</label>
                  <input
                    type="number"
                    value={editingProperty.internalAskingPrice || 0}
                    onChange={(e) => setEditingProperty({ ...editingProperty, internalAskingPrice: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProperty.isJointVenture}
                    onChange={(e) => setEditingProperty({ ...editingProperty, isJointVenture: e.target.checked })}
                    className="rounded"
                  />
                  <span>Joint Venture Proposal (Builder-Only)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProperty.isDisputed}
                    onChange={(e) => setEditingProperty({ ...editingProperty, isDisputed: e.target.checked })}
                    className="rounded"
                  />
                  <span>Disputed Property</span>
                </label>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Demarcation Details</label>
                <input
                  type="text"
                  value={editingProperty.demarcation}
                  onChange={(e) => setEditingProperty({ ...editingProperty, demarcation: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProperty.description}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl liquid-glass-input text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="w-1/3 py-3 rounded-xl liquid-glass font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl liquid-glass-btn-royal font-bold text-sm text-white shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
