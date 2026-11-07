export type PropertyCategory = 
  | "RESIDENTIAL" 
  | "COMMERCIAL" 
  | "MIXED_USE" 
  | "INDUSTRIAL" 
  | "LAND";

export type TransactionType = "SALE" | "RENT" | "LEASE" | "OTHER";

export type ListingStatus = 
  | "DRAFT" 
  | "IN_REVIEW" 
  | "PUBLISHED" 
  | "PAUSED" 
  | "SOLD" 
  | "RENTED" 
  | "ARCHIVED";

export type ListingVisibility = "PUBLIC" | "BUILDER_ONLY" | "PRIVATE";

export type UserRoleType = 
  | "BUYER" 
  | "TENANT" 
  | "INVESTOR" 
  | "OWNER" 
  | "BROKER" 
  | "BUILDER";

export type StaffRoleType = 
  | "SUPER_ADMIN" 
  | "LISTING_MANAGER" 
  | "LEAD_MANAGER" 
  | "CONTENT_MANAGER" 
  | "ANALYST";

export type LeadStatus = 
  | "NEW" 
  | "ASSIGNED" 
  | "CONTACT_ATTEMPTED" 
  | "CONTACTED" 
  | "QUALIFIED" 
  | "VISIT_SCHEDULED" 
  | "NEGOTIATION" 
  | "WON" 
  | "LOST" 
  | "SPAM"
  | "ON_HOLD"
  | "NEEDS_INFORMATION";

export type SubmissionStatus = 
  | "RECEIVED" 
  | "UNDER_REVIEW" 
  | "NEEDS_INFORMATION" 
  | "ACCEPTED" 
  | "DECLINED" 
  | "CONVERTED";

export interface PropertyMedia {
  id: string;
  url: string;
  altText: string;
  isCover: boolean;
  sortOrder: number;
}

export interface InternalPropertyListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: PropertyCategory;
  subtype: string;
  transactionType: TransactionType;
  status: ListingStatus;
  visibility: ListingVisibility;
  
  // Location
  state: string;
  city: string;
  locality: string;
  pincode?: string;
  
  // Dimensions & attributes
  builtUpArea?: number;
  carpetArea?: number;
  plotArea?: number;
  areaUnit: "sq.ft." | "sq.yards" | "acres" | "sq.meters";
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floorNumber?: number;
  totalFloors?: number;
  furnishing?: "UNFURNISHED" | "SEMI_FURNISHED" | "FULLY_FURNISHED";
  facing?: "NORTH" | "SOUTH" | "EAST" | "WEST" | "NORTH_EAST" | "NORTH_WEST" | "SOUTH_EAST" | "SOUTH_WEST";
  parkingCount?: number;
  ageOfProperty?: string;
  amenities: string[];
  media: PropertyMedia[];
  
  // STRICT PRIVATE FIELDS - MUST NEVER BE IN PUBLIC DTO
  privateSalePrice?: number;
  privateRentAmount?: number;
  privateDeposit?: number;
  priceNegotiable?: boolean;
  internalNotes?: string;
  ownerContactName?: string;
  ownerContactPhone?: string;
  
  createdByStaffId: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Explicit Public DTO Allowlist (Rule: NO PRICE KEYS EXIST HERE)
export interface PublicPropertyDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: PropertyCategory;
  subtype: string;
  transactionType: TransactionType;
  status: "PUBLISHED" | "SOLD" | "RENTED";
  state: string;
  city: string;
  locality: string;
  builtUpArea?: number;
  carpetArea?: number;
  plotArea?: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floorNumber?: number;
  totalFloors?: number;
  furnishing?: string;
  facing?: string;
  parkingCount?: number;
  ageOfProperty?: string;
  amenities: string[];
  media: PropertyMedia[];
  ctaLabel: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface JointVentureOpportunity {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  landArea: number;
  areaUnit: string;
  collaborationType: "REVENUE_SHARE" | "AREA_SHARE" | "DEVELOPMENT_PARTNERSHIP" | "LANDOWNER_COLLABORATION";
  requirements: string[];
  status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";
  visibility: "BUILDER_ONLY";
  privateCommercialDetails?: string;
  media: PropertyMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  emailVerifiedAt?: string;
  activeRole?: UserRoleType;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  roles: UserRoleType[];
  staffRoles: StaffRoleType[];
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  publicReference: string;
  userId: string;
  propertyId?: string;
  propertyTitle?: string;
  jvOpportunityId?: string;
  jvTitle?: string;
  intent: "BUY" | "RENT" | "INVEST" | "SELLER_SUBMISSION" | "BROKER" | "BUILDER" | "JV";
  status: LeadStatus;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
  answers: Record<string, string | number | boolean>;
  consentRecordId: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  inquiryId: string;
  actorUserId: string;
  actorName: string;
  activityType: "STATUS_CHANGE" | "NOTE_ADDED" | "ASSIGNED" | "CONTACT_ATTEMPT";
  fromStatus?: LeadStatus;
  toStatus?: LeadStatus;
  note?: string; // STAFF ONLY
  createdAt: string;
}

export interface PropertySubmission {
  id: string;
  submittedByUserId: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  submitterRole: UserRoleType;
  relationshipToProperty: "OWNER" | "AUTHORIZED_REPRESENTATIVE" | "BROKER" | "BUILDER" | "OTHER";
  category: PropertyCategory;
  subtype: string;
  transactionType: TransactionType;
  title: string;
  description: string;
  state: string;
  city: string;
  locality: string;
  area: number;
  areaUnit: string;
  contactPreference: "PHONE" | "EMAIL" | "WHATSAPP";
  status: SubmissionStatus;
  assignedStaffId?: string;
  reviewNotes?: string;
  convertedPropertyId?: string;
  createdAt: string;
  updatedAt: string;
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
