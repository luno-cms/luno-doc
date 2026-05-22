---
title: Quick Start
description: Get luno HCMS running in 5 minutes — log in, create your first entry, publish it, and fetch it via the public API.
---

# Quick Start

luno is a **headless CMS** built on Cloudflare Workers. You manage content in the admin panel, then deliver it via an authentication-free public API to your website or app. This guide gets you to your first published API response in 5 minutes.

## Step 1: Log In to the Admin Panel

Open your luno admin URL (e.g., `https://cms.example.com`) and sign in.

| Method | Description |
|---|---|
| **Email + Password** | Follow the invitation link from your admin to set your password, then log in |
| **Google Account** | Click "Sign in with Google" to authenticate via OAuth |

::: tip Didn't receive an invitation?
Contact your project admin and ask them to send an invitation to your email address.
:::

## Step 2: Understand the Layout

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

## Step 3: Create Your First Entry

### Select a Form Set

Click on a form set in the sidebar (e.g., "Blog", "News"). Form sets define the structure of your content. Your admin will have created them in advance.

### Create a New Entry

Click **New Entry** and fill in the fields:

- **Text fields**: Type a title or short description
- **Rich text (tiptap)**: Use the WYSIWYG editor for formatted body content
- **Media fields**: Upload and attach an image

When done, click **Save**. The entry is saved as a **draft**.

### Submit for Review → Approve → Publish

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

## Step 4: Fetch Your Content via the Public API

Once published, you can retrieve the content without any authentication.

### Verify with curl

```bash
# Get all published entries in your form set
curl https://cms.example.com/public/v1/form-sets/blog/entries
```

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

### Fetch a single entry with all field values

```bash
# Add include_snapshot=true to get field values in the response
curl "https://cms.example.com/public/v1/form-sets/blog/entries/my-first-post?include_snapshot=true"
```

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

The `data` object keys match the field keys you defined in the form set. The `mediaUrls` object provides fully-qualified URLs for image and file fields.

### JavaScript / TypeScript

```typescript
const BASE = 'https://cms.example.com/public/v1'

// Fetch a paginated list of entries
async function getPosts(page = 1) {
  const res = await fetch(
    `${BASE}/form-sets/blog/entries?page=${page}&include_snapshot=true`
  )
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// Fetch a single entry
async function getPost(slug: string) {
  const res = await fetch(`${BASE}/form-sets/blog/entries/${slug}`)
  if (!res.ok) {
    if (res.status === 404) throw new Error('Post not found')
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

// Usage
const { items } = await getPosts()
items.forEach(({ entry, published }) => {
  console.log(entry.slug, published.updatedAt)
})
```

### Next.js integration

```typescript
// app/blog/page.tsx
export default async function BlogPage() {
  const res = await fetch(
    'https://cms.example.com/public/v1/form-sets/blog/entries?include_snapshot=true',
    { next: { revalidate: 60 } }  // Cache for 60 seconds
  )
  const { items } = await res.json()

  return (
    <ul>
      {items.map(({ entry, published }) => (
        <li key={entry.slug}>
          <a href={`/blog/${entry.slug}`}>
            {published.snapshot?.title as string}
          </a>
        </li>
      ))}
    </ul>
  )
}
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Empty entry list | No published entries yet | Approve and publish your draft |
| `404 NOT_FOUND` | Wrong form set slug | Check the slug in Settings → Form Sets |
| Field values not returned | Missing `include_snapshot=true` | Add the query parameter |
| Image URL missing | Looking in wrong place | Use `mediaUrls[fieldKey]` for full URLs |

## Next Steps

- [Content Management](/en/guide/content-management) — Revisions, scheduled publishing, and previews
- [Form Builder](/en/guide/form-builder) — Field types and content model design
- [Public API Reference](/en/api/public-api) — Complete endpoint reference
- [AI Agents Guide](/en/api/ai-agents) — MCP server setup and API keys
