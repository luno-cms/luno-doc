---
title: API Overview
description: luno's three APIs — Public API, Admin API, and Agent API. Authentication methods, base URLs, response formats, error codes, pagination, caching, and CORS.
---

# API Overview

luno provides three distinct APIs for different use cases. Choose the right one for your integration.

## API Types

### Public API

**Base URL:** `https://{your-domain}/public/v1`

| Property | Value |
|---|---|
| **Authentication** | None required |
| **CORS** | `Access-Control-Allow-Origin: *` |
| **Purpose** | Read published content, submit contact forms, serve media |
| **Clients** | Browsers, CDNs, AI agents, external systems |

```bash
# No auth needed — call directly
curl https://your-domain.com/public/v1/form-sets/blog/entries
```

### Admin API

**Base URL:** `https://{your-domain}/admin/v1`

| Property | Value |
|---|---|
| **Authentication** | JWT Bearer token |
| **Purpose** | Create, edit, approve, and manage content; manage members and settings |
| **Clients** | luno Admin SPA |

```bash
curl https://your-domain.com/admin/v1/form-sets \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### Agent API

**Base URL:** `https://{your-domain}/admin/v1` (same as Admin API)

| Property | Value |
|---|---|
| **Authentication** | Agent API key (`sk-agent-` prefix) |
| **Purpose** | Content and schema operations from AI agents and automation |
| **Issue keys** | Settings → Agent API Keys (`/settings/api-keys`) |
| **Scopes** | `full` (recommended: entries + schema) / `content` (entries only) / `schema` (compat alias of `full`) |

```bash
curl https://api.luno.rest/admin/v1/form-sets \
  -H "Authorization: Bearer sk-agent-xxxxxxxx"
```

## Authentication Details

### Obtaining a JWT (Admin API)

```bash
# Log in to receive a JWT
curl -X POST https://your-domain.com/admin/v1/auth/login/password \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@example.com", "password": "your-password" }'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": "uuid", "email": "admin@example.com" }
}
```

Include the token as `Authorization: Bearer <token>` in subsequent requests.

### Issuing an Agent API Key

1. Open the admin panel → **Settings → Agent API Keys → New key**
2. Set a name and choose a scope (usually **`full`**; use **`content`** to restrict to entries)
3. Copy the generated key (`sk-agent-…`) — it's shown only once

Prefer **`full`** for day-to-day work. Use **`content`** when you want entries-only access. `schema` is a compat alias with the same permissions as `full`. Agent keys cannot delete Form Sets or Contact Forms.

::: warning Keep API keys secret
Never commit API keys to version control or embed them in client-side code. Store them as server-side environment variables.
:::

## Response Format

All responses use `Content-Type: application/json`.

### Single resource

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "slug": "my-first-post",
  "data": {
    "title": "My First Post",
    "body": "<p>...</p>"
  },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/asset-uuid"
  }
}
```

### List resource

```json
{
  "items": [
    {
      "entry": { "id": "uuid", "slug": "my-post" },
      "published": { "revisionId": "uuid", "revision": 2, "updatedAt": "2025-01-15T10:00:00Z" }
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

### Error response

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Published entry not found"
  }
}
```

## Error Codes

| Code | HTTP Status | Description | Action |
|---|---|---|---|
| `NOT_FOUND` | 404 | Resource not found | Check the slug or ID |
| `VALIDATION_ERROR` | 400 | Invalid request parameters | See the error message for details |
| `UNAUTHORIZED` | 401 | Missing or expired token | Re-authenticate to get a fresh token |
| `FORBIDDEN` | 403 | Insufficient permissions | Use a higher-privilege role |
| `PLAN_REQUIRED` | 403 | Feature requires a higher plan | Upgrade to access this feature |
| `CONFLICT` | 409 | Conflict (e.g., duplicate slug) | Use a different slug |
| `RATE_LIMITED` | 429 | Agent API request rate limit exceeded | Wait for `Retry-After` seconds, then retry |
| `INTERNAL_ERROR` | 500 | Unexpected server error | Retry; contact support if it persists |

## Pagination

All list endpoints support pagination:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number (1-based) |
| `limit` | integer | `20` | Items per page (max `100`) |
| `offset` | integer | — | Byte offset (alternative to `page`) |

### Fetching all pages

```typescript
async function fetchAll(formSetSlug: string) {
  const BASE = 'https://your-domain.com/public/v1'
  const all: unknown[] = []
  let page = 1
  const limit = 100

  while (true) {
    const res = await fetch(
      `${BASE}/form-sets/${formSetSlug}/entries?page=${page}&limit=${limit}&include_snapshot=true`
    )
    const { items, total, offset } = await res.json()
    all.push(...items)
    if (offset + limit >= total) break
    page++
  }

  return all
}
```

## Caching and ETags

The public API attaches `ETag` headers to all responses. Send `If-None-Match` with the previously received ETag to get a `304 Not Modified` response when content hasn't changed — saving bandwidth and counting as a lightweight request.

```http
# First request
GET /public/v1/form-sets/blog/entries/my-post HTTP/1.1

← HTTP 200
← ETag: "550e8400e29b41d4"
← Cache-Control: public, max-age=60

# Second request (cache validation)
GET /public/v1/form-sets/blog/entries/my-post HTTP/1.1
If-None-Match: "550e8400e29b41d4"

← HTTP 304 Not Modified (no body)
```

`Cache-Control: public, max-age=60` also enables automatic caching at CDNs (Cloudflare, Fastly, CloudFront, etc.).

## CORS

The public API allows all origins:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

You can call the public API directly from browser JavaScript with `fetch()` without any proxy or CORS workaround.

## Rate Limits

| API | Limit |
|---|---|
| Public API | Governed by Cloudflare Workers standard limits |
| Admin API (JWT) | Not limited by agent key rate limits |
| Agent API | Per key: Free / Solo **60** / **60 s**; Standard+ **300** / **60 s** (see [AI Agents](/en/api/ai-agents#rate-limits)) |

::: tip Reduce request volume with ETags
Use `ETag` + `If-None-Match` to skip re-fetching unchanged content. `304` responses are significantly cheaper than full responses at scale.
:::

## Next Steps

- [Public API Reference](/en/api/public-api) — Complete endpoint specifications
- [AI Agents Guide](/en/api/ai-agents) — API keys and MCP server setup
- [Webhooks](/en/api/webhooks) — Real-time event notifications
