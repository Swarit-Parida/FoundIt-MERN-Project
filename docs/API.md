# FoundIt REST API

Base URL locally: `http://localhost:5000/api`. Authenticated endpoints require `Authorization: Bearer <token>`. JSON request bodies use `Content-Type: application/json`. Errors return `{ "message": "..." }`.

## Health

`GET /health` returns service status and a timestamp.

## Authentication

### `POST /auth/register`

```json
{ "name": "Aanya Sharma", "email": "aanya@example.com", "password": "a-long-password" }
```

Creates an account and returns `{ message, token, user: { id, name, email } }`. Name must be 2–60 characters; password must be 8–72 characters. Duplicate emails return HTTP 409.

### `POST /auth/login`

```json
{ "email": "aanya@example.com", "password": "a-long-password" }
```

Returns a signed token and safe user object. Invalid credentials return HTTP 401.

### `GET /auth/me`

Requires authentication. Returns the current safe user.

## Listings

### `GET /items`

Public listing feed. Query parameters: `search` searches title, description and location; `type` is `ALL`, `LOST`, or `FOUND`; `category` is one of the listed categories; `sort` is `newest` or `oldest`. Returns `{ count, items }`, limited to 100 listings. Returned items are not included in the public feed.

### `GET /items/:id`

Returns one listing including owner and claim details. Invalid IDs return 400; missing listings return 404.

### `POST /items`

Requires authentication.

```json
{
  "title": "Blue water bottle",
  "type": "FOUND",
  "category": "Other",
  "description": "Blue metal bottle found beside the library entrance.",
  "location": "Library entrance",
  "dateLostFound": "2026-10-27",
  "imageUrl": ""
}
```

Required fields: title, type, category, description, location and dateLostFound. `imageUrl` is optional and must be a public HTTP(S) URL if provided.

### `GET /items/mine`

Requires authentication. Returns the signed-in user's listings, including returned items.

### `DELETE /items/:id`

Requires authentication and listing ownership. Permanently deletes that listing and its embedded claims.

### `PATCH /items/:id/status`

Requires listing ownership. Body: `{ "status": "RETURNED" }`. A FOUND listing requires an approved claim before it can be marked returned.

## Claims

### `POST /items/:id/claims`

Requires authentication. Only works on a FOUND listing that is still `OPEN`; claimant cannot be the owner or have an existing claim.

```json
{ "message": "Mine has a small scratch near the lid and a sticker on the base." }
```

Message length is 10–500 characters. Duplicate claims return HTTP 409.

### `PATCH /items/:id/claims/:claimId`

Requires the listing owner. Body: `{ "status": "APPROVED" }` or `{ "status": "REJECTED" }`. Approving one claim changes the listing to `CLAIMED` and rejects other pending claims. The owner can then mark the item `RETURNED` after handover.

## Common status codes

- `200` — successful read/update.
- `201` — account/listing/claim created.
- `400` — invalid input or ID.
- `401` — missing/invalid authentication or invalid credentials.
- `403` — user is not permitted to perform the action.
- `404` — route or resource not found.
- `409` — duplicate or conflicting state transition.
- `429` — authentication rate limit reached.
- `500` — unexpected server error.
