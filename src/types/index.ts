// Comprehensive Data Types for Premium Real Estate Discovery Platform

export type UserRole = 
  | "INDIVIDUAL_BUYER"
  | "INVESTOR"
  | "BUILDER"
  | "BROKER"
  | "PROPERTY_OWNER"
  | "RENTAL_SEEKER"
  | "BUYER"
  | "OWNER";

export type UserRoleType = UserRole;
export type StaffRoleType = "SUPER_ADMIN" | "LISTING_MANAGER" | "LEAD_MANAGER";

export type BuilderOpportunityType = 
  | "BANK_NBFC"
  | "NON_BANK_NBFC"
  | "JOINT_VENTURE";

export type PropertyCategory = 
  | "HOUSE"
  | "FLAT"
  | "PLOT"
  | "INDUSTRIAL_LAND"
  | "WAREHOUSE"
  | "FACTORY"
  | "BUILDING_WITH_LAND"
  | "DISPUTED"
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "MIXED_USE"
  | "INDUSTRIAL"
  | "LAND";

export type PropertyPurpose = 
  | "BUY"
  | "RENT"
  | "BUY_OR_RENT";

export type PurposeAvailability = 
  | "SALE"
  | "RENT"
  | "BOTH"
  | "LEASE";

export type InventoryType = 
  | "BANK_NBFC"
  | "NON_BANK_NBFC";

export type PropertyStatus = 
  | "DRAFT"
  | "PUBLISHED"
  | "PAUSED"
  | "ARCHIVED"
  | "UNDER_CONTRACT"
  | "SOLD"
  | "RENTED";

export interface PropertyImage {
  id: string;
  url: string;
  label?: string;
  sortOrder: number;
  altText?: string;
  isCover?: boolean;
}

export interface UserPreferences {
  builderOpportunityType?: BuilderOpportunityType;
  category?: PropertyCategory;
  purpose?: PropertyPurpose;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  activeRole?: string;
  status?: string;
  roles: UserRole[];
  staffRoles?: string[];
  isOnboarded?: boolean;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: PropertyCategory | string;
  subtype?: string;
  transactionType?: string;
  inventoryType: InventoryType;
  isJointVenture: boolean;
  isDisputed: boolean;
  purposeAvailability: PurposeAvailability | string;
  visibility?: "PUBLIC" | "PRIVATE" | "BUILDER_ONLY";
  state: string;
  city: string;
  locality: string;
  pincode?: string;
  area: number;
  areaUnit: string;
  builtUpArea?: number;
  carpetArea?: number;
  plotArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floorNumber?: number;
  totalFloors?: number;
  furnishing?: string;
  facing?: string;
  parkingCount?: number;
  ageOfProperty?: string;
  amenities?: string[];
  demarcation: string;
  images: PropertyImage[];
  media?: PropertyImage[];
  status: PropertyStatus;
  
  // Confidential Private Fields - NEVER visible to public
  internalAskingPrice?: number;
  privateSalePrice?: number;
  privateRentAmount?: number;
  privateDeposit?: number;
  priceNegotiable?: boolean;
  internalNotes?: string;
  internalOwnershipDetails?: string;
  ownerContactName?: string;
  ownerContactPhone?: string;
  createdByStaffId?: string;
  allowedRoles?: UserRole[];
  
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InternalPropertyListing = Property;

export interface PublicPropertyDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: PropertyCategory | string;
  subtype?: string;
  transactionType?: string;
  inventoryType?: InventoryType;
  isJointVenture?: boolean;
  isDisputed?: boolean;
  purposeAvailability?: PurposeAvailability | string;
  state: string;
  city: string;
  locality: string;
  area: number;
  areaUnit: string;
  builtUpArea?: number;
  carpetArea?: number;
  plotArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floorNumber?: number;
  totalFloors?: number;
  furnishing?: string;
  facing?: string;
  parkingCount?: number;
  ageOfProperty?: string;
  amenities?: string[];
  demarcation?: string;
  images: PropertyImage[];
  media?: PropertyImage[];
  ctaLabel?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorName: string;
  action: string;
  entityType: "PROPERTY" | "SUBMISSION" | "LEAD" | "JV" | "USER_ROLE" | "COMMISSION";
  entityId: string;
  beforeSnapshot?: Record<string, unknown>;
  afterSnapshot?: Record<string, unknown>;
  createdAt: string;
}

export type SwipeAction = "VIEWED" | "SKIPPED" | "INTERESTED";

export interface PropertyActivity {
  id: string;
  userId: string;
  propertyId: string;
  action: SwipeAction;
  isContactRequested: boolean;
  contactRequestedAt?: string;
  viewCount: number;
  firstViewedAt: string;
  lastViewedAt: string;
  cycleId: string;
}

export type LeadStatus = 
  | "NEW"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "NEGOTIATION"
  | "SITE_VISIT"
  | "CONVERTED"
  | "CLOSED"
  | "LOST";

export interface Lead {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRoles: UserRole[];
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyCategory: PropertyCategory | string;
  opportunityType?: string;
  actionType: "INTERESTED" | "CONTACT_IMMEDIATELY";
  status: LeadStatus;
  assignedTo?: string;
  notes?: string;
  publicReference?: string;
  jvTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = 
  | "RECEIVED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "INFO_REQUESTED"
  | "CONVERTED";

export interface PropertySubmission {
  id: string;
  userId?: string;
  submittedByUserId?: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  submitterRole: string;
  relationshipToProperty?: string;
  category: PropertyCategory | string;
  subtype?: string;
  transactionType?: string;
  purpose?: PurposeAvailability | string;
  title: string;
  description: string;
  city: string;
  state: string;
  locality: string;
  area: number;
  areaUnit: string;
  askingPrice?: number;
  expectedPriceOrRent?: string;
  contactPreference?: string;
  isJointVenture?: boolean;
  isDisputed?: boolean;
  status: SubmissionStatus;
  convertedPropertyId?: string;
  adminReviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformConfig {
  pricePromiseText: string;
  adminNotificationEmail: string;
  commissionRatePercent: number;
}
