# Product Requirements Document (PRD)

## 1. Document control

- Product: Real Estate Discovery & Inquiry Platform
- Version: 0.1 — initial requirements baseline
- Status: Draft for product-owner review
- Geography: India-wide
- Initial delivery: Responsive website; mobile apps are a later phase
- Primary experience: Mobile-first, modern, premium

## 2. Product vision

Create a trusted, admin-curated real-estate discovery platform for the Indian market. It should help people discover relevant properties and submit complete inquiries without exposing prices publicly or requiring registration just to browse.

Unlike conventional portals where every owner or broker publishes inventory independently, this platform centrally manages listings through its admin team. This creates a controlled catalogue and a consistent inquiry process. The platform supports several participant categories and multiple roles per account.

### 2.1 Differentiation — working hypothesis

The confirmed differentiation is **curated inventory + inquiry-led pricing + role-aware discovery**, rather than an open self-service listing marketplace.

Potential supporting differentiators to validate:
- Curated, admin-managed property catalogue.
- No public prices; a clear “Send Inquiry / Call to Get Price” action.
- Complete inquiry capture so the team can respond with relevant details.
- Builder-only joint-venture opportunity area.
- Role-aware journeys for buyers, tenants, investors, owners, brokers, and builders.
- One account can carry multiple roles.

Do not claim that listings are verified, legally cleared, exclusive, or guaranteed unless an explicit operational process and evidence support each claim.

## 3. Goals and success measures

### 3.1 Product goals

1. Let visitors discover relevant Indian properties with minimal friction.
2. Convert qualified property interest into complete, actionable inquiries.
3. Keep listing quality and publication under admin control.
4. Present relevant experiences based on a user's selected participant category and roles.
5. Give builders a protected area for joint-venture opportunities.
6. Create a foundation for commission revenue when a platform-attributed transaction succeeds.

### 3.2 Suggested MVP metrics

- Guest-to-property-detail view rate.
- Property-detail-to-inquiry conversion rate.
- Inquiry form completion rate.
- Percentage of inquiries with valid contact information.
- Median and 90th percentile first-response time.
- Percentage of inquiries responded to within the operational target.
- Inquiry-to-visit rate (if visit scheduling is enabled).
- Visit-to-transaction conversion (once tracked reliably).
- Admin listing publication turnaround time.
- Duplicate, spam, and invalid inquiry rate.
- Builder engagement with JV opportunities.

Do not optimize for raw registration count. The key value event is a useful inquiry.

## 4. Personas and participant categories

A person may select more than one role. Roles are capabilities/experience categories, not proof of identity or professional accreditation.

| Role | Primary intent | Role-aware experience |
|---|---|---|
| Individual buyer | Buy a home/property for self or family | Residential and other relevant sale inventory; inquiry; favourites; compare |
| Tenant / rental seeker | Rent a property | Rental inventory; rental-specific filters and inquiry |
| Investor | Evaluate property opportunities | Investment-oriented discovery and inquiry; returns must not be fabricated |
| Property owner / seller | Offer a property for consideration | Submit property information to admin; browse existing listings; contact admin |
| Broker / property dealer | Find opportunities and refer/serve clients | Browse listings; submit a property/mandate request to admin; contact admin |
| Builder / developer | Find land, projects, inventory and JV opportunities | Standard listings plus builder-only JV area; submit opportunities to admin |

**Important distinction:** the user’s initial phrase “buyer category” needs a final taxonomy. The table above is the recommended starting set. Admin and support are staff permissions, not public user roles.

### 4.1 Multiple roles

- A single account may have multiple user roles.
- User can choose an initial category during onboarding and add other roles later.
- User can switch active role in the account menu.
- Active role may change default dashboard content and recommendations, but must not grant access to restricted records unless the account has the corresponding role.
- Server-side authorization must check actual assigned roles, not a client-supplied active-role string.

## 5. Core user journeys

### 5.1 Guest browsing

1. Visitor opens the website.
2. Homepage and public listing catalogue are visible.
3. Visitor can search, filter, open property details, view permitted images and property information.
4. No login or personal details are required for browsing.
5. When visitor selects an inquiry action, onboarding/inquiry flow begins.

Acceptance:
- Public pages work without authentication.
- No phone/email gate appears before browsing.
- Public response payloads and page metadata contain no price fields.

### 5.2 First-time inquiry / account onboarding

