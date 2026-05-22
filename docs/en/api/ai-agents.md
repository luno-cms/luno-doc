---
title: AI Agents Guide
description: Complete guide for AI agents using luno — MCP server setup for Claude, API key authentication, llms.txt, content operations via the Agent API, and best practices.
---

# AI Agents Guide

This page covers everything an AI agent (Claude, GPT, or any LLM-based system) needs to read and manage luno content — from no-auth public content reading to full content creation via the Agent API and MCP.

## Overview

luno supports three integration models for AI agents:

| Method | Auth | Capability |
|---|---|---|
| **Public API** | None | Read published content |
| **MCP Server** | API key | Full content ops via Claude Desktop / Cursor |
| **Agent API** | API key | Programmatic content creation and publishing |

## MCP Server Setup

luno ships a Model Context Protocol (MCP) server that lets Claude, Cursor, and other MCP-compatible tools interact with your CMS directly in natural language.

### Claude Desktop

Edit `~/Library/Application Support/Claude/config.json` (macOS) or `%APPDATA%\Claude\config.json` (Windows):

```json
{
  "mcpServers": {
    "luno": {
      "command": "npx",
      "args": ["-y", "@luno/mcp-server"],
      "env": {
        "LUNO_API_URL": "https://your-domain.com",
        "LUNO_API_KEY": "luno_agent_your-api-key-here"
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
    "args": ["-y", "@luno/mcp-server"],
    "env": {
      "LUNO_API_URL": "https://your-domain.com",
      "LUNO_API_KEY": "luno_agent_your-api-key-here"
    }
  }
}
```

## Issuing an API Key

AI agents that call the Admin API (including the MCP server) need an API key.

1. Open **Settings → API Keys → New API Key** in the admin panel
2. Set a descriptive name (e.g., `Claude Agent`, `CI Deploy Bot`)
3. Configure the permission scope
4. Save and **copy the key** (`luno_agent_xxxx`) — it's shown only once

::: warning Protect your API key
- Never expose it in client-side code or Git repositories
- Store it as a server-side environment variable or in a secret manager
- If compromised, revoke it from the API Keys settings page and generate a new one
:::

## llms.txt

luno provides [llms.txt-compliant](https://llmstxt.org/) endpoints that give AI agents a machine-readable summary of the API:

```bash
# Short summary (suitable for system prompts)
curl https://your-domain.com/public/v1/llms.txt

# Full specification (all endpoints and field types)
curl https://your-domain.com/public/v1/llms-full.txt
```

Embed the content of `llms.txt` in your system prompt to give the agent context about what content is available and how to access it:

```
[System prompt]
You are a content assistant for a developer blog. You have access to the following CMS API:

{contents of llms.txt}

Use the API to answer questions about our content and help draft new articles.
```

## Reading Content (No Auth Required)

### Discover available content

```bash
# Step 1: Get the API overview and form set list
curl https://your-domain.com/public/v1/llms.txt

# Step 2: Browse the sitemap to see what content exists
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

async function fetchEntry(formSetSlug: string, entrySlug: string) {
  const res = await fetch(`${BASE_URL}/form-sets/${formSetSlug}/entries/${entrySlug}`, {
    redirect: 'follow',  // automatically follow 301 redirects on slug changes
  })
  if (res.status === 404) throw new Error(`Entry not found: ${entrySlug}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}
```

## Writing Content via the Agent API

Use an API key to create, update, and publish entries from an AI agent.

### List form sets

```bash
curl https://your-domain.com/admin/v1/form-sets \
  -H "Authorization: Bearer luno_agent_your-api-key"
```

### Create an entry

```bash
curl -X POST "https://your-domain.com/admin/v1/form-sets/{formSetId}/entries" \
  -H "Authorization: Bearer luno_agent_your-api-key" \
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

### Update a revision

```bash
curl -X PATCH "https://your-domain.com/admin/v1/revisions/{revisionId}" \
  -H "Authorization: Bearer luno_agent_your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "title": "Updated Title",
      "body": "<p>Updated body content...</p>"
    }
  }'
```

### Publish a revision

```bash
curl -X POST "https://your-domain.com/admin/v1/revisions/{revisionId}/publish" \
  -H "Authorization: Bearer luno_agent_your-api-key"
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
| 401 | `UNAUTHORIZED` | API key is invalid or missing |
| 403 | `PLAN_REQUIRED` | Full-text search (`?q=`) requires Business plan+ |
| 404 | `NOT_FOUND` | Verify the slug is spelled correctly |
| 301 | — | Slug changed — follow the `Location` header |
| 304 | — | Content unchanged — use cached version |

## Best Practices

1. **Start with `llms.txt`** to understand what content types are available
2. **Use `include_snapshot=true`** on list requests to avoid per-entry round trips
3. **Follow 301 redirects** — slugs can change after entries are renamed
4. **Cache with ETags** — send `If-None-Match` to avoid re-downloading unchanged content
5. **Check `offset + limit >= total`** to determine if there are more pages
6. **Review before publishing** — use the draft → pending_review → published workflow even for AI-generated content

## Next Steps

- [AI Assist](/en/guide/ai-assist) — AI features inside the admin panel
- [Public API Reference](/en/api/public-api) — Complete endpoint specifications
- [API Overview](/en/api/overview) — Authentication and rate limits
