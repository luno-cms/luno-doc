---
title: Public API Reference
description: Complete specification of all luno Public API endpoints with request examples, query parameters, and full response schemas.
---

# Public API Reference

**Base URL:** `https://{your-domain}/public/v1`

No authentication required. All responses are `Content-Type: application/json` (except `/media/:assetId` and XML endpoints).

---

## Form Sets

### GET /form-sets/:slug

Returns form set metadata and the published content of its primary entry (prefers slug `main`, then `_legacy`, then oldest).

**Parameters**

| Parameter | Location | Type | Description |
|---|---|---|---|
| `slug` | path | string | Form set slug |
| `locale` | query | string | Locale filter (e.g., `en`, `ja`) |

**Request**

```bash
curl https://your-domain.com/public/v1/form-sets/settings?locale=en
```

**Response (200)**

```json
{
  "formSet": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "settings",
    "name": "Site Settings",
    "description": null
  },
  "entry": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "slug": "main"
  },
  "revision": {
    "id": "a2f3d4e5-...",
    "revision": 3,
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "data": {
    "site_name": "My Website",
    "tagline": "The best headless CMS",
    "logo": "asset-uuid",
    "primary_color": "#3b82f6"
  },
  "mediaUrls": {
    "logo": "https://your-domain.com/public/v1/media/asset-uuid"
  }
}
```

---

### GET /form-sets/:formSetSlug/entries

Returns a paginated list of published entries in a form set.

**Parameters**

| Parameter | Location | Type | Default | Description |
|---|---|---|---|---|
| `formSetSlug` | path | string | — | Form set slug |
| `page` | query | integer | `1` | Page number (1-based) |
| `limit` | query | integer | `20` | Items per page (max `100`) |
| `offset` | query | integer | — | Offset (alternative to `page`) |
| `locale` | query | string | — | Locale filter |
| `q` | query | string | — | Full-text search (Business plan+) |
| `sort` | query | string | — | Sort key, e.g., `created_at:desc`, `updated_at:asc` |
| `include_snapshot` | query | boolean | `false` | Include field values and `mediaUrls` per item |

**Request examples**

```bash
# Default (first 20 entries)
curl "https://your-domain.com/public/v1/form-sets/blog/entries"

# With field values included
curl "https://your-domain.com/public/v1/form-sets/blog/entries?limit=5&include_snapshot=true"

# Full-text search (Business plan+)
curl "https://your-domain.com/public/v1/form-sets/blog/entries?q=cloudflare&locale=en"

# Sorted by update time, newest first
curl "https://your-domain.com/public/v1/form-sets/blog/entries?sort=updated_at:desc"
```

**Response (200)**

```json
{
  "formSet": {
    "id": "uuid",
    "slug": "blog",
    "name": "Blog",
    "description": null
  },
  "total": 42,
  "limit": 20,
  "offset": 0,
  "items": [
    {
      "entry": {
        "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "slug": "my-first-post"
      },
      "published": {
        "revisionId": "a2f3d4e5-...",
        "revision": 2,
        "updatedAt": "2025-01-15T10:00:00Z"
      }
    }
  ]
}
```

**With `include_snapshot=true`**, each `published` object also contains `snapshot` and `mediaUrls`:

```json
{
  "items": [
    {
      "entry": { "id": "uuid", "slug": "my-first-post" },
      "published": {
        "revisionId": "uuid",
        "revision": 2,
        "updatedAt": "2025-01-15T10:00:00Z",
        "snapshot": {
          "title": "My First Post",
          "cover": "asset-uuid",
          "category": "blog"
        },
        "mediaUrls": {
          "cover": "https://your-domain.com/public/v1/media/asset-uuid"
        }
      }
    }
  ]
}
```

---

### GET /form-sets/:formSetSlug/entries/:entrySlug

Returns the full published content for a specific entry. Returns **HTTP 301** if the entry's slug has changed.

**Parameters**

| Parameter | Location | Type | Description |
|---|---|---|---|
| `formSetSlug` | path | string | Form set slug |
| `entrySlug` | path | string | Entry slug |
| `locale` | query | string | Locale filter |

**Request**

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-first-post

