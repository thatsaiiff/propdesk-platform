# Instructions for Coding Agents

## Mission

Implement the Real Estate Discovery & Inquiry Platform described in this handoff pack. Work incrementally, preserve product rules, and produce tested, reviewable changes.

## Required reading order

1. `README.md`
2. `PRD.md`
3. `DECISIONS_AND_OPEN_QUESTIONS.md`
4. `TRD.md`
5. `DATA_MODEL.md`
6. `API_CONTRACT.md`
7. `UX_FLOWS.md`
8. `QA_TEST_PLAN.md`
9. `IMPLEMENTATION_PLAN.md`

## Source of truth

- Product behavior: `PRD.md`.
- Technical boundaries: `TRD.md`.
- Open or assumed decisions: `DECISIONS_AND_OPEN_QUESTIONS.md`.
- If two documents conflict, stop and report the conflict; do not silently pick one.
- Update documentation when an approved product or architecture decision changes.

## Hard constraints — never violate

1. Guests can browse public properties without signing in or providing contact information.
2. No property price may appear in public UI, public API responses, HTML source, SEO metadata, structured data, analytics payloads, public search indexes, or public caches.
3. Only authorized admin staff can create or publish public property listings.
4. User property submissions are intake records, not listings. Never auto-publish them.
5. Owners, brokers, and builders can browse public listings; they cannot publish directly.
6. A user may have multiple roles. Active role is not a security boundary.
7. JV opportunities are builder-only and must be protected server-side on every route and related resource.
8. Email OTP is the MVP authentication mechanism. Phone is collected as contact information; do not add KYC or phone OTP without approval.
9. Do not invent verification badges, legal clearance, ownership verification, guaranteed returns, or exclusive status.
10. Do not collect Aadhaar, PAN, bank credentials, or identity documents in the MVP.
11. Do not implement commission charging until commercial/legal terms are approved.
12. Never put secrets or real customer data in source control, logs, screenshots, fixtures, or tests.

## Working method

- First inspect the existing repository and report its current state before changing files.
- If no repository exists, propose a minimal scaffold plan and confirm or proceed only if the user has explicitly asked for implementation.
- Build one vertical slice at a time.
- Before each slice, list the intended files and acceptance criteria.
- Add or update tests with each behavior.
- Run lint, typecheck, unit tests, integration tests and build where available.
- Report exact commands and outcomes. Never claim tests passed if they were not run.
- Avoid broad refactors unrelated to the current task.
- Keep dependencies minimal and justify new dependencies.
- Use accessible components and responsive layouts.
- Use Zod or equivalent runtime validation at all input boundaries.
- Keep business logic in server/domain modules, not UI components.
- Return explicit DTOs; never serialize database records directly.
- Use migrations for schema changes; do not edit production data manually.
- Add audit logging for sensitive admin actions.
- Use synthetic demo fixtures with obvious labels.

## Required implementation order

Follow `IMPLEMENTATION_PLAN.md`. Do not start with advanced analytics or AI features.

## Definition of done for a feature

- Requirements and acceptance criteria are met.
- Server-side authorization is implemented and tested.
- Input is validated.
- Loading, empty, success and error states exist.
- Mobile and keyboard behavior are checked.
- No private data leaks through responses, metadata, logs or cache.
- Tests cover normal, invalid, unauthorized and boundary cases.
- Documentation is updated.
- Lint, typecheck, tests and build have been run where available.

## Security review checklist

Before merging any feature involving properties, users, inquiries, roles, JV, price, media or admin:
- Can an anonymous user access this endpoint?
- Is the user's identity derived from the trusted session?
- Is role/permission checked on the server?
- Can changing an ID expose another user's data?
- Could a price or private field leak in a DTO, page payload, log or cache?
- Are JV media and related resources protected?
- Are requests rate-limited?
- Is user input validated and output safely rendered?
- Is the action audit-logged if sensitive?

## Agent communication format

For each task, report:
1. Goal and scope
2. Files changed
3. Design decisions
4. Security/authorization considerations
5. Tests and exact results
6. Known limitations
7. Next recommended task

Do not make business decisions about commission, legal claims, SLA guarantees, or identity verification. Raise them as questions.