Proposed flow:
1. Visitor clicks **Send Inquiry** or **Call to Get Price**.
2. Ask: **“Who are you?”** and show participant categories, allowing one or more selections.
3. Ask one or more intent questions relevant to the chosen category (see §6.3).
4. Collect name, email address, and phone number.
5. Send OTP to email and verify it before creating/activating the account or accepting the inquiry.
6. Save selected roles and consent record.
7. Submit the inquiry with the property reference and all relevant answers.
8. Show confirmation and the expected next step.

Phone is collected as a contact number. SMS OTP/phone ownership verification is not an MVP requirement unless later approved.

Returning users:
- Sign in using email OTP.
- If already signed in, prefill known details and ask for any missing required inquiry answers.
- Do not repeatedly ask for role selection unless the user wants to change/add roles.

### 5.3 Buyer / tenant inquiry

1. User opens a property detail page.
2. User selects **Send Inquiry** / **Call to Get Price**.
3. Form captures contact details and intent-specific requirements.
4. Inquiry is linked to the property and routed to the admin/lead team.
5. Admin or assigned team member contacts the user.
6. Team shares price and next steps privately, not on the public listing.

The “get price in 2 mins” concept is an operational target, not an automatic system guarantee. Show exact wording only after staffing and hours are finalized.

### 5.4 Owner / broker / seller property submission

1. User selects owner, broker, seller, or dealer role.
2. User chooses **Submit a Property for Listing** / **Talk to Listing Team**.
3. User provides property and ownership/mandate context, plus contact details.
4. The system creates a `PropertySubmission` record, not a public `PropertyListing`.
5. Admin reviews, contacts the submitter, checks details, and may create a listing through the admin console.
6. Submitter can see submission status where appropriate, but cannot publish or edit the public listing directly.
7. Submitter can browse other public listings and contact admin.

No broker is allowed to publish another owner's property directly. They must contact the admin and provide the required authority/mandate information for admin review.

### 5.5 Builder-only joint venture discovery

1. User must have the builder/developer role.
2. User opens the JV section.
3. Server checks role and returns only JV records the user is allowed to see.
4. Builder can view JV opportunity details and send an inquiry/proposal.
5. JV inquiry is routed to admin.
6. Non-builder users must not access JV records through direct URLs, APIs, search, sitemap, cached responses, or guessed identifiers.

Whether every builder-role account can see all JV opportunities or only admin-approved builders is an open decision. MVP default: builder role is sufficient, but admin can suspend/revoke the role.

### 5.6 Admin listing management

Admin can:
- Create, edit, preview, publish, unpublish, archive, and delete/soft-delete listings.
- Upload/manage property media.
- Set private price and commercial details.
- Choose listing category, transaction type, location, property attributes, amenities, and visibility.
- Mark a listing as featured.
- Review property submissions and convert an approved submission into a listing.
- Manage JV opportunities and their builder-only visibility.
- View and assign inquiries.

Public-facing price is always omitted, even when admin has entered it privately.

## 6. Functional requirements

Priority definitions: **P0** = must-have for MVP; **P1** = important; **P2** = later enhancement.

### 6.1 Public website and discovery

| ID | Requirement | Priority |
|---|---|---|
| PUB-01 | Homepage accessible to guests | P0 |
| PUB-02 | Browse/search public listings without login | P0 |
| PUB-03 | Responsive, mobile-first layout | P0 |
| PUB-04 | Property detail page with gallery and structured facts | P0 |
| PUB-05 | Search by keyword/location | P0 |
| PUB-06 | Filters for category, transaction intent, location, area, bedrooms, amenities and other applicable fields | P0 |
| PUB-07 | Sort by relevance, newest, and other approved non-price criteria | P1 |
| PUB-08 | Favourites for signed-in users | P1 |
| PUB-09 | Compare properties | P1 |
| PUB-10 | Map discovery | P1 |
| PUB-11 | Similar properties | P1 |
| PUB-12 | Public SEO pages and sitemap, excluding restricted JV data | P1 |

### 6.2 Property catalogue and taxonomy

Required top-level categories from product owner:
- Residential
- Commercial
- Residential-cum-commercial (mixed-use)
- Industrial
- Land / plot / vacant land
- Joint-venture properties/opportunities (builder-only area)

The “resicum commercial” wording is interpreted as **residential-cum-commercial / mixed-use**. Confirm naming before public UI.

