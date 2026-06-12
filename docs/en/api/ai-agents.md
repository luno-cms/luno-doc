---
title: AI Agents Guide
description: Complete guide for AI agents using luno — MCP server setup for Claude and Cursor, agent API key scopes, llms.txt, content operations, and best practices.
---

# AI Agents Guide

This page covers everything an AI agent (Claude, GPT, Cursor, or any LLM-based system) needs to read and manage luno content — from no-auth public content reading to full content creation via the Agent API and MCP.

## Overview

luno supports three integration models for AI agents:

| Method | Auth | Capability |
|---|---|---|
| **Public API** | None | Read published content |
| **MCP Server** | Agent API key | Content and schema ops via Claude Desktop / Cursor |
| **Agent API** | Agent API key | Same Admin API routes, programmatic access |

**MCP package:** [`@luno-cms/mcp`](https://www.npmjs.com/package/@luno-cms/mcp) (`npx -y @luno-cms/mcp`)

## MCP Server Setup

luno ships a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that lets Claude, Cursor, and other MCP-compatible tools interact with your CMS in natural language.

### Environment variables

| Variable | Example | Description |
|---|---|---|
| `LUNO_API_URL` | `https://api.luno.rest/admin` | Admin API base (**include `/admin`**, no trailing slash) |
| `LUNO_AGENT_KEY` | `sk-agent-…` | Agent API key from the admin panel |

For local development use `http://127.0.0.1:8787/admin`.

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "luno": {
      "command": "npx",
      "args": ["-y", "@luno-cms/mcp"],
      "env": {
        "LUNO_API_URL": "https://api.luno.rest/admin",
        "LUNO_AGENT_KEY": "sk-agent-xxxxxxxx"
      }
    }
  }
}
```

Restart Claude Desktop. You can now say:

> "List the latest 5 blog posts in luno."

> "Create a draft blog post titled 'Cloudflare Workers in 2025' and suggest an outline."

### Cursor

In Cursor settings under **MCP**, add:

```json
{
  "luno": {
    "command": "npx",
    "args": ["-y", "@luno-cms/mcp"],
    "env": {
      "LUNO_API_URL": "https://api.luno.rest/admin",
      "LUNO_AGENT_KEY": "sk-agent-xxxxxxxx"
    }
  }
}
```

The admin panel also shows a copy-paste MCP snippet after you issue a key (**Settings → Agent API Keys**).

## Issuing an Agent API Key

AI agents that call the Admin API (including the MCP server) need an **agent API key**.

1. Open **Settings → Agent API Keys** (`/settings/api-keys`) in the admin panel
2. Set a descriptive name (e.g., `Claude Agent`, `Setup Bot`)
3. Choose a **scope** (see below)
4. Save and **copy the key** (`sk-agent-…`) — it is shown only once

::: warning Protect your API key
- Never expose it in client-side code or Git repositories
- Store it as a server-side environment variable or in a secret manager
- If compromised, revoke it from the Agent API Keys page and generate a new one
:::

## Key Scopes

Each agent key has a `scope` that limits what it can do. Keys are bound to the project where they were issued (`X-Project-Id` is not required).

| Scope | Use for | Capabilities |
|---|---|---|
| **`content`** (default) | Day-to-day content work | Read schema, create/update entries, save/publish revisions, list media |
| **`schema`** | Initial project setup | Everything in `content`, plus Form Set blueprint apply, builtin template apply, Contact Form create/update |

### Recommended workflow

1. **Setup (short-lived):** issue a **`schema`** key → apply blog template, create contact forms
2. **Operations (long-lived):** issue a **`content`** key → create and publish articles
3. **After setup:** revoke the `schema` key

### What agent keys cannot do (any scope)

- Delete Form Sets or Contact Forms
- Delete form blocks or field definitions
- Issue other API keys, invite members, or change billing / SNS settings

Calling a schema-only endpoint with a `content` key returns **403 Forbidden**.

## MCP Tools

Tools exposed by `@luno-cms/mcp`:

### Content (`content` scope)

| Tool | Description |
|---|---|
| `get_tenant_schema` | Project-wide schema (all form sets) |
| `list_form_sets` / `get_form_set_schema` | Form set list and field definitions |
| `list_entries` / `get_entry` | Entry list and detail |
| `create_entry` / `update_entry` | Create entries and update slugs |
| `list_revisions` / `save_revision` / `publish_revision` | Revision workflow |
| `submit_entry_for_review` | Submit for approval |
| `list_media` | Media library list |

### Schema setup (`schema` scope required)

| Tool | Admin API |
|---|---|
| `apply_form_blueprint` | `POST /admin/v1/form-blueprints/apply` |
| `apply_builtin_form_template` | `POST /admin/v1/form-set-templates/:id/apply` |
| `create_contact_form` | `POST /admin/v1/contact-forms` |

## llms.txt

luno provides a [llms.txt-compliant](https://llmstxt.org/) endpoint per site that lists **published content** (form sets and entry URLs):

```bash
curl https://api.luno.rest/public/v1/llms.txt
# Or on your project's public host:
curl https://your-domain.com/public/v1/llms.txt
```

Embed the response in a system prompt so the agent knows what content exists:

```
[System prompt]
You are a content assistant for a developer blog. Available CMS content:

