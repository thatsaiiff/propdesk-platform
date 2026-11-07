import { describe, it, expect } from "vitest";
import { isBuilderUser } from "@/lib/auth/session";
import { User } from "@/types";
import { store } from "@/lib/store";

describe("Security Test: Builder-Only Joint Venture (JV) Protection", () => {
  const buyerUser: User = {
    id: "u-buyer",
    email: "buyer@test.com",
    name: "Regular Buyer",
    activeRole: "BUYER",
    status: "ACTIVE",
    roles: ["BUYER"],
    staffRoles: [],
    createdAt: "",
    updatedAt: "",
  };

  const brokerUser: User = {
    id: "u-broker",
    email: "broker@test.com",
    name: "Broker",
    activeRole: "BROKER",
    status: "ACTIVE",
    roles: ["BROKER", "BUYER"],
    staffRoles: [],
    createdAt: "",
    updatedAt: "",
  };

  const builderUser: User = {
    id: "u-builder",
    email: "builder@test.com",
    name: "Apex Developer",
    activeRole: "BUILDER",
    status: "ACTIVE",
    roles: ["BUILDER"],
    staffRoles: [],
    createdAt: "",
    updatedAt: "",
  };

  it("denies access to JV opportunities for anonymous/null user, buyer, and broker", () => {
    expect(isBuilderUser(null)).toBe(false);
    expect(isBuilderUser(buyerUser)).toBe(false);
    expect(isBuilderUser(brokerUser)).toBe(false);
  });

  it("grants access only to users with BUILDER role", () => {
    expect(isBuilderUser(builderUser)).toBe(true);
  });

  it("JV opportunities are never returned in public property catalog search", () => {
    const publicList = store.getPublicProperties();
    // Verify no JV item is in public properties
    const jvItems = publicList.filter(p => (p.category as string) === "JV" || p.title.toLowerCase().includes("joint venture"));
    expect(jvItems).toHaveLength(0);
  });
});
