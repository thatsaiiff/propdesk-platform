"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { InternalPropertyListing, Inquiry, PropertySubmission, AuditLog, LeadStatus } from "@/types";
import { 
  ShieldAlert, 
  Building2, 
  Send, 
  FileText, 
  Activity, 
  Plus, 
  CheckCircle2, 
  Eye, 
  Clock, 
  Lock, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function AdminConsolePage() {
  const { user, quickLoginAs } = useAuth();
  const [activeTab, setActiveTab] = useState<"LISTINGS" | "LEADS" | "SUBMISSIONS" | "AUDIT">("LISTINGS");

  const [properties, setProperties] = useState<InternalPropertyListing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lead update modal state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [newStatus, setNewStatus] = useState<LeadStatus>("CONTACTED");
  const [staffNote, setStaffNote] = useState("");
  const [updatingLead, setUpdatingLead] = useState(false);

  const isAdmin = user?.staffRoles && user.staffRoles.length > 0;

  const loadAdminData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const [propRes, inqRes, subRes, audRes] = await Promise.all([
        fetch("/api/admin/properties"),
        fetch("/api/admin/inquiries"),
        fetch("/api/admin/submissions"),
        fetch("/api/admin/audit-logs"),
      ]);

      const propData = await propRes.json();
      const inqData = await inqRes.json();
      const subData = await subRes.json();
      const audData = await audRes.json();

      if (propData.success) setProperties(propData.properties || []);
      if (inqData.success) setInquiries(inqData.inquiries || []);
      if (subData.success) setSubmissions(subData.submissions || []);
      if (audData.success) setAuditLogs(audData.logs || []);
    } catch (err: any) {
      setError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const handlePublishProperty = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvertSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}/convert`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await loadAdminData();
        setActiveTab("LISTINGS");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveLeadStatus = async () => {
    if (!selectedInquiry) return;
    setUpdatingLead(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: staffNote || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedInquiry(null);
        setStaffNote("");
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingLead(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Admin Authorization Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            This console is restricted to authorized platform personnel. Staff roles cannot be self-assigned.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2 text-left">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <Sparkles className="w-4 h-4 text-purple-600" /> Demo Admin Access
          </div>
          <p className="text-[11px] text-slate-500">
            Log in as the seeded Super Admin to manage listings, private prices, submissions, and leads:
          </p>
          <button
            onClick={() => quickLoginAs("admin@propdesk.demo")}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-md mt-2"
          >
            Authenticate as Super Admin (admin@propdesk.demo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Platform Admin Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong className="text-slate-800">{user?.name}</strong> • Staff Roles: {user?.staffRoles.join(", ")}
          </p>
        </div>

        {/* Top Metric Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-slate-100 rounded-xl font-bold text-slate-700">
            {properties.length} Listings
          </div>
          <div className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-xl font-bold">
            {inquiries.length} Leads
          </div>
          <div className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl font-bold">
            {submissions.filter(s => s.status === "RECEIVED").length} Pending Submissions
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab("LISTINGS")}
          className={`py-3 px-4 border-b-2 transition-smooth flex items-center gap-1.5 ${
            activeTab === "LISTINGS"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Listings & Private Prices ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab("LEADS")}
          className={`py-3 px-4 border-b-2 transition-smooth flex items-center gap-1.5 ${
            activeTab === "LEADS"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Send className="w-4 h-4" />
          Lead Inbox & CRM ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("SUBMISSIONS")}
          className={`py-3 px-4 border-b-2 transition-smooth flex items-center gap-1.5 ${
            activeTab === "SUBMISSIONS"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          Owner Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab("AUDIT")}
          className={`py-3 px-4 border-b-2 transition-smooth flex items-center gap-1.5 ${
            activeTab === "AUDIT"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Activity className="w-4 h-4" />
          Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Listings & Confidential Prices */}
      {activeTab === "LISTINGS" && (
        <div className="space-y-4">
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 text-xs text-purple-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Confidential Pricing View:</strong>
              Private sale prices and lease rates shown below are strictly hidden from all public APIs, HTML page source, search indexes, and guest UI. Disclose only through verified staff communication.
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 font-bold text-purple-900">Private Price (Admin Only)</th>
                    <th className="py-3 px-4">Owner / Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <div className="text-[11px] text-slate-400">{p.locality}, {p.city}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {p.category} ({p.subtype})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "DRAFT"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-800 bg-purple-50/30">
                        {p.privateSalePrice
                          ? `₹${(p.privateSalePrice / 10000000).toFixed(2)} Cr`
                          : p.privateRentAmount
                          ? `₹${(p.privateRentAmount / 100000).toFixed(2)} L/mo`
                          : "Undisclosed"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{p.ownerContactName || "Platform Mandate"}</div>
                        <div className="text-[11px] text-slate-400">{p.ownerContactPhone || "—"}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === "DRAFT" ? (
                          <button
                            onClick={() => handlePublishProperty(p.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                          >
                            Publish
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Live on Site</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Lead CRM */}
      {activeTab === "LEADS" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Lead Contact</th>
                    <th className="py-3 px-4">Property / JV</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Staff</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                        {inq.publicReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{inq.contactName}</div>
                        <div className="text-[11px] text-slate-500">{inq.contactPhone}</div>
                        <div className="text-[11px] text-slate-400">{inq.contactEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                        {inq.propertyTitle || inq.jvTitle || "Direct Advisory"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          inq.status === "NEW"
                            ? "bg-red-100 text-red-800"
                            : inq.status === "QUALIFIED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {inq.assignedStaffName || "Unassigned"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setNewStatus(inq.status);
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Owner Submissions Queue */}
      {activeTab === "SUBMISSIONS" && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Intake Queue Review:</strong>
              Owners and brokers submit properties for platform review. Review details, contact the submitter, and click &quot;Convert to Listing&quot; to generate an admin draft.
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Property Facts</th>
                    <th className="py-3 px-4">Submitter</th>
                    <th className="py-3 px-4">Relationship</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitter Note</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{sub.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {sub.locality}, {sub.city} • {sub.area} {sub.areaUnit}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-semibold">{sub.submitterName}</div>
                        <div className="text-[11px] text-slate-400">{sub.submitterPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        {sub.relationshipToProperty}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          sub.status === "CONVERTED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 italic max-w-xs truncate">
                        {sub.reviewNotes || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {sub.status !== "CONVERTED" ? (
                          <button
                            onClick={() => handleConvertSubmission(sub.id)}
                            className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs"
                          >
                            Convert to Listing
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold">Converted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail */}
      {activeTab === "AUDIT" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Sensitive Actions Log</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded">
                      {log.action}
                    </span>
                    <span className="text-slate-600 ml-2">by {log.actorName}</span>
                    <div className="text-[11px] text-slate-400">
                      Entity: {log.entityType} ({log.entityId})
                    </div>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lead Update Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Update Lead: {selectedInquiry.publicReference}
            </h3>
            <div className="text-xs text-slate-500">
              Client: {selectedInquiry.contactName} ({selectedInquiry.contactPhone})
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="NEW">NEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="CONTACT_ATTEMPTED">CONTACT_ATTEMPTED</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="VISIT_SCHEDULED">VISIT_SCHEDULED</option>
                <option value="NEGOTIATION">NEGOTIATION</option>
                <option value="WON">WON</option>
                <option value="LOST">LOST</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Staff Note (Protected from User)
              </label>
              <textarea
                rows={3}
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="Spoke with client. Discussed budget schedule and floor plans."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLeadStatus}
                disabled={updatingLead}
                className="w-1/2 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs shadow-md"
              >
                {updatingLead ? "Saving..." : "Save Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