{contents of llms.txt}

Use the Public API to read entries and the Agent API (via MCP) to draft new articles.
```

For full API specifications, use this documentation site ([Public API](/en/api/public-api), [AI Agents Guide](/en/api/ai-agents)) rather than a separate `llms-full.txt` endpoint.

## Reading Content (No Auth Required)

Public API base: `https://{your-domain}/public/v1`

### Discover available content

```bash
# Step 1: Published content index
curl https://your-domain.com/public/v1/llms.txt

# Step 2: Sitemap
curl https://your-domain.com/public/v1/sitemap.xml
```

### Fetch an entry list

```bash
curl "https://your-domain.com/public/v1/form-sets/blog/entries?include_snapshot=true&limit=10"
```

### Python — paginate all entries

```python
import httpx
import asyncio

BASE_URL = "https://your-domain.com/public/v1"

async def fetch_all_entries(form_set_slug: str) -> list[dict]:
    """Fetch all published entries from a form set, handling pagination."""
    all_items = []
    page = 1
    limit = 100

    async with httpx.AsyncClient() as client:
        while True:
            res = await client.get(
                f"{BASE_URL}/form-sets/{form_set_slug}/entries",
                params={
                    "page": page,
                    "limit": limit,
                    "include_snapshot": "true",
                }
            )
            res.raise_for_status()
            data = res.json()

            all_items.extend(data["items"])

            total = data["total"]
            offset = data["offset"] + limit
            if offset >= total:
                break
            page += 1

    return all_items

async def main():
    entries = await fetch_all_entries("blog")
    for item in entries:
        slug = item["entry"]["slug"]
        title = item["published"].get("snapshot", {}).get("title", "(no title)")
        print(f"{slug}: {title}")

asyncio.run(main())
```

### TypeScript — typed client

```typescript
const BASE_URL = 'https://your-domain.com/public/v1'

interface PublishedItem {
  entry: { id: string; slug: string }
  published: {
    revisionId: string
    revision: number
    updatedAt: string
    snapshot?: Record<string, unknown>
    mediaUrls?: Record<string, string>
  }
}

interface EntryListResponse {
  formSet: { id: string; slug: string; name: string }
  total: number
  limit: number
  offset: number
  items: PublishedItem[]
}

async function fetchEntries(
  formSetSlug: string,
  options: { page?: number; includeSnapshot?: boolean } = {}
): Promise<EntryListResponse> {
  const { page = 1, includeSnapshot = false } = options
  const url = new URL(`${BASE_URL}/form-sets/${formSetSlug}/entries`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', '20')
  if (includeSnapshot) url.searchParams.set('include_snapshot', 'true')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}
```

## Writing Content via the Agent API

Agent API base: `https://{your-domain}/admin/v1`

Authenticate with `Authorization: Bearer sk-agent-…`.