Suggested subtypes:
- Residential: apartment/flat, independent house, villa, builder floor, residential plot, other.
- Commercial: office, retail shop, showroom, commercial building, coworking, other.
- Mixed-use: building with residential and commercial use; capture both components.
- Industrial: warehouse, factory, industrial shed, logistics/industrial land, other.
- Land: residential plot, commercial plot, agricultural land, industrial land, vacant land, other.
- JV: landowner-builder collaboration, development partnership, revenue-share proposal, area-share proposal, other. Final JV taxonomy needs owner approval.

Property fields should be category-aware. For example, bedroom and bathroom fields apply only to relevant building/residential types; plot records need plot area, dimensions, land-use, road access and applicable approvals.

### 6.3 Inquiry form

The inquiry form should be contextual and ask only relevant questions.

Common required fields:
- Name
- Email
- Phone number
- Selected role/category
- Preferred contact method (confirm whether required)
- Consent to be contacted about the inquiry
- Property ID/reference
- User's message or requirement

Suggested intent-specific fields:
- Buy: budget band (private), preferred location, property type, size/BHK, purchase timeline, self-use/investment.
- Rent: monthly budget band (private), preferred location, property type, move-in date, lease duration, furnishing preference, family/bachelor/company occupancy where legally and operationally appropriate.
- Invest: investment range (private), preferred asset type/location, investment horizon, objective.
- Builder/JV: organization, role/designation, land/project location, approximate area, proposed collaboration model, message.
- Owner/broker submission: property location, category, approximate area, contact/ownership or mandate relationship, documents available (optional at first contact), desired next step.

Do not collect sensitive or unnecessary information. Do not ask for Aadhaar, PAN, bank credentials, or identity documents in MVP inquiry forms.

### 6.4 Authentication and account

| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | Guest access to public catalogue | P0 |
| AUTH-02 | Email OTP sign-in | P0 |
| AUTH-03 | Collect phone number for inquiry follow-up | P0 |
| AUTH-04 | Allow multiple roles per account | P0 |
| AUTH-05 | Add/remove roles through account flow (subject to abuse controls) | P1 |
| AUTH-06 | Active-role switcher | P1 |
| AUTH-07 | Session revocation and logout | P0 |
| AUTH-08 | No KYC requirement in MVP | P0 |

### 6.5 Seller/owner/broker experience

- Browse all public, non-JV listings.
- Submit a property/mandate to admin.
- Track submission status (received, under review, needs information, accepted, declined, converted to listing).
- Contact admin.
- Cannot create, publish, directly edit, or set public listing status.
- Cannot see another user's private inquiry/contact data.

### 6.6 Builder experience

- Browse public listings.
- Access builder-only JV opportunities.
- Submit JV inquiry/proposal.
- Submit their own project/property information to admin for consideration.
- View their own inquiries/submissions where appropriate.
- No direct publishing.

### 6.7 Admin console

P0:
- Secure staff authentication and role-based access.
- Listing CRUD and publication workflow.
- Category-aware listing editor.
- Private price fields.
- Media upload and ordering.
- Property submission queue.
- Inquiry/lead inbox and assignment.
- User and role management.
- JV opportunity management and access control.
- Audit log for sensitive actions.

P1:
- Admin analytics.
- Featured listing controls.
- Lead status pipeline and reminders.
- Export with permission controls.
- CMS-managed homepage sections.
- Commission/transaction tracking.

Suggested admin roles:
- Super Admin: all permissions.
- Listing Manager: property and submission management.
- Lead Manager: inquiry assignment and follow-up.
- Content Manager: homepage/SEO content.
- Read-only Analyst: reporting only.

### 6.8 Inquiry and lead management

Suggested lead statuses:
`NEW → ASSIGNED → CONTACT_ATTEMPTED → CONTACTED → QUALIFIED → VISIT_SCHEDULED → NEGOTIATION → WON | LOST | SPAM`

A lead may also be `ON_HOLD` or `NEEDS_INFORMATION`.

- Store inquiry source, property, user, role, answers, consent, timestamps and assigned staff member.
- Prevent accidental duplicate submissions through idempotency and duplicate detection, without blocking legitimate repeat inquiries.
- Record every status transition and staff action.
- Staff-only notes must never be exposed to users.
- Users may view a limited status/confirmation for their own inquiries if this is enabled.

### 6.9 Commission and transaction attribution

The intended revenue model is commission on successful transactions. The MVP should prepare for tracking but not invent commercial terms.

