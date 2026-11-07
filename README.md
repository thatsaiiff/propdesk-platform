# Real Estate Discovery Platform — Agent Handoff Pack

**Status:** Discovery baseline / MVP blueprint  
**Version:** 0.1  
**Date:** 7 November 2026  
**Audience:** Product, design, frontend, backend, QA, security, and coding agents

## Product summary

Build a mobile-first, premium Indian real-estate discovery and inquiry platform with a deliberately different operating model from conventional self-service property portals:

- Anyone can browse public property listings as a guest without sharing personal information.
- To inquire, a visitor identifies their buyer/participant category and provides contact details. Email OTP is used for account access/verification; phone number is collected as contact information. No KYC or identity-document verification is required for ordinary browsing or inquiry in the MVP.
- Only platform administrators can create, publish, edit, pause, or remove property listings.
- Buyers, investors, tenants, owners, brokers, and builders can browse the same public inventory, but see role-relevant experiences and actions.
- Users can hold multiple roles and switch their active role.
- Property prices are not displayed publicly. The primary CTA is **Send Inquiry** / **Call to Get Price**. The operational target is to respond with price information within two minutes during staffed operating hours; do not promise this as a guaranteed SLA until operations can support it.
- Joint-venture opportunities are restricted to builder-role users.
- Users who own properties or represent sellers do not publish directly. They submit property details to the admin team for review and listing.
- Revenue is intended to come from commission on successfully completed transactions. The transaction attribution, evidence, fee basis, collection, and legal terms need to be finalized before production commission collection.

## Pack contents

| File | Purpose |
|---|---|
| `PRD.md` | Product vision, personas, functional requirements, journeys, scope, acceptance criteria |
| `TRD.md` | Architecture, stack, domain model, API contracts, security, operational design |
| `AGENTS.md` | Instructions and boundaries for autonomous coding agents |
| `UX_FLOWS.md` | Navigation, onboarding, inquiry and role-specific flows |
| `DATA_MODEL.md` | Entity definitions and relationship guidance |
| `API_CONTRACT.md` | Proposed API surface and request/response conventions |
| `QA_TEST_PLAN.md` | Test strategy and high-value acceptance scenarios |
| `DECISIONS_AND_OPEN_QUESTIONS.md` | Confirmed decisions, assumptions, unresolved decisions |
| `IMPLEMENTATION_PLAN.md` | Milestones and suggested build sequence |

## Non-negotiable product rules

1. **No public prices:** never render sale/rent/lease price, price ranges, or price metadata on public listing pages, cards, search results, SEO metadata, structured data, or public APIs.
2. **Admin-controlled inventory:** no public or user dashboard route may create or directly publish a listing. Property submissions are requests for admin review, not listings.
3. **Guest browsing:** browsing and viewing non-restricted listings must not require an account, email, phone, or cookie-based identity profile.
4. **JV privacy:** JV listings and their inquiry actions must be authorized server-side for users with the builder role. Hiding links in the UI is insufficient.
5. **Inquiry consent:** collect only information needed to respond; explain why it is requested and obtain consent before sharing it with the relevant platform team/property contact.
6. **No invented guarantees:** “within 2 minutes” is a target response promise only after operating hours, staffing, escalation, and measurement are agreed.
7. **No KYC in MVP:** do not add PAN, Aadhaar, RERA-document, or identity-document collection unless a later approved requirement and legal review explicitly adds it. Admin may perform internal listing checks without representing them as government verification.

## How agents should use this pack

- Read `AGENTS.md` first.
- Treat `PRD.md` and `DECISIONS_AND_OPEN_QUESTIONS.md` as the product source of truth.
- Treat `TRD.md`, `DATA_MODEL.md`, and `API_CONTRACT.md` as the technical baseline, subject to the open decisions.
- Do not silently resolve material business ambiguities. Record proposed decisions in `DECISIONS_AND_OPEN_QUESTIONS.md` and ask the product owner when needed.
- Implement in vertical slices with tests. Do not scaffold the whole application and claim it is complete.
- Never seed real personal data, real customer contact details, or fabricated property inventory. Use clearly marked demo data only.

---

## MVP Implementation & Deployment Guide

### Stack
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS, responsive mobile-first UI
- **Icons & Components:** Lucide React, accessible modal & drawer primitives
- **Validation:** Zod runtime validation at all boundaries
- **Security & Authorization:** Server-side HMAC-SHA256 session management, builder-only JV protection, strict price-omission Public DTOs
- **Testing:** Vitest automated test suite with security & privacy invariant assertions
- **Hosting & CI/CD:** Vercel + GitHub (`thatsaiiff/propdesk-platform`)

### Running Locally
```bash
# Install dependencies
npm install

# Run automated tests
npm test

# Run development server
npm run dev

# Run production build
npm run build
```

### Key URLs & Demo Roles
- **Public Discovery:** `/` and `/properties`
- **Builder-Only Joint Ventures:** `/joint-ventures` (protected: requires `BUILDER` role)
- **Property Submission Intake:** `/submit-property` (owner/broker intake, never auto-publishes)
- **Account & Multi-Role Manager:** `/account`
- **Admin Console:** `/admin` (staff role gated: manage listings, private prices, submissions, and lead inbox)