# With locale
curl "https://your-domain.com/public/v1/form-sets/blog/entries/my-first-post?locale=en"
```

**Response (200)**

```json
{
  "formSet": {
    "id": "uuid",
    "slug": "blog",
    "name": "Blog"
  },
  "entry": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "slug": "my-first-post"
  },
  "revision": {
    "id": "a2f3d4e5-...",
    "revision": 2,
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "data": {
    "title": "My First Post",
    "body": "<h2>Introduction</h2><p>Hello, world!</p>",
    "cover": "asset-uuid-here",
    "category": "blog",
    "tags": ["cloudflare", "cms"],
    "published_date": "2025-01-15",
    "is_featured": true
  },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/asset-uuid-here"
  },
  "widgetRoles": {
    "title": "title",
    "cover": "thumbnail",
    "body": "description"
  }
}
```

**Slug changed (301)**

```http
HTTP/1.1 301 Moved Permanently
Location: /public/v1/form-sets/blog/entries/new-slug
```

---

## Content Lookup

### GET /content/by-path

Look up content by an import path. Used after migrating content from an external system to retrieve entries by their original URL path.

| Parameter | Location | Type | Description |
|---|---|---|---|
| `path` | query | string | Import path (required) |
| `locale` | query | string | Locale filter (optional) |

```bash
curl "https://your-domain.com/public/v1/content/by-path?path=/old-cms/articles/123"
```

Returns the same structure as the single entry endpoint.

---

### GET /content/by-slug

Fetch content using form set slug and entry slug as query parameters instead of path parameters.

| Parameter | Location | Type | Description |
|---|---|---|---|
| `formSetSlug` | query | string | Form set slug (required) |
| `slug` | query | string | Entry slug (required) |
| `locale` | query | string | Locale filter (optional) |

```bash
curl "https://your-domain.com/public/v1/content/by-slug?formSetSlug=blog&slug=my-post"
```

---

### GET /content/by-external-id

Look up content by an external system entity ID. Set during content import.

| Parameter | Location | Type | Max length | Description |
|---|---|---|---|---|
| `sourceType` | query | string | 50 | Source system name (e.g., `wordpress`, `shopify`) |
| `entityType` | query | string | 200 | Entity type (e.g., `post`, `product`) |
| `externalId` | query | string | 2000 | The external system's ID (required) |
| `locale` | query | string | — | Locale filter (optional) |

```bash
curl "https://your-domain.com/public/v1/content/by-external-id?sourceType=wordpress&entityType=post&externalId=12345"
```

---

## Preview

### GET /preview/revisions

Fetch an unpublished revision for preview purposes using a signed JWT token.

| Parameter | Location | Type | Description |
|---|---|---|---|
| `token` | query | string | JWT token from the admin panel (required) |

```bash
curl "https://your-domain.com/public/v1/preview/revisions?token=eyJhbGciOiJIUzI1NiJ9..."
```

| Case | Response |
|---|---|
| Valid token | 200 with entry details (all statuses, including draft) |
| Expired token | 401 `UNAUTHORIZED` |
| Invalid token | 401 `UNAUTHORIZED` |

Tokens are generated from the entry edit view and are valid for **15 minutes**.

---

## Media

### GET /media/:assetId

Serve an uploaded media file from Cloudflare R2.

| Parameter | Location | Type | Description |
|---|---|---|---|
| `assetId` | path | string (UUID) | The media asset ID |

```bash
# Fetch an image
curl https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001

# Request WebP format (supported browsers)
curl -H "Accept: image/webp" \
  https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001
```

**Response headers**

```http
Content-Type: image/jpeg
Cache-Control: public, max-age=31536000
ETag: "abc123def456"
```

---

## Sitemaps

### GET /sitemap.xml

XML sitemap for all published entries across all form sets.

```bash
curl https://your-domain.com/public/v1/sitemap.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.com/blog/my-first-post</loc>
    <lastmod>2025-01-15T10:00:00Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### GET /form-sets/:slug/sitemap.xml

XML sitemap for a single form set's published entries.

```bash
curl https://your-domain.com/public/v1/form-sets/blog/sitemap.xml
```

---

## SEO

### GET /form-sets/:formSetSlug/entries/:entrySlug/schema.json

Returns schema.org JSON-LD for the entry. Embed in `<script type="application/ld+json">`.

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-post/schema.json
```

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "My First Post",
  "description": "A concise description.",
  "image": "https://your-domain.com/public/v1/media/cover-uuid",
  "datePublished": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T10:00:00Z",
  "author": { "@type": "Organization", "name": "My Blog" }
}
```

### GET /form-sets/:formSetSlug/entries/:entrySlug/ogp.json

Returns Open Graph Protocol metadata as a JSON object.

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-post/ogp.json
```

```json
{
  "og:title": "My First Post | My Blog",
  "og:description": "A concise description.",
  "og:image": "https://your-domain.com/public/v1/media/cover-uuid",
  "og:url": "https://your-site.com/blog/my-post",
  "og:type": "article",
  "og:site_name": "My Blog",
  "twitter:card": "summary_large_image"
}
```

---

## Contact Forms

### POST /contact-forms/:slug/submit

Submit a contact form. No authentication required.

```bash
curl -X POST https://your-domain.com/public/v1/contact-forms/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Hello, I have a question about pricing."
  }'
```

**Success (200)**

```json
{
  "ok": true,
  "submissionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

**Validation error (400)**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email is required"
  }
}
```

---

## AI Agents

### GET /llms.txt

AI-readable published content index in Markdown ([llms.txt spec](https://llmstxt.org/)).

```bash
curl https://your-domain.com/public/v1/llms.txt
```

For MCP setup, agent key scopes, and Admin API usage, see the [AI Agents Guide](/en/api/ai-agents) and [doc.luno.rest](https://doc.luno.rest/en/api/ai-agents).

---

## Field Value Types

All field values live inside the `data` object of entry responses:

| Field type | Value type | Example |
|---|---|---|
| `text` | `string` | `"My First Post"` |
| `textarea` | `string` | `"A brief summary."` |
| `tiptap` | `string` (HTML) | `"<h2>Heading</h2><p>Body</p>"` |
| `number` | `number` | `1980` |
| `boolean` | `boolean` | `true` |
| `date` | `string` (ISO 8601) | `"2025-01-15"` or `"2025-01-15T09:00:00Z"` |
| `select` / `radio` | `string` | `"blog"` |
| `multiselect` | `string[]` | `["cloudflare", "cms"]` |
| `image` / `file` | `string` (asset UUID) | `"550e8400-..."` |
| `video_embed` | `string` (URL) | `"https://youtube.com/..."` |
| `entry_ref` | `string` (entry slug) | `"author-jane"` |

`image` and `file` UUIDs resolve to full URLs via `mediaUrls[fieldKey]`.