Track:
- Property and inquiry that originated the lead.
- Lead owner/assigned staff.
- Parties involved (with access restrictions).
- Transaction status and completion date.
- Evidence/reference that the transaction completed.
- Commission agreement version and acceptance (when introduced).
- Commission basis, rate/amount, due date, received amount and outstanding balance (private admin/finance fields).

Open business/legal decisions:
- What constitutes a successful transaction: signed agreement, token/advance, registered sale deed, lease commencement, or another event?
- Who pays the commission: seller, buyer, landlord, tenant, builder, or negotiated party?
- Is commission percentage, fixed fee, or variable?
- How is lead attribution protected if parties transact outside the platform?
- What disclosures, invoices, tax treatment, and enforceable agreement are required?
- What happens for cancellations, refunds, disputes, and multiple brokers?

Do not charge or promise commission until terms are legally reviewed and accepted by the relevant parties.

## 7. Pricing visibility rules

This is a critical requirement.

- Public listing cards: no price.
- Public property detail: no price, price range, rent amount, or hidden text containing price.
- Search/filter UI: no public price filter in MVP unless product owner explicitly approves a private/inquiry-based alternative.
- SEO title/description and structured metadata: no price.
- Public API and serialized page data: omit private price fields entirely.
- Admin can enter and view private price/expected price/rent/negotiability fields.
- Inquiry CTA: **Send Inquiry** and/or **Call to Get Price**.
- Do not expose price through HTML comments, JSON-LD, network payloads, image filenames, analytics events, or error messages.

“Get price in 2 minutes” is a service-level target requiring staffed hours, routing, alerting, escalation and monitoring. Until approved, safer public copy is **“Send an inquiry to get the latest price”**.

## 8. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Aim for good Core Web Vitals on mid-range mobile devices and typical Indian mobile networks |
| Accessibility | WCAG 2.2 AA target; keyboard access, labels, contrast, focus states |
| Security | OWASP-aligned controls, server-side authorization, rate limits, secure sessions |
| Privacy | Data minimization, clear consent, retention/deletion process and privacy notice |
| Reliability | Backups, error monitoring, health checks and recovery procedure |
| Scalability | Separate public read paths from admin operations; pagination and indexes |
| SEO | SSR/metadata for public listings; no indexing of private JV/admin/account pages |
| Maintainability | TypeScript, schema validation, migrations, automated tests, documented APIs |
| Localization | India-first; store money/currency and address data in structured form; English MVP, localization-ready |
| Media | Responsive image variants, compression, file validation and CDN delivery |

## 9. MVP scope

### Included
- Public homepage and guest browsing.
- India-wide location-based search/filter.
- Public property detail pages without prices.
- Category-aware property schema.
- Email OTP authentication for inquiry/account access.
- Multi-role accounts and active role.
- Inquiry capture and admin lead inbox.
- Owner/broker property submission to admin.
- Admin-only listing management and publishing.
- Builder-only JV section with server-side access checks.
- Favourites and compare if schedule allows; recommended P1.
- Responsive premium mobile-first design.

### Excluded from initial MVP unless approved
- Native Android/iOS apps.
- Direct user/broker listing publication.
- KYC/identity document verification.
- Online booking/token payments.
- Escrow or transaction settlement.
- Public price display.
- Automated property valuation or investment-return promises.
- AI recommendations/chatbot.
- Public reviews/ratings of properties or users.
- Complex broker team/commission split management.

## 10. Acceptance criteria — release blockers

1. Guest can browse/search/open public listings without account creation.
2. A public user cannot see any listing price in UI, page source, API response, metadata, or structured data.
3. Only authorized admin staff can create or publish a public listing.
4. Owner/broker property submission creates a submission record and never directly creates a published listing.
5. A user can have multiple roles and switch active role.
6. Email OTP is required before an authenticated inquiry is accepted; phone is collected as contact data.
7. Builder-only JV content is inaccessible to non-builders through both UI and API.
8. A buyer/tenant can submit a complete inquiry linked to a property.
9. Admin can assign and update inquiry status with an audit trail.
10. Staff-only notes and private contact/price fields are not exposed to other users.
11. Category-specific validation prevents irrelevant fields from being required.
12. All primary flows work on narrow mobile screens and keyboard-accessible desktop browsers.

## 11. Product-owner decisions still required

See `DECISIONS_AND_OPEN_QUESTIONS.md`. Do not treat assumptions there as final without approval.
