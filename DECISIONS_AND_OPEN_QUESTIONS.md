# Decisions and Open Questions

## 1. Confirmed by product owner

| Topic | Confirmed direction |
|---|---|
| Product concept | All-in-one real estate platform, differentiated from existing portals |
| Geography | All India |
| Revenue | Commission on successful transactions for now |
| Account roles | Category/intent-based roles; one user can have multiple roles |
| Browsing | Guest can view website/listings without sharing details |
| Authentication | Email + phone collected; email OTP |
| KYC | No identity/KYC verification in MVP |
| Listing creation | Admin only |
| Seller/owner/broker | Can browse other listings and contact admin; admin handles listing |
| JV | Joint-venture opportunities shown only to builders |
| Property categories | Residential, commercial, residential-cum-commercial, industrial, land/plot/vacant land, JV |
| Inquiry | Send inquiry with relevant details; no public price |
| Price display | Do not show public price; “Send Inquiry / Call to Get Price” |
| Buyer workflow | Open site → identify user/category → ask relevant questions → contact details + email OTP → inquiry; guest browsing remains available |
| Buyer features | Inquiry workflow approved; favourites, compare, map, similar properties and related discovery features approved in principle |
| Dashboards | Role-aware user experience and admin dashboard |
| Admin | Full listing, user, inquiry, role, JV and platform management |
| Design | Mobile-first, modern, premium |
| Platform | Website first; apps later |
| Stack | Next.js, TypeScript, Tailwind, PostgreSQL, Prisma and related recommended stack |

## 2. Working assumptions — validate

1. “Resicum commercial” means residential-cum-commercial / mixed-use.
2. Public property listing categories exclude JV; JV is a separate protected opportunity module.
3. “Who are you?” should allow multiple roles, but the first inquiry may ask for one primary intent.
4. Email OTP is used for sign-in. Phone is collected for follow-up but is not OTP-verified in MVP.
5. The two-minute price response is a target, not a guarantee, until the operating model is confirmed.
6. Admin can store private prices and disclose them only through an authorized staff response.
7. User property submissions are reviewed by admin and only become listings through an explicit conversion action.
8. A builder role is initially self-selected/added by the user, because no verification is required. This creates a risk that non-builders may claim the role; product owner must decide whether JV access needs manual approval even without formal KYC.

## 3. Decisions required before production

### Business and positioning
- What is the platform's name, domain and brand identity?
- What is the precise differentiator beyond curated inventory, inquiry-led pricing and JV discovery?
- Is launch India-wide from day one, or should inventory/search initially focus on selected cities while the product is technically India-wide?
- What are the first launch cities and minimum inventory target?

### Role taxonomy
- Confirm whether `Tenant` is a distinct role from `Buyer`.
- Confirm whether “Seller” is represented as `Owner`, or whether Seller is a separate role.
- Can all users add all roles instantly, or are some roles admin-approved?
- If no KYC is required, what prevents anyone from selecting Builder and accessing JV opportunities? Options: self-declared builder role, admin approval of builder role, or a lightweight business profile review (not KYC).

### Onboarding and contact
- Must a user provide phone number before every inquiry, or can an account profile retain it?
- Is phone number mandatory or optional?
- Should OTP be email-only, as currently assumed?
- Should inquiry be possible without creating a permanent account, using a one-time email OTP and guest inquiry record?
- What exact consent wording and privacy notice should be shown?

### Listing and operations
- Who are the admin listing operators and what are their working hours?
- How does admin obtain/confirm property facts and images?
- What fields are mandatory per category?
- Can admin display a generalized map pin or exact map location?
- Should stale listings automatically pause after a defined period?
- What is the review and publication SLA for submitted properties?

### “Price in 2 minutes”
- Is this a 24/7 promise or only within business hours?
- Is the price available in the admin system at publication time?
- Who receives the alert and what happens if no one responds?
- Should the CTA say “Call to Get Price” only if a staffed phone line exists?
- Until operationally validated, use “Send an inquiry to get the latest price.”

### JV
- Can every user with builder role see all published JV opportunities?
- Should builder role be admin-approved before JV access?
- Can builders submit JV opportunities to admin?
- Are owner name, exact address and financial terms hidden until an NDA or qualification step?
- What JV collaboration types and qualification questions are required?

### Commission and transaction
- Define successful transaction event.
- Define who pays and the rate/basis.
- Define whether agreement is signed before contact/visit or before negotiation.
- Define lead attribution window and evidence.
- Define cancellations, disputes, tax/invoice process and collection method.
- Obtain legal review of terms, disclosures and applicable Indian laws before charging.

### Design and technology
- Brand name, logo, color direction and typography.
- Preferred hosting vendor and budget.
- Email OTP provider and sending domain.
- Object storage/media provider.
- Map/geocoding provider and budget.
- Search provider if PostgreSQL search is insufficient.
- Analytics and cookie/consent approach.

## 4. Recommended defaults for MVP

Unless product owner changes them:
- Separate `BUYER` and `TENANT` roles.
- Allow multi-role self-selection for ordinary user roles.
- Require admin approval for `BUILDER` role before JV access, even though no KYC is collected. This is a product access-control decision, not identity verification.
- Email OTP only; phone is collected as contact information.
- Public price is completely omitted from public DTOs.
- Use safe interim CTA copy, not a hard two-minute guarantee.
- Admin-managed inventory only.
- Build commission tracking fields, but do not collect payments/commission in MVP.
- Launch with a limited set of cities/inventory if nationwide operations are not ready, while keeping the architecture India-wide.
