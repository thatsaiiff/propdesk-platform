import { prisma, isDbActive } from "./prisma";
import {
  User,
  Property,
  PropertyActivity,
  Lead,
  PropertySubmission,
  PlatformConfig,
  AuditLog,
} from "@/types";

export class PrismaAdapter {
  private static initialized = false;

  /**
   * Hydrates in-memory store from Prisma DB on cold start,
   * or seeds the DB if it is empty.
   */
  static async syncFromDb(): Promise<{
    users?: User[];
    properties?: Property[];
    activities?: PropertyActivity[];
    leads?: Lead[];
    submissions?: PropertySubmission[];
    config?: PlatformConfig;
  } | null> {
    if (!isDbActive() || !prisma) return null;

    try {
      // Check if DB is initialized
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        const { seedDatabase } = await import("./seed");
        await seedDatabase();
      }

      // Fetch all records
      const [dbUsers, dbProperties, dbActivities, dbLeads, dbSubmissions, dbConfig] =
        await Promise.all([
          prisma.user.findMany(),
          prisma.property.findMany({ include: { images: true } }),
          prisma.propertyActivity.findMany(),
          prisma.lead.findMany(),
          prisma.propertySubmission.findMany(),
          prisma.platformConfig.findFirst({ where: { id: "default" } }),
        ]);

      const users: User[] = dbUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone || undefined,
        activeRole: u.activeRole || undefined,
        status: u.status,
        roles: JSON.parse(u.roles || "[]"),
        staffRoles: u.staffRoles ? JSON.parse(u.staffRoles) : undefined,
        isOnboarded: u.isOnboarded,
        preferences: u.preferences ? JSON.parse(u.preferences) : undefined,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      }));

      const properties: Property[] = dbProperties.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        category: p.category as any,
        subtype: p.subtype || undefined,
        transactionType: p.transactionType || undefined,
        inventoryType: p.inventoryType as any,
        isJointVenture: p.isJointVenture,
        isDisputed: p.isDisputed,
        purposeAvailability: p.purposeAvailability as any,
        visibility: p.visibility as any,
        state: p.state,
        city: p.city,
        locality: p.locality,
        pincode: p.pincode || undefined,
        area: p.area,
        areaUnit: p.areaUnit,
        demarcation: p.demarcation,
        builtUpArea: p.builtUpArea || undefined,
        carpetArea: p.carpetArea || undefined,
        plotArea: p.plotArea || undefined,
        bedrooms: p.bedrooms || undefined,
        bathrooms: p.bathrooms || undefined,
        balconies: p.balconies || undefined,
        floorNumber: p.floorNumber || undefined,
        totalFloors: p.totalFloors || undefined,
        furnishing: p.furnishing || undefined,
        facing: p.facing || undefined,
        parkingCount: p.parkingCount || undefined,
        ageOfProperty: p.ageOfProperty || undefined,
        amenities: p.amenities ? JSON.parse(p.amenities) : [],
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          label: img.label || undefined,
          sortOrder: img.sortOrder,
          altText: img.altText || undefined,
          isCover: img.isCover,
        })),
        status: p.status as any,
        internalAskingPrice: p.internalAskingPrice || undefined,
        privateSalePrice: p.privateSalePrice || undefined,
        privateRentAmount: p.privateRentAmount || undefined,
        privateDeposit: p.privateDeposit || undefined,
        priceNegotiable: p.priceNegotiable || false,
        internalNotes: p.internalNotes || undefined,
        internalOwnershipDetails: p.internalOwnershipDetails || undefined,
        ownerContactName: p.ownerContactName || undefined,
        ownerContactPhone: p.ownerContactPhone || undefined,
        createdByStaffId: p.createdByStaffId || undefined,
        allowedRoles: p.allowedRoles ? JSON.parse(p.allowedRoles) : undefined,
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : undefined,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));

      const activities: PropertyActivity[] = dbActivities.map((a) => ({
        id: a.id,
        userId: a.userId,
        propertyId: a.propertyId,
        action: a.action as any,
        isContactRequested: a.isContactRequested,
        contactRequestedAt: a.contactRequestedAt ? a.contactRequestedAt.toISOString() : undefined,
        viewCount: a.viewCount,
        cycleId: a.cycleId,
        firstViewedAt: a.firstViewedAt.toISOString(),
        lastViewedAt: a.lastViewedAt.toISOString(),
      }));

      const leads: Lead[] = dbLeads.map((l) => ({
        id: l.id,
        userId: l.userId,
        userName: l.userName,
        userEmail: l.userEmail,
        userPhone: l.userPhone,
        userRoles: JSON.parse(l.userRoles || "[]"),
        propertyId: l.propertyId,
        propertyTitle: l.propertyTitle,
        propertyLocation: l.propertyLocation,
        propertyCategory: l.propertyCategory as any,
        opportunityType: l.opportunityType || undefined,
        actionType: l.actionType as any,
        status: l.status as any,
        assignedTo: l.assignedTo || undefined,
        notes: l.notes || undefined,
        publicReference: l.publicReference || undefined,
        jvTitle: l.jvTitle || undefined,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }));

      const submissions: PropertySubmission[] = dbSubmissions.map((s) => ({
        id: s.id,
        userId: s.userId || undefined,
        submittedByUserId: s.submittedByUserId || undefined,
        submitterName: s.submitterName,
        submitterEmail: s.submitterEmail,
        submitterPhone: s.submitterPhone,
        submitterRole: s.submitterRole,
        relationshipToProperty: s.relationshipToProperty || undefined,
        category: s.category as any,
        subtype: s.subtype || undefined,
        transactionType: s.transactionType || undefined,
        purpose: (s.purpose as any) || "BUY_OR_RENT",
        title: s.title,
        description: s.description,
        city: s.city,
        state: s.state,
        locality: s.locality,
        area: s.area,
        areaUnit: s.areaUnit,
        askingPrice: s.askingPrice || undefined,
        expectedPriceOrRent: s.expectedPriceOrRent || undefined,
        contactPreference: s.contactPreference || undefined,
        isJointVenture: s.isJointVenture,
        isDisputed: s.isDisputed,
        status: s.status as any,
        convertedPropertyId: s.convertedPropertyId || undefined,
        adminReviewNotes: s.adminReviewNotes || undefined,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      }));

      const config: PlatformConfig = dbConfig
        ? {
            pricePromiseText: dbConfig.pricePromiseText,
            adminNotificationEmail: dbConfig.adminNotificationEmail,
            commissionRatePercent: 2.0,
          }
        : {
            pricePromiseText:
              "If you find the same property available at a lower verified price elsewhere, show us the proof. We promise to pay you 10% extra and buy the property.",
            adminNotificationEmail: "admin@propdesk.demo",
            commissionRatePercent: 2.0,
          };

      this.initialized = true;
      return { users, properties, activities, leads, submissions, config };
    } catch (err) {
      console.warn("Failed to synchronize with PostgreSQL database:", err);
      return null;
    }
  }

  // --- WRITE THROUGH MUTATIONS ---

  static async persistUser(user: User) {
    if (!isDbActive() || !prisma) return;
    try {
      await prisma.user.upsert({
        where: { email: user.email.toLowerCase().trim() },
        update: {
          name: user.name,
          phone: user.phone || null,
          activeRole: user.activeRole || null,
          status: user.status || "ACTIVE",
          roles: JSON.stringify(user.roles),
          staffRoles: user.staffRoles ? JSON.stringify(user.staffRoles) : null,
          isOnboarded: user.isOnboarded ?? false,
          preferences: user.preferences ? JSON.stringify(user.preferences) : null,
        },
        create: {
          id: user.id,
          email: user.email.toLowerCase().trim(),
          name: user.name,
          phone: user.phone || null,
          activeRole: user.activeRole || null,
          status: user.status || "ACTIVE",
          roles: JSON.stringify(user.roles),
          staffRoles: user.staffRoles ? JSON.stringify(user.staffRoles) : null,
          isOnboarded: user.isOnboarded ?? false,
          preferences: user.preferences ? JSON.stringify(user.preferences) : null,
          createdAt: new Date(user.createdAt),
        },
      });
    } catch (e) {
      console.warn("Database persistUser failed:", e);
    }
  }

  static async persistProperty(prop: Property) {
    if (!isDbActive() || !prisma) return;
    try {
      await prisma.property.upsert({
        where: { id: prop.id },
        update: {
          slug: prop.slug,
          title: prop.title,
          description: prop.description,
          category: prop.category,
          inventoryType: prop.inventoryType,
          isJointVenture: prop.isJointVenture,
          isDisputed: prop.isDisputed,
          purposeAvailability: prop.purposeAvailability,
          visibility: prop.visibility || "PUBLIC",
          state: prop.state,
          city: prop.city,
          locality: prop.locality,
          pincode: prop.pincode || null,
          area: prop.area,
          areaUnit: prop.areaUnit,
          demarcation: prop.demarcation,
          status: prop.status,
          internalAskingPrice: prop.internalAskingPrice || null,
          internalNotes: prop.internalNotes || null,
          internalOwnershipDetails: prop.internalOwnershipDetails || null,
        },
        create: {
          id: prop.id,
          slug: prop.slug,
          title: prop.title,
          description: prop.description,
          category: prop.category,
          inventoryType: prop.inventoryType,
          isJointVenture: prop.isJointVenture,
          isDisputed: prop.isDisputed,
          purposeAvailability: prop.purposeAvailability,
          visibility: prop.visibility || "PUBLIC",
          state: prop.state,
          city: prop.city,
          locality: prop.locality,
          pincode: prop.pincode || null,
          area: prop.area,
          areaUnit: prop.areaUnit,
          demarcation: prop.demarcation,
          status: prop.status,
          internalAskingPrice: prop.internalAskingPrice || null,
          internalNotes: prop.internalNotes || null,
          internalOwnershipDetails: prop.internalOwnershipDetails || null,
          createdAt: new Date(prop.createdAt),
        },
      });

      // Images
      if (prop.images && prop.images.length > 0) {
        const activeIds = prop.images.map((i) => i.id);
        await prisma.propertyImage.deleteMany({
          where: {
            propertyId: prop.id,
            id: { notIn: activeIds },
          },
        }).catch(() => {});

        for (const img of prop.images) {
          await prisma.propertyImage.upsert({
            where: { id: img.id },
            update: {
              propertyId: prop.id,
              url: img.url,
              label: img.label || null,
              sortOrder: img.sortOrder,
            },
            create: {
              id: img.id,
              propertyId: prop.id,
              url: img.url,
              label: img.label || null,
              sortOrder: img.sortOrder,
              isCover: img.isCover || false,
            },
          });
        }
      }
    } catch (e) {
      console.warn("Database persistProperty failed:", e);
    }
  }

  static async deleteProperty(propertyId: string) {
    if (!isDbActive() || !prisma) return;
    try {
      await prisma.property.delete({
        where: { id: propertyId },
      });
    } catch (e) {
      console.warn("Database deleteProperty failed:", e);
    }
  }

  static async persistActivity(act: PropertyActivity) {
    if (!isDbActive() || !prisma) return;
    try {
      await prisma.propertyActivity.upsert({
        where: {
          userId_propertyId_cycleId: {
            userId: act.userId,
            propertyId: act.propertyId,
            cycleId: act.cycleId,
          },
        },
        update: {
          action: act.action,
          isContactRequested: act.isContactRequested,
          contactRequestedAt: act.contactRequestedAt ? new Date(act.contactRequestedAt) : null,
          viewCount: act.viewCount,
          lastViewedAt: new Date(act.lastViewedAt),
        },
        create: {
          id: act.id,
          userId: act.userId,
          propertyId: act.propertyId,
          action: act.action,
          isContactRequested: act.isContactRequested,
          contactRequestedAt: act.contactRequestedAt ? new Date(act.contactRequestedAt) : null,
          viewCount: act.viewCount,
          cycleId: act.cycleId,
          firstViewedAt: new Date(act.firstViewedAt),
          lastViewedAt: new Date(act.lastViewedAt),
        },
      });
    } catch (e) {
      console.warn("Database persistActivity failed:", e);
    }
  }

  static async persistLead(lead: Lead) {
    if (!isDbActive() || !prisma) return;
    try {
      await prisma.lead.upsert({
        where: { id: lead.id },
        update: {
          status: lead.status,
          assignedTo: lead.assignedTo || null,
          notes: lead.notes || null,
        },
        create: {
          id: lead.id,
          userId: lead.userId,
          userName: lead.userName,
          userEmail: lead.userEmail,
          userPhone: lead.userPhone,
          userRoles: JSON.stringify(lead.userRoles),
          propertyId: lead.propertyId,
          propertyTitle: lead.propertyTitle,
          propertyLocation: lead.propertyLocation,
          propertyCategory: lead.propertyCategory,
          opportunityType: lead.opportunityType || null,
          actionType: lead.actionType,
          status: lead.status,
          assignedTo: lead.assignedTo || null,
          notes: lead.notes || null,
          publicReference: lead.publicReference || null,
          jvTitle: lead.jvTitle || null,
          createdAt: new Date(lead.createdAt),
        },
      });
    } catch (e) {
      console.warn("Database persistLead failed:", e);
    }
  }

  static async persistSubmission(sub: PropertySubmission) {
    if (!isDbActive() || !prisma) return;
    try {
      await prisma.propertySubmission.upsert({
        where: { id: sub.id },
        update: {
          status: sub.status,
          adminReviewNotes: sub.adminReviewNotes || null,
          convertedPropertyId: sub.convertedPropertyId || null,
        },
        create: {
          id: sub.id,
          userId: sub.userId || null,
          submitterName: sub.submitterName,
          submitterEmail: sub.submitterEmail,
          submitterPhone: sub.submitterPhone,
          submitterRole: sub.submitterRole,
          category: sub.category,
          purpose: sub.purpose || "BUY_OR_RENT",
          title: sub.title,
          description: sub.description,
          city: sub.city,
          state: sub.state,
          locality: sub.locality,
          area: sub.area,
          areaUnit: sub.areaUnit,
          askingPrice: sub.askingPrice || null,
          isJointVenture: sub.isJointVenture || false,
          isDisputed: sub.isDisputed || false,
          status: sub.status,
          adminReviewNotes: sub.adminReviewNotes || null,
          convertedPropertyId: sub.convertedPropertyId || null,
          createdAt: new Date(sub.createdAt),
        },
      });
    } catch (e) {
      console.warn("Database persistSubmission failed:", e);
    }
  }

  static async persistConfig(config: PlatformConfig) {
    if (!isDbActive() || !prisma) return;
    try {
      await prisma.platformConfig.upsert({
        where: { id: "default" },
        update: {
          pricePromiseText: config.pricePromiseText,
          adminNotificationEmail: config.adminNotificationEmail,
        },
        create: {
          id: "default",
          pricePromiseText: config.pricePromiseText,
          adminNotificationEmail: config.adminNotificationEmail,
        },
      });
    } catch (e) {
      console.warn("Database persistConfig failed:", e);
    }
  }
}
