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
        <div className="w-16 h-16 bg-purple-950/80 text-purple-400 rounded-2xl flex items-center justify-center mx-auto border border-purple-800">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="heading-4 text-white">Admin Authorization Required</h2>
          <p className="body-5 text-[#9B9B9B] max-w-sm mx-auto">
            This console is restricted to authorized platform personnel. Staff roles cannot be self-assigned.
          </p>
        </div>

        <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 text-xs text-left space-y-3">
          <div className="caption-3 font-bold flex items-center gap-2 text-white">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Demo Admin Authentication:</span>
          </div>
          <p className="caption-4 text-[#9B9B9B]">
            Log in as the seeded Super Admin to evaluate listing management and confidential price controls:
          </p>
          <button
            onClick={() => quickLoginAs("admin@propdesk.demo")}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white button-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#272727]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h1 className="heading-4 font-bold text-white tracking-tight">
              Platform Admin Console
            </h1>
          </div>
          <p className="caption-3 text-[#9B9B9B] mt-1">
            Logged in as <strong className="text-white">{user?.name}</strong> • Staff Roles: {user?.staffRoles.join(", ")}
          </p>
        </div>

        {/* Metrics Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#181818] border border-[#272727] rounded-xl caption-3 text-white font-semibold">
            {properties.length} Listings
          </div>
          <div className="px-3 py-1.5 bg-blue-950/60 border border-blue-900/50 rounded-xl caption-3 text-blue-300 font-semibold">
            {inquiries.length} Leads
          </div>
          <div className="px-3 py-1.5 bg-amber-950/60 border border-amber-900/50 rounded-xl caption-3 text-amber-300 font-semibold">
            {submissions.filter(s => s.status === "RECEIVED").length} Submissions
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#272727] caption-3 font-bold">
        <button
          onClick={() => setActiveTab("LISTINGS")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "LISTINGS"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-[#666666] hover:text-[#9B9B9B]"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Listings & Private Prices ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab("LEADS")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "LEADS"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-[#666666] hover:text-[#9B9B9B]"
          }`}
        >
          <Send className="w-4 h-4" />
          Lead Inbox & CRM ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("SUBMISSIONS")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "SUBMISSIONS"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-[#666666] hover:text-[#9B9B9B]"
          }`}
        >
          <FileText className="w-4 h-4" />
          Owner Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab("AUDIT")}
          className={`py-3 px-4 border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "AUDIT"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-[#666666] hover:text-[#9B9B9B]"
          }`}
        >
          <Activity className="w-4 h-4" />
          Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Listings & Confidential Prices */}
      {activeTab === "LISTINGS" && (
        <div className="space-y-4">
          <div className="bg-[#181818] border border-[#272727] rounded-2xl p-4 text-[#9B9B9B] caption-3 flex items-start gap-2.5 shadow-xl">
            <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Confidential Pricing View:</strong>
              Private sale prices and lease rates shown below are strictly hidden from all public APIs, HTML page source, search indexes, and guest UI. Disclose only through verified staff communication.
            </div>
          </div>

          <div className="bg-[#181818] rounded-3xl border border-[#272727] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left body-5">
                <thead className="bg-[#1F1F1F] border-b border-[#272727] caption-3 text-[#666666] uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-purple-400 font-bold">Private Price (Admin Only)</th>
                    <th className="py-3 px-4">Owner / Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#272727]">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1F1F1F]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="title-4 text-white">{p.title}</div>
                        <div className="caption-4 text-[#666666]">{p.locality}, {p.city}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#9B9B9B] caption-3">
                        {p.category} ({p.subtype})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full caption-5 font-bold uppercase ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                            : p.status === "DRAFT"
                            ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                            : "bg-[#272727] text-white"
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
                      <td className="py-3.5 px-4 caption-3 text-[#9B9B9B]">
                        <div>{p.ownerContactName || "Platform Mandate"}</div>
                        <div className="caption-5 text-[#666666]">{p.ownerContactPhone || "—"}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === "DRAFT" ? (
                          <button
                            onClick={() => handlePublishProperty(p.id)}
                            className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white button-xsm rounded-lg"
                          >
                            Publish
                          </button>
                        ) : (
                          <span className="caption-4 text-[#666666]">Live on Site</span>
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
          <div className="bg-[#181818] rounded-3xl border border-[#272727] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left body-5">
                <thead className="bg-[#1F1F1F] border-b border-[#272727] caption-3 text-[#666666] uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Lead Contact</th>
                    <th className="py-3 px-4">Property / JV</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Staff</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#272727]">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-[#1F1F1F]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400 caption-3">
                        {inq.publicReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="title-4 text-white">{inq.contactName}</div>
                        <div className="caption-4 text-[#9B9B9B]">{inq.contactPhone}</div>
                        <div className="caption-5 text-[#666666]">{inq.contactEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#9B9B9B] max-w-xs truncate caption-3">
                        {inq.propertyTitle || inq.jvTitle || "Direct Advisory"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full caption-5 font-bold uppercase ${
                          inq.status === "NEW"
                            ? "bg-red-950/80 text-red-300 border border-red-800"
                            : inq.status === "QUALIFIED"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                            : "bg-blue-950/80 text-blue-300 border border-blue-800"
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 caption-3 text-[#9B9B9B]">
                        {inq.assignedStaffName || "Unassigned"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setNewStatus(inq.status);
                          }}
                          className="py-1 px-3 bg-[#272727] hover:bg-[#313131] text-white button-xsm rounded-lg border border-[#313131]"
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
          <div className="bg-[#181818] border border-[#272727] rounded-2xl p-4 text-[#9B9B9B] caption-3 flex items-start gap-2.5 shadow-xl">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Intake Queue Review:</strong>
              Owners and brokers submit properties for platform review. Review details, contact the submitter, and click &quot;Convert to Listing&quot; to generate an admin draft.
            </div>
          </div>

          <div className="bg-[#181818] rounded-3xl border border-[#272727] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left body-5">
                <thead className="bg-[#1F1F1F] border-b border-[#272727] caption-3 text-[#666666] uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">Property Facts</th>
                    <th className="py-3 px-4">Submitter</th>
                    <th className="py-3 px-4">Relationship</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitter Note</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#272727]">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#1F1F1F]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="title-4 text-white">{sub.title}</div>
                        <div className="caption-4 text-[#666666]">
                          {sub.locality}, {sub.city} • {sub.area} {sub.areaUnit}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 caption-3 text-[#9B9B9B]">
                        <div className="text-white font-medium">{sub.submitterName}</div>
                        <div className="caption-5 text-[#666666]">{sub.submitterPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 caption-3 font-semibold text-white">
                        {sub.relationshipToProperty}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full caption-5 font-bold uppercase ${
                          sub.status === "CONVERTED"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                            : "bg-amber-950/80 text-amber-300 border border-amber-800"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#666666] italic max-w-xs truncate caption-4">
                        {sub.reviewNotes || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {sub.status !== "CONVERTED" ? (
                          <button
                            onClick={() => handleConvertSubmission(sub.id)}
                            className="py-1 px-3 bg-blue-600 hover:bg-blue-500 text-white button-xsm rounded-lg"
                          >
                            Convert to Listing
                          </button>
                        ) : (
                          <span className="caption-4 text-emerald-400 font-bold">Converted</span>
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
          <div className="bg-[#181818] rounded-3xl border border-[#272727] shadow-xl overflow-hidden p-6 space-y-3">
            <h3 className="title-3 text-white">Sensitive Actions Log</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#1F1F1F] rounded-xl border border-[#272727] flex items-center justify-between caption-3 font-mono"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-1.5 py-0.2 rounded">
                      {log.action}
                    </span>
                    <span className="text-[#9B9B9B] ml-2">by {log.actorName}</span>
                    <div className="caption-5 text-[#666666]">
                      Entity: {log.entityType} ({log.entityId})
                    </div>
                  </div>
                  <div className="text-[#666666] caption-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#181818] rounded-3xl border border-[#272727] shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="title-2 text-white">
              Update Lead: {selectedInquiry.publicReference}
            </h3>
            <div className="caption-3 text-[#9B9B9B]">
              Client: {selectedInquiry.contactName} ({selectedInquiry.contactPhone})
            </div>

            <div className="space-y-1">
              <label className="caption-3 uppercase text-[#666666] font-bold block">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white"
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

            <div className="space-y-1">
              <label className="caption-3 uppercase text-[#666666] font-bold block">
                Internal Staff Note (Protected from User)
              </label>
              <textarea
                rows={3}
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="Spoke with client. Discussed budget schedule and floor plans."
                className="w-full p-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl body-5 text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-1/2 py-2.5 bg-[#1F1F1F] text-white button-sm rounded-xl border border-[#272727]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLeadStatus}
                disabled={updatingLead}
                className="w-1/2 py-2.5 bg-white text-black button-sm rounded-xl font-semibold shadow-md"
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
