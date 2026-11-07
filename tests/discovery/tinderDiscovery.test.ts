import { describe, it, expect, beforeEach } from "vitest";
import { store } from "@/lib/store";

describe("Tinder-Style Property Discovery & Swipe Lifecycle", () => {
  const buyerId = "user-buyer-1";
  const builderId = "user-builder-1";

  beforeEach(() => {
    store.resetUserCycle(buyerId);
    store.resetUserCycle(builderId);
  });

  it("Regular buyer only sees non-JV properties in discovery feed", () => {
    const feed = store.getDiscoveryProperties(buyerId, { purpose: "BUY" });
    expect(feed.length).toBeGreaterThan(0);

    // Strict rule: No JV properties for non-builder
    const jvItems = feed.filter((p) => p.isJointVenture);
    expect(jvItems).toHaveLength(0);
  });

  it("Builder can access exclusive Joint Venture proposals", () => {
    const builderFeed = store.getDiscoveryProperties(builderId, {
      builderOpportunityType: "JOINT_VENTURE",
    });

    expect(builderFeed.length).toBeGreaterThan(0);
    builderFeed.forEach((p) => {
      expect(p.isJointVenture).toBe(true);
    });
  });

  it("Swiping LEFT skips a property and removes it from the current discovery cycle", () => {
    const initialFeed = store.getDiscoveryProperties(buyerId);
    const targetProp = initialFeed[0];

    // Record left swipe (SKIPPED)
    const result = store.recordSwipe(buyerId, targetProp.id, "SKIPPED");
    expect(result.success).toBe(true);

    // Verify property is omitted from immediate subsequent discovery
    const updatedFeed = store.getDiscoveryProperties(buyerId);
    const found = updatedFeed.find((p) => p.id === targetProp.id);
    expect(found).toBeUndefined();

    // Verify it is recorded in user's skipped history
    const history = store.getUserActivitySummary(buyerId);
    expect(history.skipped.some((s) => s.property.id === targetProp.id)).toBe(true);
  });

  it("Swiping RIGHT registers INTEREST and creates an admin Lead without exposing private price", () => {
    const initialFeed = store.getDiscoveryProperties(buyerId);
    const targetProp = initialFeed[0];

    // Record right swipe (INTERESTED)
    const result = store.recordSwipe(buyerId, targetProp.id, "INTERESTED");
    expect(result.success).toBe(true);
    expect(result.leadId).toBeDefined();

    // Verify Lead is registered in Admin overview
    const leads = store.getAllLeads();
    const createdLead = leads.find((l) => l.id === result.leadId);
    expect(createdLead).toBeDefined();
    expect(createdLead?.actionType).toBe("INTERESTED");
    expect(createdLead?.propertyId).toBe(targetProp.id);

    // Public DTO never leaks private asking price
    expect((targetProp as any).internalAskingPrice).toBeUndefined();
    expect((targetProp as any).privateSalePrice).toBeUndefined();
  });

  it("Clicking CONTACT IMMEDIATELY creates a priority lead with contact request flag", () => {
    const initialFeed = store.getDiscoveryProperties(buyerId);
    const targetProp = initialFeed[1];

    const result = store.recordSwipe(buyerId, targetProp.id, "INTERESTED", true);
    expect(result.success).toBe(true);

    const history = store.getUserActivitySummary(buyerId);
    expect(history.contactRequests.some((c) => c.property.id === targetProp.id)).toBe(true);

    const leads = store.getAllLeads();
    const contactLead = leads.find((l) => l.id === result.leadId);
    expect(contactLead?.actionType).toBe("CONTACT_IMMEDIATELY");
  });

  it("Resetting discovery cycle restores skipped properties to the discovery feed", () => {
    const initialFeed = store.getDiscoveryProperties(buyerId);
    const targetProp = initialFeed[0];

    store.recordSwipe(buyerId, targetProp.id, "SKIPPED");
    expect(store.getDiscoveryProperties(buyerId).find((p) => p.id === targetProp.id)).toBeUndefined();

    // Reset cycle
    store.resetUserCycle(buyerId);
    const restoredFeed = store.getDiscoveryProperties(buyerId);
    expect(restoredFeed.find((p) => p.id === targetProp.id)).toBeDefined();
  });
});
