import { z } from "zod";

export const EmailOtpRequestSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email address." }),
  purpose: z.enum(["SIGN_IN", "INQUIRY"]).default("SIGN_IN"),
});

export const EmailOtpVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
});

export const UserRoleEnum = z.enum([
  "BUYER",
  "TENANT",
  "INVESTOR",
  "OWNER",
  "BROKER",
  "BUILDER"
]);

export const ActiveRoleSwitchSchema = z.object({
  role: UserRoleEnum,
});

export const UserProfileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Valid 10-digit phone number is required." }),
});

export const InquiryCreateSchema = z.object({
  propertyId: z.string().optional(),
  jvOpportunityId: z.string().optional(),
  intent: z.enum(["BUY", "RENT", "INVEST", "SELLER_SUBMISSION", "BROKER", "BUILDER", "JV"]),
  contactName: z.string().min(2, { message: "Contact name is required." }),
  contactEmail: z.string().email({ message: "Valid email is required." }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required for follow-up." }),
  message: z.string().min(5, { message: "Please enter your requirement details." }),
  answers: z.record(z.union([z.string(), z.number(), z.boolean()])).default({}),
  consentAgreed: z.boolean().refine(val => val === true, {
    message: "You must consent to being contacted regarding this property inquiry.",
  }),
  consentVersion: z.string().default("2026-v1"),
  idempotencyKey: z.string().optional(),
}).refine(data => data.propertyId || data.jvOpportunityId, {
  message: "Inquiry must be linked to either a property listing or a JV opportunity.",
});

export const PropertySubmissionCreateSchema = z.object({
  relationshipToProperty: z.enum([
    "OWNER",
    "AUTHORIZED_REPRESENTATIVE",
    "BROKER",
    "BUILDER",
    "OTHER",
  ]),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "MIXED_USE", "INDUSTRIAL", "LAND"]),
  subtype: z.string().min(2, { message: "Property subtype is required." }),
  transactionType: z.enum(["SALE", "RENT", "LEASE", "OTHER"]),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Please provide a brief description." }),
  state: z.string().min(2, { message: "State is required." }),
  city: z.string().min(2, { message: "City is required." }),
  locality: z.string().min(2, { message: "Locality is required." }),
  area: z.number().positive({ message: "Area must be greater than zero." }),
  areaUnit: z.enum(["sq.ft.", "sq.yards", "acres", "sq.meters"]),
  contactPreference: z.enum(["PHONE", "EMAIL", "WHATSAPP"]).default("PHONE"),
  expectedPriceOrRent: z.string().optional(), // Private intake notes only, not a public listing price
});

export const AdminListingCreateUpdateSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "MIXED_USE", "INDUSTRIAL", "LAND"]),
  subtype: z.string().min(2),
  transactionType: z.enum(["SALE", "RENT", "LEASE", "OTHER"]),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "PAUSED", "SOLD", "RENTED", "ARCHIVED"]),
  visibility: z.enum(["PUBLIC", "BUILDER_ONLY", "PRIVATE"]).default("PUBLIC"),
  state: z.string().min(2),
  city: z.string().min(2),
  locality: z.string().min(2),
  pincode: z.string().optional(),
  builtUpArea: z.number().optional(),
  carpetArea: z.number().optional(),
  plotArea: z.number().optional(),
  areaUnit: z.enum(["sq.ft.", "sq.yards", "acres", "sq.meters"]).default("sq.ft."),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  floorNumber: z.number().optional(),
  totalFloors: z.number().optional(),
  furnishing: z.enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"]).optional(),
  facing: z.enum(["NORTH", "SOUTH", "EAST", "WEST", "NORTH_EAST", "NORTH_WEST", "SOUTH_EAST", "SOUTH_WEST"]).optional(),
  parkingCount: z.number().optional(),
  ageOfProperty: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  media: z.array(
    z.object({
      id: z.string(),
      url: z.string().url(),
      altText: z.string(),
      isCover: z.boolean(),
      sortOrder: z.number(),
    })
  ).default([]),
  // Private Admin Price Fields
  privateSalePrice: z.number().optional(),
  privateRentAmount: z.number().optional(),
  privateDeposit: z.number().optional(),
  priceNegotiable: z.boolean().default(true),
  internalNotes: z.string().optional(),
  ownerContactName: z.string().optional(),
  ownerContactPhone: z.string().optional(),
});
