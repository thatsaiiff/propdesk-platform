import { PrismaClient } from "@prisma/client";
import {
  INITIAL_CONFIG,
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  INITIAL_SUBMISSIONS,
} from "../store/seedData";

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log("Seeding PropDesk database...");

  // 1. Platform Config
  await prisma.platformConfig.upsert({
    where: { id: "default" },
    update: {
      pricePromiseText: INITIAL_CONFIG.pricePromiseText,
      adminNotificationEmail: INITIAL_CONFIG.adminNotificationEmail,
    },
    create: {
      id: "default",
      pricePromiseText: INITIAL_CONFIG.pricePromiseText,
      adminNotificationEmail: INITIAL_CONFIG.adminNotificationEmail,
    },
  });

  // 2. Users
  for (const user of INITIAL_USERS) {
    await prisma.user.upsert({
      where: { email: user.email.toLowerCase().trim() },
      update: {
        name: user.name,
        phone: user.phone || null,
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
        roles: JSON.stringify(user.roles),
        staffRoles: user.staffRoles ? JSON.stringify(user.staffRoles) : null,
        isOnboarded: user.isOnboarded ?? false,
        preferences: user.preferences ? JSON.stringify(user.preferences) : null,
        createdAt: new Date(user.createdAt || Date.now()),
      },
    });
  }

  // 3. Properties & Images
  for (const prop of INITIAL_PROPERTIES) {
    const existing = await prisma.property.findUnique({
      where: { slug: prop.slug },
    });

    if (!existing) {
      const createdProp = await prisma.property.create({
        data: {
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
          internalOwnershipDetails: prop.internalOwnershipDetails || null,
          internalNotes: prop.internalNotes || null,
          allowedRoles: prop.allowedRoles ? JSON.stringify(prop.allowedRoles) : null,
          createdAt: new Date(prop.createdAt || Date.now()),
        },
      });

      // Images
      if (prop.images && prop.images.length > 0) {
        for (let i = 0; i < prop.images.length; i++) {
          const img = prop.images[i];
          await prisma.propertyImage.create({
            data: {
              id: img.id || `${createdProp.id}-img-${i + 1}`,
              propertyId: createdProp.id,
              url: img.url,
              label: img.label || null,
              sortOrder: img.sortOrder ?? i + 1,
              isCover: i === 0,
            },
          });
        }
      }
    }
  }

  // 4. Leads
  for (const lead of INITIAL_LEADS) {
    const existing = await prisma.lead.findUnique({
      where: { id: lead.id },
    });

    if (!existing) {
      await prisma.lead.create({
        data: {
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
          notes: lead.notes || null,
          createdAt: new Date(lead.createdAt || Date.now()),
        },
      });
    }
  }

  // 5. Submissions
  for (const sub of INITIAL_SUBMISSIONS) {
    const existing = await prisma.propertySubmission.findUnique({
      where: { id: sub.id },
    });

    if (!existing) {
      await prisma.propertySubmission.create({
        data: {
          id: sub.id,
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
          createdAt: new Date(sub.createdAt || Date.now()),
        },
      });
    }
  }

  console.log("Database seeded successfully.");
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
