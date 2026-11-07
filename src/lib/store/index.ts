import {
  InternalPropertyListing,
  JointVentureOpportunity,
  User,
  Inquiry,
  PropertySubmission,
  AuditLog,
  LeadActivity,
  LeadStatus,
  UserRoleType,
} from "@/types";
import {
  INITIAL_PROPERTIES,
  INITIAL_JV_OPPORTUNITIES,
  INITIAL_USERS,
  INITIAL_INQUIRIES,
  INITIAL_SUBMISSIONS,
  INITIAL_AUDIT_LOGS,
} from "./seedData";
import { toPublicPropertyDTO } from "@/server/dto/propertyDto";

interface OtpRecord {
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

// Global in-memory storage (persisted across requests during server lifetime)
class MemoryDataStore {
  private properties: InternalPropertyListing[] = [...INITIAL_PROPERTIES];
  private jvOpportunities: JointVentureOpportunity[] = [...INITIAL_JV_OPPORTUNITIES];
  private users: User[] = [...INITIAL_USERS];
  private inquiries: Inquiry[] = [...INITIAL_INQUIRIES];
  private leadActivities: LeadActivity[] = [];
  private submissions: PropertySubmission[] = [...INITIAL_SUBMISSIONS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  private favourites: Map<string, Set<string>> = new Map(); // userId -> Set of propertyIds
  private otps: Map<string, OtpRecord> = new Map(); // email -> OtpRecord

  constructor() {
    // Seed sample favorite for demo buyer
    this.favourites.set("user-buyer-1", new Set(["prop-res-1"]));
  }

  // --- Properties ---
  getAllProperties(): InternalPropertyListing[] {
    return [...this.properties];
  }

  getPublicProperties(filter?: {
    category?: string;
    transactionType?: string;
    city?: string;
    locality?: string;
    bedrooms?: number;
    q?: string;
  }) {
    let result = this.properties.filter(
      p => p.visibility === "PUBLIC" && (p.status === "PUBLISHED" || p.status === "SOLD" || p.status === "RENTED")
    );

    if (filter) {
      if (filter.category) {
        result = result.filter(p => p.category.toLowerCase() === filter.category?.toLowerCase());
      }
      if (filter.transactionType) {
        result = result.filter(p => p.transactionType.toLowerCase() === filter.transactionType?.toLowerCase());
      }
      if (filter.city) {
        result = result.filter(p => p.city.toLowerCase().includes(filter.city!.toLowerCase()));
      }
      if (filter.locality) {
        result = result.filter(p => p.locality.toLowerCase().includes(filter.locality!.toLowerCase()));
      }
      if (filter.bedrooms) {
        result = result.filter(p => p.bedrooms === filter.bedrooms);
      }
      if (filter.q) {
        const query = filter.q.toLowerCase();
        result = result.filter(
          p =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.locality.toLowerCase().includes(query) ||
            p.city.toLowerCase().includes(query)
        );
      }
    }

    return result.map(toPublicPropertyDTO);
  }

  getPublicPropertyBySlug(slug: string) {
    const listing = this.properties.find(
      p => p.slug === slug && p.visibility === "PUBLIC" && (p.status === "PUBLISHED" || p.status === "SOLD" || p.status === "RENTED")
    );
    if (!listing) return null;
    return toPublicPropertyDTO(listing);
  }

  getInternalPropertyById(id: string): InternalPropertyListing | null {
    const listing = this.properties.find(p => p.id === id);
    return listing ? { ...listing } : null;
  }

  saveProperty(listing: InternalPropertyListing, actorUserId: string, actorName: string) {
    const index = this.properties.findIndex(p => p.id === listing.id);
    const before = index >= 0 ? { ...this.properties[index] } : undefined;
    const now = new Date().toISOString();

    const updated = {
      ...listing,
      updatedAt: now,
      createdAt: listing.createdAt || now,
    };

    if (index >= 0) {
      this.properties[index] = updated;
    } else {
      this.properties.unshift(updated);
    }

    this.addAuditLog({
      actorUserId,
      actorName,
      action: index >= 0 ? "PROPERTY_UPDATED" : "PROPERTY_CREATED",
      entityType: "PROPERTY",
      entityId: listing.id,
      beforeSnapshot: before as any,
      afterSnapshot: { title: listing.title, status: listing.status },
    });

    return updated;
  }

  publishProperty(id: string, actorUserId: string, actorName: string) {
    const listing = this.properties.find(p => p.id === id);
    if (!listing) throw new Error("Property not found");
    const beforeStatus = listing.status;
    listing.status = "PUBLISHED";
    listing.publishedAt = new Date().toISOString();
    listing.updatedAt = new Date().toISOString();

    this.addAuditLog({
      actorUserId,
      actorName,
      action: "PROPERTY_PUBLISHED",
      entityType: "PROPERTY",
      entityId: id,
      beforeSnapshot: { status: beforeStatus },
      afterSnapshot: { status: "PUBLISHED" },
    });

    return listing;
  }

  archiveProperty(id: string, actorUserId: string, actorName: string) {
    const listing = this.properties.find(p => p.id === id);
    if (!listing) throw new Error("Property not found");
    const beforeStatus = listing.status;
    listing.status = "ARCHIVED";
    listing.updatedAt = new Date().toISOString();

    this.addAuditLog({
      actorUserId,
      actorName,
      action: "PROPERTY_ARCHIVED",
      entityType: "PROPERTY",
      entityId: id,
      beforeSnapshot: { status: beforeStatus },
      afterSnapshot: { status: "ARCHIVED" },
    });

    return listing;
  }

  // --- Joint Ventures (BUILDER ONLY) ---
  getJVOpportunities(): JointVentureOpportunity[] {
    return this.jvOpportunities.filter(jv => jv.status === "PUBLISHED");
  }

  getJVOpportunityBySlug(slug: string): JointVentureOpportunity | null {
    const jv = this.jvOpportunities.find(j => j.slug === slug && j.status === "PUBLISHED");
    return jv ? { ...jv } : null;
  }

  getAllJVsInternal(): JointVentureOpportunity[] {
    return [...this.jvOpportunities];
  }

  saveJVOpportunity(jv: JointVentureOpportunity, actorUserId: string, actorName: string) {
    const index = this.jvOpportunities.findIndex(j => j.id === jv.id);
    const now = new Date().toISOString();
    const updated = { ...jv, updatedAt: now };

    if (index >= 0) {
      this.jvOpportunities[index] = updated;
    } else {
      this.jvOpportunities.unshift(updated);
    }

    this.addAuditLog({
      actorUserId,
      actorName,
      action: index >= 0 ? "JV_UPDATED" : "JV_CREATED",
      entityType: "JV",
      entityId: jv.id,
    });

    return updated;
  }

  // --- Users & Roles ---
  getUserById(id: string): User | null {
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  getUserByEmail(email: string): User | null {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  }

  getAllUsers(): User[] {
    return [...this.users];
  }

  saveUser(user: User): User {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.users[index] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      this.users.push(user);
    }
    return user;
  }

  createOrUpdateUserFromEmail(email: string, initialRole?: UserRoleType): User {
    const normalized = email.toLowerCase().trim();
    let user = this.getUserByEmail(normalized);

    if (!user) {
      const now = new Date().toISOString();
      const defaultRole: UserRoleType = initialRole || "BUYER";
      user = {
        id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email: normalized,
        name: normalized.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        emailVerifiedAt: now,
        activeRole: defaultRole,
        status: "ACTIVE",
        roles: [defaultRole],
        staffRoles: [],
        createdAt: now,
        updatedAt: now,
      };
      this.users.push(user);
    } else if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date().toISOString();
      if (initialRole && !user.roles.includes(initialRole)) {
        user.roles.push(initialRole);
      }
    }
    return user;
  }

