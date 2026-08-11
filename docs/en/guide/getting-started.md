---
title: Quick Start · Agents / Console / API only
description: LUNO start paths A Agents (MCP), B Console, C API only—done states and step-by-step entry points.
next:
  text: Done state A · Agents
  link: /en/guide/paths/agents
---

# Quick Start

LUNO is an AI-native content operations platform. Start on the path that matches your goal.

## Choose a path

| Path | Best for | Time | Done state → start |
|---|---|---|---|
| **A. Agents (MCP)** | Operate from Cursor / Claude Code / Codex | ~5 min | [Done state](/en/guide/paths/agents) → [overview](/en/products/agents) |
| **B. Console** | Learn create → approve → publish in admin | ~10 min | [Done state](/en/guide/paths/console) → [steps](#console) |
| **C. API only** | Read published content and wire your site | ~3 min | [Done state](/en/guide/paths/api) → [Public API](/en/api/public-api#api-only) |

```bash
# Path A (recommended / fastest)
npx @luno-cms/mcp setup
```

Path B continues below. For A and C, follow the links above.

## Start with Console {#console}

Sign in to the admin panel, publish your first entry, and fetch it from the public API.

### Step 1: Log In to the Admin Panel

Open your luno admin URL (e.g., `https://cms.example.com`) and sign in.

| Method | Description |
|---|---|
| **Email + Password** | Follow the invitation link from your admin to set your password, then log in |
| **Google Account** | Click "Sign in with Google" to authenticate via OAuth |

::: tip Didn't receive an invitation?
Contact your project admin and ask them to send an invitation to your email address.
:::

### Step 2: Understand the Layout

After signing in, the left sidebar shows your navigation:

| Menu | Description |
|---|---|
| **Dashboard** | Summary of published entries, drafts, and recent activity |
| **Form Set name** | Entry list for each content type (e.g., Blog, News) |
| **Media** | Upload and manage images and files |
| **Master Data** | Manage shared reference data like categories and tags |
| **Contact Forms** | View and manage contact form submissions |
| **Members** | Invite team members and manage roles |
| **Widgets** | Configure embeddable content widgets |
| **Settings** | Form sets, Webhooks, API keys, and more |

### Step 3: Create Your First Entry

#### Select a Form Set

Click on a form set in the sidebar (e.g., "Blog", "News"). Form sets define the structure of your content. Your admin will have created them in advance.

#### Create a New Entry

Click **New Entry** and fill in the fields:

- **Text fields**: Type a title or short description
- **Rich text (tiptap)**: Use the WYSIWYG editor for formatted body content
- **Media fields**: Upload and attach an image

When done, click **Save**. The entry is saved as a **draft**.

#### Submit for Review → Approve → Publish

Use the status button in the top-right corner to move through the publishing workflow:

```
Draft → Submit for Review → Approve → Published
```

1. **Submit for Review**: Notify the reviewer that the content is ready.
2. **Approve**: The reviewer confirms and approves.
   - "Publish now" → status becomes **Published**
   - "Schedule" → auto-publishes at the specified date and time
3. **Published**: The entry is live and available via the public API.

::: tip About roles
**tenant_admin** (administrator) can perform all operations including approval and publishing. **tenant_user** (regular user) can create, edit, and submit for review. See [Content Management](/en/guide/content-management) for details.
:::

### Step 4: Fetch Your Content via the Public API

Once published, you can retrieve the content without any authentication. Prefer [`/public/p/{projectId}/v1`](/en/api/public-api) in production.

#### List entries

::: code-group

```bash [curl]
# Recommended: projectId base
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true"

# Host-resolved (when you have a public host)
curl "https://cms.example.com/public/v1/form-sets/blog/entries?include_snapshot=true"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'

const res = await fetch(
  `${BASE}/form-sets/blog/entries?include_snapshot=true`
)
if (!res.ok) throw new Error(`API error: ${res.status}`)
const { items } = await res.json()
```

```bash [MCP]
# Once in your site repo
npx @luno-cms/mcp setup

# Then ask your agent, e.g.:
# "List published entries in the blog form set"
```

:::

Response:

```json
{
  "formSet": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "blog",
    "name": "Blog"
  },
  "total": 1,
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
        "revision": 1,
        "updatedAt": "2025-01-15T10:00:00Z"
      }
    }
  ]
}
```

#### Fetch a single entry with field values

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries/my-first-post?include_snapshot=true"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'

async function getPost(slug: string) {
  const res = await fetch(
    `${BASE}/form-sets/blog/entries/${slug}?include_snapshot=true`
  )
  if (!res.ok) {
    if (res.status === 404) throw new Error('Post not found')
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}
```

```bash [MCP]
# Ask your agent, e.g.:
# "Fetch the published body for slug my-first-post"
```

:::

Response:

```json
{
  "formSet": { "slug": "blog", "name": "Blog" },
  "entry": { "id": "...", "slug": "my-first-post" },
  "revision": { "revision": 1, "updatedAt": "2025-01-15T10:00:00Z" },
  "data": {
    "title": "My First Post",
    "body": "<p>Hello, world!</p>",
    "cover": "asset-uuid-here",
    "published_date": "2025-01-15"
  },
  "mediaUrls": {
    "cover": "https://cms.example.com/public/v1/media/asset-uuid-here"
  }
}
```

`data` keys match form-set field keys. `mediaUrls` holds fully-qualified asset URLs.

#### Framework recipes

For paste-ready list/detail examples in Next.js, Astro, and Nuxt, see [Framework recipes](/en/guide/frameworks/).

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Empty entry list | No published entries yet | Approve and publish your draft |
| `404 NOT_FOUND` | Wrong form set slug | Check the slug in Settings → Form Sets |
| Field values not returned | Missing `include_snapshot=true` | Add the query parameter |
| Image URL missing | Looking in wrong place | Use `mediaUrls[fieldKey]` for full URLs |

## Next Steps

- [Headless CMS overview](/en/products/content) — Content surface at a glance
- [Content Management](/en/guide/content-management) — Revisions, scheduled publishing, previews
- [Form Builder](/en/guide/form-builder) — Field types and model design
- [Public API](/en/api/public-api) — Endpoint reference (path C)
- [Framework recipes](/en/guide/frameworks/) — Next.js / Astro / Nuxt
- [AI Agents](/en/products/agents) — Start with MCP (path A)
