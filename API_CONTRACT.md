# Proposed API Contract

These are proposed internal route-handler contracts for the MVP. Names can change, but behavior and authorization requirements must remain.

## Conventions

- JSON over HTTPS.
- Auth identity comes from server session, never from request body.
- Validate requests and responses with Zod.
- Public endpoints use explicit public DTOs.
- No public endpoint returns private pricing or staff-only fields.
- Consistent error response:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Please review the submitted information.",
      "fieldErrors": {}
    }
  }
  ```

## Public discovery

### `GET /api/properties`
Query:
- `q`
- `category`
- `subtype`
- `transactionType`
- `state`
- `city`
- `locality`
- `minArea`, `maxArea`
- category-specific filters
- `sort`
- `cursor`, `limit`

Response:
- `items`: explicit public property DTOs
- `nextCursor`

Must:
- Return only `PUBLISHED` and public-visible listings.
- Exclude all private price fields from SQL selection and DTO.
- Exclude JV opportunities.
- Enforce maximum page size.

### `GET /api/properties/:slug`
Returns public property DTO only. No price, owner contact, admin notes, lead information or private coordinates.

### `GET /api/categories`
Returns public category/subtype taxonomy.

## Authentication

### `POST /api/auth/email-otp/request`
Body: `{ "email": "person@example.com", "purpose": "SIGN_IN" }`

- Rate-limited.
- Generic response to reduce account enumeration.
- Never return OTP.
- Never log OTP.

### `POST /api/auth/email-otp/verify`
Body: `{ "email": "...", "code": "..." }`

- Validate expiry, attempt count and purpose.
- Establish secure session.
- Return minimal user profile and available roles.

## Roles and profile

### `GET /api/me`
Authenticated. Returns profile and roles, not private admin fields.

### `PATCH /api/me/profile`
Authenticated. Update permitted profile fields.

### `POST /api/me/roles`
Authenticated. Add an allowed user role. Apply abuse controls. Staff roles cannot be self-assigned.

### `PATCH /api/me/active-role`
Authenticated. Set active UI role only; must be one of the user's existing roles. Does not alter permissions.

## Inquiry

### `POST /api/inquiries`
Authenticated after email OTP.

Body:
- `propertyId` or `jvOpportunityId` (one only)
- `intent`
- `contactName`
- `contactPhone`
- `message`
- `answers`
- `consentVersion`
- `idempotencyKey`

Must:
- Check property is published and public, or JV role authorization.
- Validate role/intent compatibility.
- Store contact consent.
- Apply rate limits and duplicate protection.
- Return public inquiry reference and confirmation only.
- Never return internal lead notes or private price.

### `GET /api/me/inquiries`
Authenticated. Return only the current user's inquiries and safe status fields.

## Property submissions

### `POST /api/property-submissions`
Authenticated; requires relevant owner/broker/builder role.
Creates `PropertySubmission` only.
Must not create or publish `PropertyListing`.

### `GET /api/me/property-submissions`
Returns only the current user's submissions and user-visible status.

## Favourites

### `GET /api/me/favourites`
### `POST /api/me/favourites`
### `DELETE /api/me/favourites/:propertyId`

Authenticated. Validate property is public.

## Builder-only JV

### `GET /api/joint-ventures`
Authenticated; requires `BUILDER` role.
Returns only published JV opportunities.

### `GET /api/joint-ventures/:slug`
Authenticated; requires `BUILDER` role. Check authorization before returning whether record exists.

### `POST /api/joint-ventures/:id/inquiries`
Authenticated; requires `BUILDER` role. Creates inquiry linked to JV opportunity.

All JV endpoints and JV media access must be protected. Do not expose JV in public property search or sitemap.

## Admin — permission-gated

### `POST /api/admin/properties`
Requires `listing.create`.
Creates draft only.

### `PATCH /api/admin/properties/:id`
Requires `listing.update`.

### `POST /api/admin/properties/:id/publish`
Requires `listing.publish`. Audit before/after status.

### `POST /api/admin/properties/:id/archive`
Requires `listing.archive`.

### `GET /api/admin/property-submissions`
Requires `submission.read`.

### `POST /api/admin/property-submissions/:id/convert`
Requires `submission.convert`. Explicitly creates listing and links submission.

### `GET /api/admin/inquiries`
Requires `lead.read`.

### `PATCH /api/admin/inquiries/:id`
Requires `lead.update` or `lead.assign` according to changed fields.

### `POST /api/admin/joint-ventures`
Requires `jv.create`.

### `PATCH /api/admin/joint-ventures/:id`
Requires `jv.update`.

### `POST /api/admin/joint-ventures/:id/publish`
Requires `jv.publish`.

### `GET /api/admin/users`
Requires `user.read`.

### `PATCH /api/admin/users/:id/roles`
Requires `user.assign_role`. Cannot self-assign staff privileges.

## Admin response privacy

Admin routes must return only fields needed for the assigned task. Staff access to private prices, user contact details and lead notes should be permission-gated and audited where appropriate.
