import { describe, it, expect } from "vitest";
import { store } from "@/lib/store";

describe("Business & Security Invariant: Property Submissions", () => {
  it("submission must be stored with status RECEIVED and must never appear in public listings", () => {
    const sub = store.createSubmission({
      submittedByUserId: "test-user-owner",
      submitterName: "Test Owner",
      submitterEmail: "owner@test.demo",
      submitterPhone: "+919988776655",
      submitterRole: "OWNER",
      relationshipToProperty: "OWNER",
      category: "RESIDENTIAL",
      subtype: "Independent House",
      transactionType: "SALE",
      title: "[DEMO] Test Independent Villa",
      description: "Submitting my villa for admin consideration.",
      state: "Karnataka",
      city: "Bengaluru",
      locality: "Whitefield",
      area: 3200,
      areaUnit: "sq.ft.",
      contactPreference: "PHONE",
    });

    expect(sub.id).toBeDefined();
    expect(sub.status).toBe("RECEIVED");

    // CRITICAL: Public property list must NOT contain this submitted property
    const publicProps = store.getPublicProperties();
    const found = publicProps.find(p => p.title === sub.title);
    expect(found).toBeUndefined();
  });

  it("explicit admin conversion must create a DRAFT listing and update submission status to CONVERTED", () => {
    const sub = store.createSubmission({
      submittedByUserId: "test-user-broker",
      submitterName: "Test Broker",
      submitterEmail: "broker@test.demo",
      submitterPhone: "+919988776644",
      submitterRole: "BROKER",
      relationshipToProperty: "BROKER",
      category: "COMMERCIAL",
      subtype: "Office Floor",
      transactionType: "LEASE",
      title: "[DEMO] Test Commercial Floor for Conversion",
      description: "Client mandate for commercial leasing.",
      state: "Maharashtra",
      city: "Mumbai",
      locality: "Andheri East",
      area: 6000,
      areaUnit: "sq.ft.",
      contactPreference: "EMAIL",
    });

    const listing = store.convertSubmissionToListing(sub.id, "staff-admin-id", "Admin Officer");

    expect(listing.id).toBeDefined();
    expect(listing.status).toBe("DRAFT"); // Must be draft initially

    const updatedSub = store.getSubmissionById(sub.id);
    expect(updatedSub?.status).toBe("CONVERTED");
    expect(updatedSub?.convertedPropertyId).toBe(listing.id);

    // Still not public until explicitly published
    const publicList = store.getPublicProperties();
    expect(publicList.find(p => p.id === listing.id)).toBeUndefined();
  });
});
