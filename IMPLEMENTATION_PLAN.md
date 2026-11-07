# Implementation Plan

## Milestone 0 — Repository and decision baseline

- Inspect existing repository and identify current stack/status.
- Confirm brand, role taxonomy, builder access policy, OTP/phone rules, price CTA wording.
- Confirm environment and hosting constraints.
- Create issue tracker and branch strategy.
- Establish lint, typecheck, test and CI pipeline.

Exit criteria:
- Requirements and open decisions reviewed.
- App runs locally.
- CI checks run.

## Milestone 1 — Foundation and design system

- Next.js App Router + TypeScript.
- Tailwind and accessible component primitives.
- Responsive app shell and navigation.
- Design tokens, typography, buttons, forms, cards, dialogs, toasts.
- Environment validation and database connection.
- Prisma initial schema and migrations.

Exit criteria:
- Responsive shell works.
- Database migrations run in local/staging.
- No secrets committed.

## Milestone 2 — Public catalogue

- Property taxonomy.
- Public homepage.
- Search results and filters.
- Property detail and image gallery.
- Explicit public DTO allowlist.
- Price-leak automated tests.
- SEO metadata without price.
- Public-only caching.

Exit criteria:
- Guest can discover properties without account.
- Public APIs/pages contain no private prices.
- JV excluded from public discovery.

## Milestone 3 — Authentication and multi-role accounts

- Email OTP request/verify.
- Secure sessions.
- Profile and phone contact field.
- Multiple roles and active role.
- Account screens.
- Rate limits and auth abuse tests.

Exit criteria:
- Guest browse remains open.
- User can authenticate and hold multiple roles.
- Active role does not grant unassigned permissions.

## Milestone 4 — Inquiry and lead operations

- Contextual inquiry forms.
- Email OTP gate.
- Consent capture.
- Inquiry creation and idempotency.
- Admin lead inbox, assignment, status and activity log.
- User's own inquiry history.
- Notifications.

Exit criteria:
- Buyer/tenant inquiry works end to end.
- Admin can process lead.
- Private notes and contacts remain protected.

## Milestone 5 — Admin catalogue and property submissions

- Admin listing CRUD.
- Category-aware fields.
- Private price fields.
- Media upload and management.
- Owner/broker/builder property submission intake.
- Admin review and explicit conversion.
- Audit log.

Exit criteria:
- Only permitted staff can publish.
- User submission cannot auto-publish.
- Admin can manage complete listing lifecycle.

## Milestone 6 — Builder JV module

- Builder role policy and approval workflow if selected.
- JV admin CRUD.
- Builder-only browse/detail/inquiry.
- JV media protection.
- Authorization and cache-isolation tests.

Exit criteria:
- Non-builder cannot access JV through any API or direct URL.
- Builder can submit JV inquiry.
- JV never appears in public sitemap/search.

## Milestone 7 — Engagement and operational polish

- Favourites.
- Compare.
- Map discovery.
- Similar properties.
- Admin analytics.
- Response-time reporting and SLA dashboard.
- Stale listing management.
- SEO and performance tuning.

Exit criteria:
- Core user experience is polished and measurable.

## Milestone 8 — Production readiness

- Legal-reviewed terms, privacy policy and consent.
- Commission terms approved (tracking/payment only if approved).
- Production hosting, domain, email sender and storage.
- Monitoring, backups and restore test.
- Security review and penetration test appropriate to launch scale.
- Accessibility and performance review.
- Staff training and operational playbooks.

Exit criteria:
- Production checklist signed off.
- No open critical/high security issues.
- Support and listing/inquiry operations staffed.

## Suggested vertical-slice order

1. Public listing DTO and no-price test.
2. Guest property discovery.
3. Email OTP + account roles.
4. Property inquiry.
5. Admin lead processing.
6. Admin-only listing publication.
7. Property submission intake.
8. Builder-only JV.
9. Favourites/compare/map.
10. Commission/transaction tracking after legal terms.
