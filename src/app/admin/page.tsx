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
  Lock, 
  AlertCircle,
  Sparkles
} from "lucide-react";

export default function AdminConsolePage() {
  const { user, quickLoginAs } = useAuth();
  const [activeTab, setActiveTab] = useState<"LISTINGS" | "LEADS" | "SUBMISSIONS" | "AUDIT">("LISTINGS");

  const [properties, setProperties] = useState<InternalPropertyListing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Lead update modal state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [newStatus, setNewStatus] = useState<LeadStatus>("CONTACTED");
  const [staffNote, setStaffNote] = useState("");
  const [updatingLead, setUpdatingLead] = useState(false);

  const isAdmin = user?.staffRoles && user.staffRoles.length > 0;

  const loadAdminData = async () => {
    if (!isAdmin) return;
    setLoading(true);
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
      console.error(err);
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
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 liquid-glass text-purple-400 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/40 shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-claude-serif text-2xl text-[#EDE8E1]">Admin Authorization Required</h2>
          <p className="text-xs sm:text-sm text-[#A39E96] max-w-sm mx-auto">
            This console is restricted to authorized platform personnel. Staff roles cannot be self-assigned.
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-5 text-xs text-left space-y-3 border-white/[0.08]">
          <div className="text-xs font-bold flex items-center gap-2 text-[#EDE8E1]">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Demo Admin Authentication:</span>
          </div>
          <p className="text-xs text-[#A39E96]">
            Log in as the seeded Super Admin to evaluate listing management and confidential price controls:
          </p>
          <button
            onClick={() => quickLoginAs("admin@propdesk.demo")}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h1 className="font-claude-serif text-2xl sm:text-3xl font-semibold text-[#EDE8E1] tracking-tight">
              Platform Admin Console
            </h1>
          </div>
          <p className="text-xs text-[#A39E96] mt-1 font-claude-sans">
            Logged in as <strong className="text-[#EDE8E1]">{user?.name}</strong> • Staff Roles: {user?.staffRoles.join(", ")}
          </p>
        </div>

        {/* Metrics Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 liquid-glass rounded-xl text-xs text-[#EDE8E1] font-semibold">
            {properties.length} Listings
          </div>
          <div className="px-3 py-1.5 bg-blue-950/60 border border-blue-500/40 rounded-xl text-xs text-blue-300 font-semibold">
            {inquiries.length} Leads
          </div>
          <div className="px-3 py-1.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-semibold">
            {submissions.filter(s => s.status === "RECEIVED").length} Submissions
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] text-xs font-bold font-claude-sans">
        <button
          onClick={() => setActiveTab("LISTINGS")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "LISTINGS"
              ? "border-purple-400 text-purple-300"
              : "border-transparent text-[#706D67] hover:text-[#A39E96]"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Listings & Private Prices ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab("LEADS")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "LEADS"
              ? "border-purple-400 text-purple-300"
              : "border-transparent text-[#706D67] hover:text-[#A39E96]"
          }`}
        >
          <Send className="w-4 h-4" />
          Lead Inbox & CRM ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("SUBMISSIONS")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "SUBMISSIONS"
              ? "border-purple-400 text-purple-300"
              : "border-transparent text-[#706D67] hover:text-[#A39E96]"
          }`}
        >
          <FileText className="w-4 h-4" />
          Owner Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab("AUDIT")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "AUDIT"
              ? "border-purple-400 text-purple-300"
              : "border-transparent text-[#706D67] hover:text-[#A39E96]"
          }`}
        >
          <Activity className="w-4 h-4" />
          Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Listings & Confidential Prices */}
      {activeTab === "LISTINGS" && (
        <div className="space-y-4">
          <div className="liquid-glass rounded-2xl p-4 text-[#A39E96] text-xs flex items-start gap-2.5 shadow-xl border-white/[0.08]">
            <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#EDE8E1] block font-bold mb-0.5 font-claude-sans">Confidential Pricing View:</strong>
              Private sale prices and lease rates shown below are strictly hidden from all public APIs, HTML page source, search indexes, and guest UI. Disclose only through verified staff communication.
            </div>
          </div>

          <div className="liquid-glass rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="liquid-glass border-b border-white/[0.08] text-[10px] text-[#706D67] uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-purple-400 font-bold">Private Price (Admin Only)</th>
                    <th className="py-3 px-4">Owner / Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-[#EDE8E1]">{p.title}</div>
                        <div className="text-[10px] text-[#706D67]">{p.locality}, {p.city}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#A39E96] text-xs">
                        {p.category} ({p.subtype})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            : p.status === "DRAFT"
                            ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                            : "liquid-glass text-[#EDE8E1]"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-300">
                        {p.privateSalePrice
                          ? `₹${(p.privateSalePrice / 10000000).toFixed(2)} Cr`
                          : p.privateRentAmount
                          ? `₹${(p.privateRentAmount / 100000).toFixed(2)} L/mo`
                          : "Undisclosed"}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#A39E96]">
                        <div>{p.ownerContactName || "Platform Mandate"}</div>
                        <div className="text-[10px] text-[#706D67]">{p.ownerContactPhone || "—"}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === "DRAFT" ? (
                          <button
                            onClick={() => handlePublishProperty(p.id)}
                            className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
                          >
                            Publish
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#706D67]">Live on Site</span>
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
          <div className="liquid-glass rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="liquid-glass border-b border-white/[0.08] text-[10px] text-[#706D67] uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Lead Contact</th>
                    <th className="py-3 px-4">Property / JV</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Staff</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#CC785C] text-xs">
                        {inq.publicReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-[#EDE8E1]">{inq.contactName}</div>
                        <div className="text-[10px] text-[#A39E96]">{inq.contactPhone}</div>
                        <div className="text-[10px] text-[#706D67]">{inq.contactEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#A39E96] max-w-xs truncate text-xs">
                        {inq.propertyTitle || inq.jvTitle || "Direct Advisory"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inq.status === "NEW"
                            ? "bg-red-950/80 text-red-300 border border-red-500/40"
                            : inq.status === "QUALIFIED"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            : "bg-blue-950/80 text-blue-300 border border-blue-500/40"
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#A39E96]">
                        {inq.assignedStaffName || "Unassigned"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setNewStatus(inq.status);
                          }}
                          className="py-1 px-3 liquid-glass-btn text-[#EDE8E1] text-xs font-semibold rounded-lg"
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
          <div className="liquid-glass rounded-2xl p-4 text-[#A39E96] text-xs flex items-start gap-2.5 shadow-xl border-white/[0.08]">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#EDE8E1] block font-bold mb-0.5 font-claude-sans">Intake Queue Review:</strong>
              Owners and brokers submit properties for platform review. Review details, contact the submitter, and click &quot;Convert to Listing&quot; to generate an admin draft.
            </div>
          </div>

          <div className="liquid-glass rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="liquid-glass border-b border-white/[0.08] text-[10px] text-[#706D67] uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">Property Facts</th>
                    <th className="py-3 px-4">Submitter</th>
                    <th className="py-3 px-4">Relationship</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitter Note</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-[#EDE8E1]">{sub.title}</div>
                        <div className="text-[10px] text-[#706D67]">
                          {sub.locality}, {sub.city} • {sub.area} {sub.areaUnit}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#A39E96]">
                        <div className="text-white font-medium">{sub.submitterName}</div>
                        <div className="text-[10px] text-[#706D67]">{sub.submitterPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-white">
                        {sub.relationshipToProperty}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          sub.status === "CONVERTED"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            : "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#706D67] italic max-w-xs truncate text-[11px]">
                        {sub.reviewNotes || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {sub.status !== "CONVERTED" ? (
                          <button
                            onClick={() => handleConvertSubmission(sub.id)}
                            className="py-1 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
                          >
                            Convert to Listing
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold">Converted</span>
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
          <div className="liquid-glass rounded-3xl shadow-xl overflow-hidden p-6 space-y-3">
            <h3 className="font-claude-serif text-lg text-[#EDE8E1] font-semibold">Sensitive Actions Log</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 liquid-glass rounded-xl flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-purple-300 bg-purple-950/60 border border-purple-500/40 px-1.5 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-[#A39E96] ml-2">by {log.actorName}</span>
                    <div className="text-[10px] text-[#706D67]">
                      Entity: {log.entityType} ({log.entityId})
                    </div>
                  </div>
                  <div className="text-[#706D67] text-[10px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="liquid-glass-elevated rounded-3xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-claude-serif text-lg text-[#EDE8E1] font-semibold">
              Update Lead: {selectedInquiry.publicReference}
            </h3>
            <div className="text-xs text-[#A39E96]">
              Client: {selectedInquiry.contactName} ({selectedInquiry.contactPhone})
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1]"
              >
                <option value="NEW" className="bg-[#121215]">NEW</option>
                <option value="ASSIGNED" className="bg-[#121215]">ASSIGNED</option>
                <option value="CONTACT_ATTEMPTED" className="bg-[#121215]">CONTACT_ATTEMPTED</option>
                <option value="CONTACTED" className="bg-[#121215]">CONTACTED</option>
                <option value="QUALIFIED" className="bg-[#121215]">QUALIFIED</option>
                <option value="VISIT_SCHEDULED" className="bg-[#121215]">VISIT_SCHEDULED</option>
                <option value="NEGOTIATION" className="bg-[#121215]">NEGOTIATION</option>
                <option value="WON" className="bg-[#121215]">WON</option>
                <option value="LOST" className="bg-[#121215]">LOST</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-[#706D67] font-bold block">
                Internal Staff Note (Protected from User)
              </label>
              <textarea
                rows={3}
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="Spoke with client. Discussed budget schedule and floor plans."
                className="w-full p-2.5 liquid-glass-input rounded-xl text-xs text-[#EDE8E1] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-1/2 py-2.5 liquid-glass text-[#EDE8E1] text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLeadStatus}
                disabled={updatingLead}
                className="w-1/2 py-2.5 liquid-glass-btn-accent text-white text-xs font-semibold rounded-xl shadow-md"
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
