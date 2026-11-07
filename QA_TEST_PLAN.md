# QA and Test Plan

## 1. Test layers

- Unit: validation, role policies, public DTO mapping, price-redaction functions, state transitions.
- Integration: database repositories, auth OTP, inquiry creation, admin listing workflow, JV access.
- End-to-end: guest discovery, inquiry onboarding, seller submission, builder JV, admin management.
- Security: IDOR, privilege escalation, price leakage, role spoofing, cache leakage, rate limits.
- Visual/responsive: mobile viewport, tablet, desktop, keyboard and screen-reader basics.

## 2. Critical release tests

### Guest browsing
- Guest opens homepage.
- Guest searches by city/locality/category.
- Guest opens public listing detail.
- No sign-in wall appears before inquiry.
- Guest can browse without email/phone being collected.

### Price privacy
- Seed a listing with a private sale price and private rent amount.
- Assert public list API does not contain price keys.
- Assert public detail API does not contain price keys.
- Assert HTML/page payload, metadata, JSON-LD and search result do not contain price values.
- Assert public analytics events do not contain price.
- Assert admin with correct permission can see private price.
- Assert ordinary user and unauthorized staff cannot see private price.

### Admin-only publishing
- Buyer cannot call listing create/update/publish endpoints.
- Owner cannot call listing create/update/publish endpoints.
- Broker cannot call listing create/update/publish endpoints.
- Builder cannot call listing create/update/publish endpoints.
- Authorized Listing Manager can create/edit/publish according to permission.
- Property submission endpoint creates only a submission record.
- Admin conversion explicitly creates a draft/listing and audit event.

### Multi-role
- User can hold buyer + investor + owner roles.
- User can switch active role among assigned roles.
- User cannot set active role to a role not assigned.
- Active role cannot grant builder access if builder role is absent.
- User cannot self-assign staff roles.

### JV access
- Guest cannot list or open JV opportunities.
- Buyer, tenant, investor, owner and broker cannot list or open JV opportunities.
- Builder can list/open published JV opportunities.
- Removing builder role immediately blocks subsequent JV access.
- Direct media URL and related inquiry endpoints enforce the same policy.
- JV data never appears in public search, sitemap, recommendations or shared cache.

### Inquiry
- Valid buyer inquiry is stored and linked to correct property.
- Tenant inquiry captures rental intent fields.
- Builder JV inquiry is linked to JV opportunity.
- Email OTP must be verified before authenticated inquiry submission.
- Contact consent is stored with policy version and timestamp.
- Duplicate submission behavior is deterministic and does not create accidental multiple leads.
- User sees only their own inquiry status.
- Staff-only notes are not returned to user.

### Authentication abuse
- OTP expiry is enforced.
- Incorrect attempts are limited.
- Resend cooldown is enforced.
- Per-IP and per-email rate limits work.
- OTP never appears in logs or API response.
- Session cookie flags are correct.
- Suspended account cannot authenticate/use protected features.

### Responsive/accessibility
- Test 320px, 375px, 390px, 768px and desktop widths.
- Search and inquiry forms are usable with touch.
- Keyboard-only navigation works.
- Inputs have labels and useful error messages.
- Focus indicators and contrast are visible.
- Images have meaningful alt text or are marked decorative.

## 3. Test data

Use synthetic fixtures only:
- Public residential listing with private price.
- Public rental listing with private rent amount.
- Public commercial listing.
- Public mixed-use listing.
- Public industrial listing.
- Public land/plot listing.
- Builder-only JV opportunity.
- Draft and paused listings.
- Users with each role and combinations of roles.
- Staff users with different permission sets.
- Submissions and inquiries in different statuses.

Clearly label seeded content as demo/test data. Do not use actual phone numbers or emails belonging to real people.