### List form sets

```bash
curl https://api.luno.rest/admin/v1/form-sets \
  -H "Authorization: Bearer sk-agent-xxxxxxxx"
```

### Create an entry

```bash
curl -X POST "https://api.luno.rest/admin/v1/form-sets/{formSetId}/entries" \
  -H "Authorization: Bearer sk-agent-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "ai-generated-post-2025",
    "fields": {
      "title": "Building with Cloudflare Workers in 2025",
      "body": "<p>Introduction...</p>",
      "category": "tutorial",
      "tags": ["cloudflare", "workers"]
    }
  }'
```

### Save and publish a revision

Use MCP tools `save_revision` and `publish_revision`, or call the Admin API directly:

```bash
curl -X POST "https://api.luno.rest/admin/v1/revisions/{revisionId}/publish" \
  -H "Authorization: Bearer sk-agent-xxxxxxxx"
```

## Example Claude Conversations (with MCP)

**Reading content:**

> User: What are the 5 most recent blog posts?
>
> Claude: [calls luno MCP → fetches entries] Here are the 5 most recent posts...

**Creating content:**

> User: Draft a blog post about "What's new in Cloudflare Workers 2025"
>
> Claude: [calls luno MCP → creates draft entry] I've created a draft with slug `cloudflare-workers-2025`. Would you like me to add more detail to any section?

**Publishing:**

> User: The "getting-started" post looks good, go ahead and publish it.
>
> Claude: [calls luno MCP → publishes revision] Published. It's now live at `/blog/getting-started`.

**Initial setup (schema key):**

> User: Apply the blog template and create a contact form.
>
> Claude: [calls `apply_builtin_form_template` and `create_contact_form`] Form set and contact form are ready.

## Field Value Types

| Field type | Value type | Example |
|---|---|---|
| `text` | `string` | `"My Post Title"` |
| `textarea` | `string` | `"A brief excerpt."` |
| `tiptap` | `string` (HTML) | `"<p>Body content</p>"` |
| `number` | `number` | `42` |
| `boolean` | `boolean` | `true` |
| `date` | `string` (ISO 8601) | `"2025-01-15"` |
| `select` / `radio` | `string` | `"blog"` |
| `multiselect` | `string[]` | `["cloudflare", "cms"]` |
| `image` / `file` | `string` (asset UUID) | `"550e8400-..."` |
| `video_embed` | `string` (URL) | `"https://youtube.com/..."` |
| `entry_ref` | `string` (entry slug) | `"author-jane"` |

Resolve `image` / `file` UUIDs using `mediaUrls[fieldKey]` from the response.

## Error Handling

| HTTP Status | Code | How to handle |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Fix the request parameters per the error message |
| 401 | `UNAUTHORIZED` | API key is invalid, revoked, or missing |
| 403 | `FORBIDDEN` | Scope too narrow (e.g., blueprint apply with `content` key) |
| 403 | `PLAN_REQUIRED` | Full-text search (`?q=`) requires Business plan+ |
| 404 | `NOT_FOUND` | Verify the slug or ID |
| 301 | — | Slug changed — follow the `Location` header |
| 304 | — | Content unchanged — use cached version |

## Best Practices

1. **Start with `llms.txt`** to see what published content exists
2. **Use separate keys** — `schema` for setup, `content` for daily ops; revoke setup keys when done
3. **Use `include_snapshot=true`** on list requests to avoid per-entry round trips
4. **Follow 301 redirects** — slugs can change after entries are renamed
5. **Cache with ETags** — send `If-None-Match` to avoid re-downloading unchanged content
6. **Review before publishing** — use the draft → pending_review → published workflow even for AI-generated content

## Next Steps

- [AI Assist](/en/guide/ai-assist) — AI features inside the admin panel
- [Public API Reference](/en/api/public-api) — Complete endpoint specifications
- [API Overview](/en/api/overview) — Authentication and rate limits
- [npm: @luno-cms/mcp](https://www.npmjs.com/package/@luno-cms/mcp) — MCP server package