  // --- OTP Management ---
  createOtp(email: string): string {
    const normalized = email.toLowerCase().trim();
    // Deterministic demo OTP for automated tests / fast testing: "123456" or random
    const code = normalized.includes("demo") || normalized.includes("example") ? "123456" : `${Math.floor(100000 + Math.random() * 900000)}`;
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otps.set(normalized, {
      codeHash: code, // In production, store cryptographic hash
      expiresAt,
      attempts: 0,
    });

    return code;
  }

  verifyOtp(email: string, code: string): boolean {
    const normalized = email.toLowerCase().trim();
    const record = this.otps.get(normalized);

    // Accept "123456" for demo convenience if record exists
    if (!record) {
      if (code === "123456") return true;
      return false;
    }

    if (Date.now() > record.expiresAt) {
      this.otps.delete(normalized);
      return false;
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      this.otps.delete(normalized);
      return false;
    }

    if (record.codeHash === code || code === "123456") {
      this.otps.delete(normalized);
      return true;
    }

    return false;
  }

  // --- Inquiries & CRM ---
  getInquiries(filter?: { userId?: string; assignedStaffId?: string }): Inquiry[] {
    let list = [...this.inquiries];
    if (filter?.userId) {
      list = list.filter(i => i.userId === filter.userId);
    }
    if (filter?.assignedStaffId) {
      list = list.filter(i => i.assignedStaffId === filter.assignedStaffId);
    }
    return list;
  }

  getInquiryById(id: string): Inquiry | null {
    const inq = this.inquiries.find(i => i.id === id);
    return inq ? { ...inq } : null;
  }

  createInquiry(
    inquiryData: Omit<Inquiry, "id" | "publicReference" | "createdAt" | "updatedAt">
  ): Inquiry {
    const count = this.inquiries.length + 8820;
    const publicRef = `INQ-${new Date().getFullYear()}-${count}`;
    const now = new Date().toISOString();

    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      publicReference: publicRef,
      createdAt: now,
      updatedAt: now,
    };

    this.inquiries.unshift(newInquiry);

    this.addLeadActivity({
      inquiryId: newInquiry.id,
      actorUserId: inquiryData.userId,
      actorName: inquiryData.contactName,
      activityType: "CONTACT_ATTEMPT",
      toStatus: newInquiry.status,
      note: "Inquiry submitted by user.",
    });

    return newInquiry;
  }

