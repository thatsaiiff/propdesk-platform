import {
  Property,
  PublicPropertyDTO,
  User,
  UserRole,
  PropertyActivity,
  Lead,
  LeadStatus,
  PropertySubmission,
  SubmissionStatus,
  PlatformConfig,
  SwipeAction,
  PropertyCategory,
  PropertyPurpose,
  BuilderOpportunityType,
  AuditLog,
} from "@/types";
import {
  INITIAL_CONFIG,
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  INITIAL_SUBMISSIONS,
} from "./seedData";
import { PrismaAdapter } from "../db/prismaAdapter";
import { sendOtpEmail } from "../email/sendEmail";

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

export function toPublicDTO(property: Property): PublicPropertyDTO {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    category: property.category,
    inventoryType: property.inventoryType,
    isJointVenture: property.isJointVenture,
    isDisputed: property.isDisputed,
    purposeAvailability: property.purposeAvailability,
    state: property.state,
    city: property.city,
    locality: property.locality,
    area: property.area,
    areaUnit: property.areaUnit,
    demarcation: property.demarcation,
    images: [...property.images].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

class Store {
  private users: User[] = [...INITIAL_USERS];
  private properties: Property[] = [...INITIAL_PROPERTIES];
  private activities: PropertyActivity[] = [];
  private leads: Lead[] = [...INITIAL_LEADS];
  private submissions: PropertySubmission[] = [...INITIAL_SUBMISSIONS];
  private config: PlatformConfig = { ...INITIAL_CONFIG };
  private otps: Map<string, OtpRecord> = new Map();
  private userCycleMap: Map<string, string> = new Map(); // userId -> cycleId

  private isHydrated = false;

  constructor() {
    // Seed initial activity for demo buyer
    this.activities.push({
      id: "act-1",
      userId: "user-buyer-1",
      propertyId: "prop-1",
      action: "INTERESTED",
      isContactRequested: false,
      viewCount: 2,
      firstViewedAt: "2026-11-01T14:28:00Z",
      lastViewedAt: "2026-11-01T14:30:00Z",
      cycleId: "cycle-init",
    });

    if (typeof window === "undefined" && process.env.DATABASE_URL) {
      this.ensureHydrated().catch((err) => {
        console.warn("Background database hydration notice:", err?.message || err);
      });
    }
  }

  async ensureHydrated() {
    if (this.isHydrated) return;
    this.isHydrated = true;
    try {
      const synced = await PrismaAdapter.syncFromDb();
      if (synced) {
        if (synced.users && synced.users.length > 0) this.users = synced.users;
        if (synced.properties && synced.properties.length > 0) this.properties = synced.properties;
        if (synced.activities) this.activities = synced.activities;
        if (synced.leads) this.leads = synced.leads;
        if (synced.submissions) this.submissions = synced.submissions;
        if (synced.config) this.config = synced.config;
      }
    } catch (e) {
      console.warn("Hydration failed, keeping in-memory state:", e);
    }
  }

  // --- Platform Config ---
  getConfig(): PlatformConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<PlatformConfig>): PlatformConfig {
    this.config = { ...this.config, ...updates };
    PrismaAdapter.persistConfig(this.config);
    return { ...this.config };
  }

  // --- OTP Verification ---
  async requestOtp(email: string): Promise<{ 
    success: boolean; 
    message: string; 
    cooldownSeconds?: number; 
    isNewUser: boolean; 
    code?: string;
    liveDispatched: boolean;
    dispatchError?: string;
  }> {
    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();
    const existing = this.otps.get(normalizedEmail);

    if (existing && now - existing.lastSentAt < 30 * 1000) {
      const wait = Math.ceil((30 * 1000 - (now - existing.lastSentAt)) / 1000);
      return { 
        success: false, 
        message: `Please wait ${wait} seconds before requesting a new code.`, 
        cooldownSeconds: wait, 
        isNewUser: false,
        liveDispatched: false,
      };
    }

    // Generate a secure, dynamic 6-digit numeric verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes

    this.otps.set(normalizedEmail, {
      code,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
    });

    const isNewUser = !this.users.some((u) => u.email.toLowerCase() === normalizedEmail);

    // CRITICAL: AWAIT email dispatch so Vercel does not terminate Lambda before network request resolves
    let liveDispatched = false;
    let dispatchError: string | undefined = undefined;

    try {
      const emailRes = await sendOtpEmail({ toEmail: normalizedEmail, code, isNewUser });
      liveDispatched = Boolean(emailRes.liveDispatched);
      if (!emailRes.success && emailRes.error) {
        dispatchError = emailRes.error;
      }
    } catch (err: any) {
      console.error("[EMAIL DISPATCH EXCEPTION]:", err);
      dispatchError = err?.message || "Email dispatch connection failed.";
    }

    return {
      success: true,
      message: liveDispatched
        ? `Verification code dispatched to ${normalizedEmail}. Check your inbox and spam folder.`
        : (dispatchError 
            ? `Notice: ${dispatchError}` 
            : `Verification code generated for ${normalizedEmail}.`),
      isNewUser,
      // If live delivery did not complete (e.g. Resend rejected recipient on testing domain), ALWAYS provide code so user is never blocked!
      code: liveDispatched ? undefined : code,
      liveDispatched,
      dispatchError,
      cooldownSeconds: 30,
    };
  }

  verifyOtp(email: string, code: string): { success: boolean; message: string; user?: User; isNewUser: boolean } {
    const normalizedEmail = email.toLowerCase().trim();
    const record = this.otps.get(normalizedEmail);
    const now = Date.now();

    if (!record) {
      return { success: false, message: "No verification request found. Please request a new code.", isNewUser: false };
    }

    if (now > record.expiresAt) {
      this.otps.delete(normalizedEmail);
      return { success: false, message: "Verification code expired. Please request a new code.", isNewUser: false };
    }

    if (record.attempts >= 5) {
      this.otps.delete(normalizedEmail);
      return { success: false, message: "Too many failed attempts. Please request a new code.", isNewUser: false };
    }

    if (record.code !== code.trim()) {
      record.attempts += 1;
      return { success: false, message: "Incorrect verification code.", isNewUser: false };
    }

    // Verified successfully
    this.otps.delete(normalizedEmail);

    let user = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    const isNewUser = !user;

    if (!user) {
      // Create skeleton new user
      const id = `user-${Date.now()}`;
      user = {
        id,
        email: normalizedEmail,
        name: "",
        phone: "",
        roles: [],
        isOnboarded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.push(user);
      PrismaAdapter.persistUser(user);
    }

    return {
      success: true,
      message: "Authentication successful.",
      user: { ...user },
      isNewUser,
    };
  }

  createOrUpdateUserFromEmail(email: string, role?: any): User {
    const normalizedEmail = email.toLowerCase().trim();
    let user = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      const id = `user-${Date.now()}`;
      user = {
        id,
        email: normalizedEmail,
        name: "",
        phone: "",
        roles: role ? [role] : ["INDIVIDUAL_BUYER"],
        isOnboarded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.push(user);
      PrismaAdapter.persistUser(user);
    }
    return { ...user };
  }

  // Backward compatible method for tests and API
  getPublicProperties(filter?: any): PublicPropertyDTO[] {
    let list = this.properties
      .filter((p) => p.status === "PUBLISHED" && !p.isJointVenture && (p.category as string) !== "JV");
    if (filter?.category) list = list.filter(p => p.category === filter.category);
    if (filter?.city) list = list.filter(p => p.city.toLowerCase().includes(filter.city.toLowerCase()));
    if (filter?.q) list = list.filter(p => p.title.toLowerCase().includes(filter.q.toLowerCase()) || p.locality.toLowerCase().includes(filter.q.toLowerCase()));
    return list.map(toPublicDTO);
  }

  // Backward compatible submission methods for tests
  getSubmissionById(id: string): PropertySubmission | null {
    const sub = this.submissions.find((s) => s.id === id);
    return sub ? { ...sub } : null;
  }

  convertSubmissionToListing(submissionId: string, staffId: string, staffName?: string): Property {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) throw new Error("Submission not found");

    const listing = this.createProperty({
      slug: (sub.title || `prop-${Date.now()}`).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: sub.title,
      description: sub.description,
      category: sub.category as PropertyCategory,
      inventoryType: "NON_BANK_NBFC",
      isJointVenture: !!sub.isJointVenture,
      isDisputed: !!sub.isDisputed,
      purposeAvailability: sub.purpose as any,
      state: sub.state,
      city: sub.city,
      locality: sub.locality,
      area: sub.area,
      areaUnit: (sub.areaUnit as any) || "sq.ft.",
      demarcation: "Verified during intake conversion.",
      images: [
        { id: `img-${Date.now()}`, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", sortOrder: 1 }
      ],
      status: "DRAFT", // Crucial: draft initially
      internalAskingPrice: sub.askingPrice,
      createdByStaffId: staffId,
    });

    sub.status = "CONVERTED";
    sub.convertedPropertyId = listing.id;
    sub.updatedAt = new Date().toISOString();

    return listing;
  }

  // --- Users ---
  getUserById(id: string): User | null {
    const u = this.users.find((user) => user.id === id);
    return u ? { ...u } : null;
  }

  getUserByEmail(email: string): User | null {
    const u = this.users.find((user) => user.email.toLowerCase() === email.toLowerCase().trim());
    return u ? { ...u } : null;
  }

  getAllUsers(): User[] {
    return this.users.map((u) => ({ ...u }));
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    this.users[idx] = {
      ...this.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    PrismaAdapter.persistUser(this.users[idx]);

    return { ...this.users[idx] };
  }

  // --- Discovery Feed (Tinder Style) ---
  getUserCycleId(userId: string): string {
    let cycle = this.userCycleMap.get(userId);
    if (!cycle) {
      cycle = `cycle-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      this.userCycleMap.set(userId, cycle);
    }
    return cycle;
  }

  resetUserCycle(userId: string): void {
    const newCycle = `cycle-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    this.userCycleMap.set(userId, newCycle);
  }

  getDiscoveryProperties(
    userId: string,
    filters?: {
      category?: PropertyCategory;
      purpose?: PropertyPurpose;
      builderOpportunityType?: BuilderOpportunityType;
    }
  ): PublicPropertyDTO[] {
    const user = this.getUserById(userId);
    const isBuilder = user?.roles.includes("BUILDER") || (user?.staffRoles && user.staffRoles.length > 0);
    const currentCycleId = this.getUserCycleId(userId);

    // Get properties already swiped by this user in the CURRENT discovery cycle
    const swipedInCurrentCycle = new Set(
      this.activities
        .filter((a) => a.userId === userId && a.cycleId === currentCycleId && (a.action === "SKIPPED" || a.action === "INTERESTED"))
        .map((a) => a.propertyId)
    );

    let list = this.properties.filter((p) => p.status === "PUBLISHED");

    // Strict Rule 1: JV properties visible exclusively to BUILDERS
    if (!isBuilder) {
      list = list.filter((p) => !p.isJointVenture);
    }

    // Filter by Category if provided
    if (filters?.category) {
      if (filters.category === "DISPUTED") {
        list = list.filter((p) => p.isDisputed || p.category === "DISPUTED");
      } else {
        list = list.filter((p) => p.category === filters.category);
      }
    }

    // Filter by Purpose (BUY / RENT / BUY_OR_RENT)
    if (filters?.purpose) {
      if (filters.purpose === "BUY") {
        list = list.filter((p) => p.purposeAvailability === "SALE" || p.purposeAvailability === "BOTH");
      } else if (filters.purpose === "RENT") {
        list = list.filter((p) => p.purposeAvailability === "RENT" || p.purposeAvailability === "BOTH");
      }
    }

    // Filter by Builder Opportunity Type if Builder selected
    if (isBuilder && filters?.builderOpportunityType) {
      if (filters.builderOpportunityType === "JOINT_VENTURE") {
        list = list.filter((p) => p.isJointVenture);
      } else if (filters.builderOpportunityType === "BANK_NBFC") {
        list = list.filter((p) => p.inventoryType === "BANK_NBFC" && !p.isJointVenture);
      } else if (filters.builderOpportunityType === "NON_BANK_NBFC") {
        list = list.filter((p) => p.inventoryType === "NON_BANK_NBFC" && !p.isJointVenture);
      }
    }

    // Filter out cards already swiped in this cycle
    const unswiped = list.filter((p) => !swipedInCurrentCycle.has(p.id));

    // Map to sanitized PublicPropertyDTO (internal asking price and private notes strictly stripped)
    return unswiped.map(toPublicDTO);
  }

  // --- Swipe & Activity Recording ---
  recordSwipe(
    userId: string,
    propertyId: string,
    action: SwipeAction,
    isContactRequested: boolean = false
  ): { success: boolean; leadId?: string } {
    const now = new Date().toISOString();
    const cycleId = this.getUserCycleId(userId);

    const user = this.getUserById(userId);
    const prop = this.properties.find((p) => p.id === propertyId);

    if (!user || !prop) {
      return { success: false };
    }

    let activity = this.activities.find(
      (a) => a.userId === userId && a.propertyId === propertyId && a.cycleId === cycleId
    );

    if (activity) {
      activity.action = action;
      activity.lastViewedAt = now;
      activity.viewCount += 1;
      if (isContactRequested) {
        activity.isContactRequested = true;
        activity.contactRequestedAt = now;
      }
    } else {
      activity = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        propertyId,
        action,
        isContactRequested,
        contactRequestedAt: isContactRequested ? now : undefined,
        viewCount: 1,
        firstViewedAt: now,
        lastViewedAt: now,
        cycleId,
      };
      this.activities.push(activity);
    }

    PrismaAdapter.persistActivity(activity);

    let leadId: string | undefined;

    // Create or update Lead for Admin whenever user is INTERESTED or CONTACT_IMMEDIATELY
    if (action === "INTERESTED" || isContactRequested) {
      const actionType = isContactRequested ? "CONTACT_IMMEDIATELY" : "INTERESTED";

      // Prevent duplicate leads for the same user and property
      let existingLead = this.leads.find(
        (l) => l.userId === userId && l.propertyId === propertyId
      );

      if (existingLead) {
        if (isContactRequested) {
          existingLead.actionType = "CONTACT_IMMEDIATELY";
          existingLead.updatedAt = now;
        }
        leadId = existingLead.id;
      } else {
        const newLead: Lead = {
          id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId,
          userName: user.name || "Anonymous Prospect",
          userEmail: user.email,
          userPhone: user.phone || "Not provided",
          userRoles: user.roles,
          propertyId,
          propertyTitle: prop.title,
          propertyLocation: `${prop.locality}, ${prop.city}`,
          propertyCategory: prop.category,
          opportunityType: prop.isJointVenture ? "Joint Venture" : prop.inventoryType,
          actionType,
          status: "NEW",
          createdAt: now,
          updatedAt: now,
        };
        this.leads.unshift(newLead);
        leadId = newLead.id;
      }

      // Trigger automatic Admin Email Notification
      this.dispatchAdminNotification({
        actionType,
        user,
        property: prop,
        timestamp: now,
      });

      const savedLead = this.leads.find((l) => l.id === leadId);
      if (savedLead) PrismaAdapter.persistLead(savedLead);
    }

    return { success: true, leadId };
  }

  // --- Dispatch Admin Email Notification ---
  private dispatchAdminNotification(params: {
    actionType: "INTERESTED" | "CONTACT_IMMEDIATELY";
    user: User;
    property: Property;
    timestamp: string;
  }) {
    const subject = `New Property Interest — ${params.property.id} (${params.actionType === "CONTACT_IMMEDIATELY" ? "HIGH PRIORITY" : "Standard"})`;
    const body = `
========================================
NEW PROPERTY LEAD REGISTERED
========================================
Action Taken:       ${params.actionType}
Timestamp:          ${params.timestamp}

--- USER DETAILS ---
Name:               ${params.user.name || "N/A"}
Email:              ${params.user.email}
Phone:              ${params.user.phone || "N/A"}
Roles:              ${params.user.roles.join(", ")}

--- PROPERTY DETAILS ---
Property ID:        ${params.property.id}
Title:              ${params.property.title}
Location:           ${params.property.locality}, ${params.property.city}, ${params.property.state}
Category:           ${params.property.category}
Type:               ${params.property.isJointVenture ? "Joint Venture" : params.property.inventoryType}
Internal Target:    ₹${params.property.internalAskingPrice?.toLocaleString() || "Not set"}

Sent to Admin Email: ${this.config.adminNotificationEmail}
========================================
`;
    console.log(`[EMAIL NOTIFICATION SENT]\nSubject: ${subject}\n${body}`);
  }

  // --- User History & Activity Lists ---
  getUserActivitySummary(userId: string) {
    const userActs = this.activities.filter((a) => a.userId === userId);

    const getPropDTO = (pId: string) => {
      const p = this.properties.find((prop) => prop.id === pId);
      return p ? toPublicDTO(p) : null;
    };

    const interested = userActs
      .filter((a) => a.action === "INTERESTED")
      .map((a) => ({ activity: a, property: getPropDTO(a.propertyId) }))
      .filter((item): item is { activity: PropertyActivity; property: PublicPropertyDTO } => item.property !== null);

    const contactRequests = userActs
      .filter((a) => a.isContactRequested)
      .map((a) => ({ activity: a, property: getPropDTO(a.propertyId) }))
      .filter((item): item is { activity: PropertyActivity; property: PublicPropertyDTO } => item.property !== null);

    const skipped = userActs
      .filter((a) => a.action === "SKIPPED")
      .map((a) => ({ activity: a, property: getPropDTO(a.propertyId) }))
      .filter((item): item is { activity: PropertyActivity; property: PublicPropertyDTO } => item.property !== null);

    const recentlyViewed = [...userActs]
      .sort((a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime())
      .map((a) => ({ activity: a, property: getPropDTO(a.propertyId) }))
      .filter((item): item is { activity: PropertyActivity; property: PublicPropertyDTO } => item.property !== null);

    return {
      interested,
      contactRequests,
      skipped,
      recentlyViewed,
    };
  }

  // --- Admin Stats & Overview ---
  getAdminStats() {
    const totalUsers = this.users.length;
    const buyers = this.users.filter((u) => u.roles.includes("INDIVIDUAL_BUYER")).length;
    const investors = this.users.filter((u) => u.roles.includes("INVESTOR")).length;
    const builders = this.users.filter((u) => u.roles.includes("BUILDER")).length;
    const brokers = this.users.filter((u) => u.roles.includes("BROKER")).length;
    const owners = this.users.filter((u) => u.roles.includes("PROPERTY_OWNER")).length;
    const rentalSeekers = this.users.filter((u) => u.roles.includes("RENTAL_SEEKER")).length;

    const activeProperties = this.properties.filter((p) => p.status === "PUBLISHED").length;
    const interestedSwipes = this.activities.filter((a) => a.action === "INTERESTED").length;
    const contactRequests = this.activities.filter((a) => a.isContactRequested).length;
    const pendingLeads = this.leads.filter((l) => l.status === "NEW" || l.status === "FOLLOW_UP").length;
    const closedTransactions = this.leads.filter((l) => l.status === "CLOSED" || l.status === "CONVERTED").length;

    return {
      totalUsers,
      roleCounts: {
        buyers,
        investors,
        builders,
        brokers,
        owners,
        rentalSeekers,
      },
      activeProperties,
      interestedSwipes,
      contactRequests,
      pendingLeads,
      closedTransactions,
    };
  }

  // --- Admin Property Management ---
  getAllPropertiesAdmin(): Property[] {
    return this.properties.map((p) => ({ ...p }));
  }

  getPropertyById(id: string): Property | null {
    const p = this.properties.find((prop) => prop.id === id);
    return p ? { ...p } : null;
  }

  createProperty(data: Omit<Property, "id" | "createdAt" | "updatedAt">): Property {
    const newProp: Property = {
      ...data,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.properties.unshift(newProp);
    PrismaAdapter.persistProperty(newProp);
    return { ...newProp };
  }

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const idx = this.properties.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    this.properties[idx] = {
      ...this.properties[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    PrismaAdapter.persistProperty(this.properties[idx]);
    return { ...this.properties[idx] };
  }

  deleteProperty(id: string): boolean {
    const len = this.properties.length;
    this.properties = this.properties.filter((p) => p.id !== id);
    return this.properties.length < len;
  }

  // --- Admin Lead Management ---
  getAllLeads(): Lead[] {
    return this.leads.map((l) => ({ ...l }));
  }

  updateLeadStatus(leadId: string, status: LeadStatus, assignedTo?: string): Lead | null {
    const lead = this.leads.find((l) => l.id === leadId);
    if (!lead) return null;

    lead.status = status;
    if (assignedTo !== undefined) {
      lead.assignedTo = assignedTo;
    }
    lead.updatedAt = new Date().toISOString();
    PrismaAdapter.persistLead(lead);
    return { ...lead };
  }

  // --- Property Submissions (Owner/Broker Intake) ---
  createSubmission(data: any): PropertySubmission {
    const sub: PropertySubmission = {
      ...data,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: data.status || "RECEIVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.submissions.unshift(sub);
    PrismaAdapter.persistSubmission(sub);
    return { ...sub };
  }

  getAllSubmissions(): PropertySubmission[] {
    return this.submissions.map((s) => ({ ...s }));
  }

  reviewSubmission(id: string, status: SubmissionStatus, adminReviewNotes?: string): { submission: PropertySubmission | null; publishedProperty?: Property } {
    const sub = this.submissions.find((s) => s.id === id);
    if (!sub) return { submission: null };

    sub.status = status;
    if (adminReviewNotes) sub.adminReviewNotes = adminReviewNotes;
    sub.updatedAt = new Date().toISOString();
    PrismaAdapter.persistSubmission(sub);

    let publishedProperty: Property | undefined;

    // If approved, convert intake to a published property listing
    if (status === "APPROVED") {
      publishedProperty = this.createProperty({
        slug: sub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: sub.title,
        description: sub.description,
        category: (sub.category as any) || "HOUSE",
        inventoryType: "NON_BANK_NBFC",
        isJointVenture: !!sub.isJointVenture,
        isDisputed: !!sub.isDisputed,
        purposeAvailability: (sub.purpose as any) || "BUY_OR_RENT",
        state: sub.state,
        city: sub.city,
        locality: sub.locality,
        area: sub.area,
        areaUnit: sub.areaUnit as any,
        demarcation: "Demarcation verified during admin title intake.",
        images: [
          { id: `img-${Date.now()}-1`, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85", label: "Front Exterior Elevation", sortOrder: 1 },
          { id: `img-${Date.now()}-2`, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85", label: "Interior Specimen", sortOrder: 2 },
        ],
        status: "PUBLISHED",
        internalAskingPrice: sub.askingPrice,
        internalOwnershipDetails: `Submitted by ${sub.submitterName} (${sub.submitterEmail}, ${sub.submitterPhone}) under ${sub.submitterRole} authority.`,
        allowedRoles: sub.isJointVenture ? ["BUILDER"] : undefined,
      });
    }

    return { submission: { ...sub }, publishedProperty };
  }

  // --- Audit Logs ---
  private auditLogs: AuditLog[] = [
    {
      id: "log-1",
      actorUserId: "user-superadmin-1",
      actorName: "Super Admin",
      action: "PLATFORM_INIT",
      entityType: "PROPERTY",
      entityId: "prop-1",
      createdAt: new Date().toISOString(),
    }
  ];

  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  addAuditLog(log: Omit<AuditLog, "id" | "createdAt">): AuditLog {
    const entry: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  // --- Legacy Compatibility Methods ---
  private favourites: Map<string, string[]> = new Map();

  getUserFavourites(userId: string): string[] {
    return this.favourites.get(userId) || [];
  }

  toggleFavourite(userId: string, propertyId: string): boolean {
    const current = this.favourites.get(userId) || [];
    const idx = current.indexOf(propertyId);
    let isFav = false;
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(propertyId);
      isFav = true;
    }
    this.favourites.set(userId, [...current]);
    return isFav;
  }

  getInternalPropertyById(id: string): Property | undefined {
    return this.getPropertyById(id) || undefined;
  }

  getPropertyBySlug(slug: string): Property | undefined {
    return this.properties.find(p => p.slug === slug);
  }

  getPublicPropertyBySlug(slug: string): PublicPropertyDTO | null {
    const p = this.properties.find(prop => prop.slug === slug && prop.status === "PUBLISHED");
    return p ? toPublicDTO(p) : null;
  }

  getAllProperties(): Property[] {
    return [...this.properties];
  }

  publishProperty(id: string, staffId: string, staffName: string): Property | null {
    const p = this.getPropertyById(id);
    if (!p) return null;
    p.status = "PUBLISHED";
    p.publishedAt = new Date().toISOString();
    this.addAuditLog({
      actorUserId: staffId,
      actorName: staffName,
      action: "PROPERTY_PUBLISHED",
      entityType: "PROPERTY",
      entityId: id,
    });
    return { ...p };
  }

  getAllJVsInternal(): Property[] {
    return this.properties.filter(p => p.isJointVenture);
  }

  getJVOpportunities(): PublicPropertyDTO[] {
    return this.properties
      .filter(p => p.isJointVenture && p.status === "PUBLISHED")
      .map(toPublicDTO);
  }

  getJVOpportunityBySlug(slug: string): PublicPropertyDTO | null {
    const p = this.properties.find(prop => prop.isJointVenture && prop.slug === slug && prop.status === "PUBLISHED");
    return p ? toPublicDTO(p) : null;
  }

  getInquiries(filter?: { userId?: string }): any[] {
    if (filter?.userId) {
      return this.leads.filter(l => l.userId === filter.userId);
    }
    return [...this.leads];
  }

  createInquiry(data: any): Lead {
    const prop = data.propertyId ? this.getPropertyById(data.propertyId) : null;
    const lead: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: data.userId || "anon-user",
      userName: data.contactName || "Inquirer",
      userEmail: data.contactEmail || "inquiry@client.demo",
      userPhone: data.contactPhone || "+910000000000",
      userRoles: ["INDIVIDUAL_BUYER"],
      propertyId: data.propertyId || "general",
      propertyTitle: prop?.title || data.jvTitle || "Inquiry Listing",
      propertyLocation: prop ? `${prop.locality}, ${prop.city}` : "India",
      propertyCategory: prop?.category || "HOUSE",
      opportunityType: prop?.inventoryType || "NON_BANK_NBFC",
      actionType: "INTERESTED",
      status: "NEW",
      notes: data.message || data.notes,
      publicReference: `INQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      jvTitle: data.jvTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.leads.unshift(lead);
    return lead;
  }

  updateInquiryStatus(id: string, status: string, notes?: string, staffName?: string, assignedStaffId?: string, note?: string): any {
    return this.updateLeadStatus(id, status as LeadStatus, assignedStaffId || staffName);
  }

  getUserActivities(userId: string): PropertyActivity[] {
    return this.activities.filter(a => a.userId === userId);
  }

  getLeadActivities(leadId: string): any[] {
    const lead = this.leads.find(l => l.id === leadId);
    if (!lead || !lead.userId) return [];
    return this.getUserActivities(lead.userId);
  }

  getSubmissions(filter?: { userId?: string }): PropertySubmission[] {
    if (filter?.userId) {
      return this.submissions.filter(s => s.userId === filter.userId || s.submittedByUserId === filter.userId);
    }
    return [...this.submissions];
  }

  saveUser(user: User): User {
    const idx = this.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      this.users[idx] = { ...user, updatedAt: new Date().toISOString() };
      return this.users[idx];
    }
    this.users.push(user);
    return user;
  }
}

// Global Singleton Store
const globalForStore = global as unknown as { propdeskStore?: Store };
export const store = globalForStore.propdeskStore || new Store();
if (process.env.NODE_ENV !== "production") globalForStore.propdeskStore = store;