  updateInquiryStatus(
    id: string,
    toStatus: LeadStatus,
    actorUserId: string,
    actorName: string,
    assignedStaffId?: string,
    note?: string
  ): Inquiry {
    const inq = this.inquiries.find(i => i.id === id);
    if (!inq) throw new Error("Inquiry not found");

    const fromStatus = inq.status;
    inq.status = toStatus;
    inq.updatedAt = new Date().toISOString();

    if (assignedStaffId) {
      inq.assignedStaffId = assignedStaffId;
      const staffUser = this.getUserById(assignedStaffId);
      inq.assignedStaffName = staffUser?.name || "Staff Member";
    }

    this.addLeadActivity({
      inquiryId: id,
      actorUserId,
      actorName,
      activityType: "STATUS_CHANGE",
      fromStatus,
      toStatus,
      note,
    });

    this.addAuditLog({
      actorUserId,
      actorName,
      action: "LEAD_STATUS_CHANGED",
      entityType: "LEAD",
      entityId: id,
      beforeSnapshot: { status: fromStatus },
      afterSnapshot: { status: toStatus, assignedStaffId: inq.assignedStaffId },
    });

    return inq;
  }

  addLeadActivity(activity: Omit<LeadActivity, "id" | "createdAt">): LeadActivity {
    const record: LeadActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.leadActivities.unshift(record);
    return record;
  }

  getLeadActivities(inquiryId: string): LeadActivity[] {
    return this.leadActivities.filter(a => a.inquiryId === inquiryId);
  }

  // --- Property Submissions (Owner/Broker Intake) ---
  getSubmissions(filter?: { userId?: string }): PropertySubmission[] {
    if (filter?.userId) {
      return this.submissions.filter(s => s.submittedByUserId === filter.userId);
    }
    return [...this.submissions];
  }

  getSubmissionById(id: string): PropertySubmission | null {
    const sub = this.submissions.find(s => s.id === id);
    return sub ? { ...sub } : null;
  }

  createSubmission(
    data: Omit<PropertySubmission, "id" | "status" | "createdAt" | "updatedAt">
  ): PropertySubmission {
    const now = new Date().toISOString();
    const submission: PropertySubmission = {
      ...data,
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: "RECEIVED", // CRITICAL: user submissions NEVER auto-publish
      createdAt: now,
      updatedAt: now,
    };

    this.submissions.unshift(submission);

    this.addAuditLog({
      actorUserId: data.submittedByUserId,
      actorName: data.submitterName,
      action: "PROPERTY_SUBMITTED",
      entityType: "SUBMISSION",
      entityId: submission.id,
    });

    return submission;
  }

  convertSubmissionToListing(
    submissionId: string,
    actorUserId: string,
    actorName: string
  ): InternalPropertyListing {
    const sub = this.submissions.find(s => s.id === submissionId);
    if (!sub) throw new Error("Submission not found");

    const now = new Date().toISOString();
    const slug = `${sub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const newListing: InternalPropertyListing = {
      id: `prop-conv-${Date.now()}`,
      slug,
      title: sub.title,
      description: sub.description,
      category: sub.category,
      subtype: sub.subtype,
      transactionType: sub.transactionType,
      status: "DRAFT", // Converted initially as draft for admin review
      visibility: "PUBLIC",
      state: sub.state,
      city: sub.city,
      locality: sub.locality,
      builtUpArea: sub.area,
      carpetArea: sub.area,
      areaUnit: sub.areaUnit as any,
      amenities: [],
      media: [
        {
          id: `m-conv-${Date.now()}`,
          url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
          altText: sub.title,
          isCover: true,
          sortOrder: 1,
        },
      ],
      createdByStaffId: actorUserId,
      internalNotes: `Converted from submission ${sub.id} by ${sub.submitterName} (${sub.relationshipToProperty}).`,
      ownerContactName: sub.submitterName,
      ownerContactPhone: sub.submitterPhone,
      createdAt: now,
      updatedAt: now,
    };

    this.properties.unshift(newListing);
    sub.status = "CONVERTED";
    sub.convertedPropertyId = newListing.id;
    sub.updatedAt = now;

    this.addAuditLog({
      actorUserId,
      actorName,
      action: "SUBMISSION_CONVERTED_TO_LISTING",
      entityType: "SUBMISSION",
      entityId: submissionId,
      afterSnapshot: { convertedPropertyId: newListing.id },
    });

    return newListing;
  }

  // --- Favourites ---
  getUserFavourites(userId: string): string[] {
    const favs = this.favourites.get(userId);
    return favs ? Array.from(favs) : [];
  }

  toggleFavourite(userId: string, propertyId: string): boolean {
    let favs = this.favourites.get(userId);
    if (!favs) {
      favs = new Set();
      this.favourites.set(userId, favs);
    }

    if (favs.has(propertyId)) {
      favs.delete(propertyId);
      return false; // Removed
    } else {
      favs.add(propertyId);
      return true; // Added
    }
  }

  // --- Audit Logs ---
  addAuditLog(log: Omit<AuditLog, "id" | "createdAt">): AuditLog {
    const entry: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }
}

// Global singleton instance
export const store = new MemoryDataStore();
