---
title: AI Agents (MCP) guide · Path A
description: Start path A · Agents (MCP). Setup, agent API key scopes (full/content/schema), llms.txt, and content operations.
prev:
  text: Done state A · Agents
  link: /en/guide/paths/agents
next:
  text: Public API
  link: /en/api/public-api
---

# AI Agents Guide

::: tip Start path A
This is the deep guide for the **Agents (MCP)** path. For the map of all paths, see [Quick start](/en/guide/getting-started) and the [AI Agents overview](/en/products/agents).
:::

This guide explains how AI agents build and operate LUNO backends through MCP and the Agent API, and how production changes can be governed through permissions, review, and approval.

## Agent lifecycle

### BUILD — create/configure schemas, forms, content structures

Agents apply blueprints and builtin templates, create contact forms, and read field types / schema before writing.

### OPERATE — read/create/update/revise/publish via MCP or Agent API

Content, schemas, forms, media, revisions, and publishing are exposed as agent-operable **backend resources**.

### GOVERN — scoped keys, review/approval, production safety controls

Humans keep production authority. See [Production Safety for AI Agents](/en/guide/production-safety).

## Overview

luno supports three integration models for AI agents:

| Method | Auth | Capability |
|---|---|---|
| **Public API** | None | Read published content |
| **MCP Server** | Agent API key | Content and schema ops via Claude Code / Cursor / Codex |
| **Agent API** | Agent API key | Same Admin API routes, programmatic access |

**MCP package:** [`@luno-cms/mcp`](https://www.npmjs.com/package/@luno-cms/mcp) (`npx -y @luno-cms/mcp`)

**Client support:** Claude Code, Cursor, and Codex are all **Verified** (Golden Path E2E: apply builtin template → create/save/publish entry → funnel events).

## MCP Server Setup

LUNO ships an MCP server that lets Claude Code, Cursor, Codex, and other MCP-compatible agents **build and operate LUNO backends** through natural language.

Content, schemas, forms, media, revisions, and publishing are exposed as agent-operable **backend resources**. See [Production Safety](/en/guide/production-safety) for how those operations stay bounded.

**Package:** [`@luno-cms/mcp`](https://www.npmjs.com/package/@luno-cms/mcp) — the npm README is the canonical setup guide.

### Recommended: existing site + Cursor / Claude Code / Codex

From the **root of your site repository**:

```bash
cd my-existing-site
npx @luno-cms/mcp setup
# → pick 1) Claude Code  2) Cursor  3) Codex
```

| Choice | What gets written |
|---|---|
| Claude Code | `.claude/skills/luno/` + `.mcp.json` |
| Cursor | `.cursor/skills/luno/` + `.cursor/mcp.json` |
| Codex | `.agents/skills/luno/` + `.codex/config.toml` |

**Keys live under `.agents/luno/`** (gitignored; only `*.example` is committed):

| File | Role |
|---|---|
| `.agents/luno/dev.env` | Local API (`http://127.0.0.1:8787/admin`) |
| `.agents/luno/stg.env` | Staging (`https://stg-api.luno.rest/admin`) |
| `.agents/luno/prod.env` | Production (`https://api.luno.rest/admin`) |
| `.agents/luno/env` | Active env (updated by `env switch`) |

Each `*.env` holds:

```bash
LUNO_API_URL=https://api.luno.rest/admin
LUNO_AGENT_KEY=sk-agent-xxxxxxxx
```

Then:

1. Issue a key in the admin panel (**Settings → Agent API Keys**)
2. Paste it via `/luno` in the agent, or non-interactively:

```bash
npx @luno-cms/mcp env set-key stg 'sk-agent-…'
npx @luno-cms/mcp env switch stg
npx @luno-cms/mcp env status
```

MCP server names: `luno-dev` / `luno-stg` / `luno-prod`  
(`npx @luno-cms/mcp run stg` loads `.agents/luno/stg.env`)

::: tip
Do **not** commit `.agents/luno/*.env`. Keep secrets out of git; use one key per environment / site as needed.
:::

### After setup — client-specific notes

| Client | What to do after `env set-key` / `env switch` |
|---|---|
| **Claude Code** | Restart / reconnect MCP if tools are missing (`/mcp`) |
| **Cursor** | **Settings → MCP**: enable `luno-stg` (green). Open a **new Agent chat** if tools do not appear in an existing chat. Leave `luno-dev` / `luno-prod` Disabled until those keys exist |
| **Codex** | Setup writes project `.codex/config.toml` (with `cwd`) **and** prints `codex mcp add luno-<env> --env LUNO_PROJECT_ROOT="<siteRoot>" -- npx -y @luno-cms/mcp run <env>` because Codex prefers **`~/.codex`**. Interactive setup offers home registration; `--yes` prints commands only. Verify: `codex mcp list` (expect `luno-stg`, etc.). First MCP tool calls may require **approval**. Prefer **`luno-stg`** when that env is active |

### Environment variables (what the MCP process reads)

| Variable | Example | Description |
|---|---|---|
| `LUNO_API_URL` | `https://api.luno.rest/admin` | Admin API base (**include `/admin`**, no trailing slash) |
| `LUNO_AGENT_KEY` | `sk-agent-…` | Agent API key from the admin panel |

Prefer storing these in `.agents/luno/{dev,stg,prod}.env` rather than pasting keys into shared MCP JSON. For local API use `http://127.0.0.1:8787/admin`.

### Alternative: inline `env` in MCP config (Claude Desktop / one-off)

If you are not using `setup` / `.agents/luno/`, you can put the variables directly in the MCP client config.

**Claude Desktop** — edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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

**Cursor** — Settings → MCP, or project `.cursor/mcp.json` with the same shape. The admin panel also shows a copy-paste snippet after you issue a key (**Settings → Agent API Keys**).

For day-to-day site work, prefer `npx @luno-cms/mcp setup` so keys stay in `.agents/luno/` and you can switch `dev` / `stg` / `prod`.

### Troubleshooting for Agents

| Symptom | Likely cause | What to do | Retry same input? |
|---|---|---|---|
| Missing / invalid `slug` or `name` (tool args) | Required args omitted | Pass required fields from the tool description | **No** |
| `Slug already exists for this tenant` (+ `hint`) | Form Set slug collision | `list_form_sets` or pick a new slug | **No** |
| `Slug already exists for this form set` | Entry slug collision | `list_entries` or new slug | **No** |
| `REVISION_CONFLICT` / revision mismatch | Stale `revision` / `revisionRowId` | `list_revisions`; use `save_revision`’s `id` + `revision` for `publish_revision` | **No** |
| `401` / Invalid agent key | Bad or missing key | `npx @luno-cms/mcp env set-key …` then reconnect MCP | **No** |
| `429` / `RATE_LIMITED` | Per-key rate limit exceeded | Wait for `Retry-After` seconds; reduce tight tool loops | **Yes** (after wait) |
| Timeout after create | Network / client abort | Retry with the **same** `idempotencyKey` | **Yes** (keyed creates) |

API errors may include additive `error.hint` and `error.retryable` (OpenAPI `ApiError`). When `retryable` is `false`, change input before calling again.

### Idempotency keys (optional)

Admin UI does not send keys — behavior without a key is unchanged. Agents may pass `idempotencyKey` on major creates (or `Idempotency-Key` header):

| MCP tool | Without key | Same key replay |
|---|---|---|
| `apply_form_blueprint` / `apply_builtin_form_template` | Create / 409 on slug clash | Same 201 body |
| `create_entry` | New row / 409 | Same entry `id` |
| `save_revision` | Always new revision | Same revision row |
| `create_contact_form` | New / 409 | Same `id` |
| `publish_revision` | Existing `already_published` + outbox dedupe | (no extra key needed) |

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
| **`full`** (recommended) | Articles + schema setup | Entries, media, Form Set / Contact / Blueprint |
| **`content`** | Articles only | Read schema, create/update entries, save/publish revisions, list media |
| **`schema`** | Compatibility alias | Same capabilities as `full` |

### Recommended workflow

1. Day-to-day: issue a **`full`** key (or **`content`** if you want articles only)
2. Optional: use a short-lived key for initial blueprint / template apply, then revoke it if you prefer tighter long-lived scopes

### What agent keys cannot do (any scope)

- Delete Form Sets or Contact Forms
- Delete form blocks or field definitions
- Issue other API keys, invite members, or change billing / SNS settings

Calling a schema-only endpoint with a `content` key returns **403 Forbidden**.

## Rate limits

Agent API keys (`sk-agent-…`) are rate-limited on **Admin API** requests. **JWT console sessions are not** limited by this feature.

| Plan | Active keys | Requests / window (per key) |
|---|---|---|
| Free / Solo | **1** | **60** / **60 seconds** |
| Standard / Business / Enterprise | Multiple | **300** / **60 seconds** |

When exceeded:

- HTTP **429**
- Error code **`RATE_LIMITED`**
- Response header **`Retry-After`** (seconds until the window resets, best-effort)

Limits are enforced in-memory per Cloudflare Workers isolate (**best-effort** — not strictly shared across isolates). Normal MCP / Golden Path usage should stay well under the Free tier cap.

::: tip Handling 429 in agents
Respect `Retry-After` before retrying. Batch reads (`get_project_overview`, `list_entries` with pagination) instead of tight tool loops.
:::

## MCP Tools

Tools exposed by `@luno-cms/mcp` (canonical list: [npm README](https://www.npmjs.com/package/@luno-cms/mcp)):

### Resuming an existing project

1. **`get_project_overview`** — inventory summary (recommended first call)
2. Then `get_form_set_schema` / `list_entries` as needed
3. Separate from the Golden Path for new sites (builtin template → entry → publish)

### Content (`content` / `full`)

| Tool | Description |
|---|---|
| `get_project_overview` | Project summary (form sets, contact forms, masters, storage, login appearance, IP allowlist, locales, public API) |
| `get_tenant_schema` | Project-wide schema (all form sets) |
| `list_form_sets` / `get_form_set_schema` | Form set list and field definitions (`masterEntityKey` / sampleValues for selects) |
| `get_public_api_info` | `projectId` and Public API base (`/public/p/{projectId}/v1`) |
| `list_entries` / `get_entry` | Entry list and detail |
| `create_entry` / `update_entry` | Create entries and update slugs |
| `list_revisions` / `save_revision` / `publish_revision` | Revision workflow |
| `submit_entry_for_review` | Submit for approval |
| `list_media` / `upload_media` | Media list and upload (`filePath` / `sourceUrl` / `base64`) |
| `list_master_entities` / `get_master_entity` | Master entities |
| `list_master_records` / `create_master_record` | Master records (list / create) |
| `update_master_record` / `update_master_tree` | Master updates (**not available with agent keys** — needs user JWT) |
| `get_project_content_locales` | Content locale settings |
| `patch_project_content_locales` | Update locales (**tenant_admin JWT only**) |
| `translate_entry_locales` | AI bulk locale translation (**Standard+**) |
| `search_admin_help` / `get_admin_help_article` / `ask_admin_help` | Admin help KB |
| `get_login_branding` / `get_login_appearance` / `update_login_appearance` | Login branding |
| `list_console_login_ip_allowlists` / `add_…` / `delete_…` | Login IP allowlist (**Business+**) |

### Schema setup (`full` / `schema` required)

| Tool | Admin API |
|---|---|
| `apply_form_blueprint` | `POST /admin/v1/form-blueprints/apply` |
| `validate_master_blueprint` / `apply_master_blueprint` | Validate / apply master blueprints |
| `apply_builtin_form_template` | `POST /admin/v1/form-set-templates/:id/apply` |
| `create_contact_form` / `update_contact_form` | Contact forms (supports `autoreply_*`) |

### dryRun (schema apply preview)

`apply_form_blueprint`, `apply_master_blueprint`, and `apply_builtin_form_template` accept **`dryRun: true`** and return a preview without writing to the database.

CLI equivalents: `hcms form apply --dry-run`, `hcms template apply --dry-run`.

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
You are a content assistant for a developer blog. Available backend content:

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

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true&limit=10"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
const res = await fetch(
  `${BASE}/form-sets/blog/entries?include_snapshot=true&limit=10`
)
const data = await res.json()
```

```bash [MCP]
npx @luno-cms/mcp setup
# Agent prompt example: "List 10 published blog entries with bodies"
```

:::

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
| `text` / `url` | `string` | `"My Post Title"` / `"https://…"` |
| `textarea` | `string` | `"A brief excerpt."` |
| `tiptap` | Tiptap doc (JSON) or `string` | `"<p>Body content</p>"` |
| `number` | `number` | `42` |
| `boolean` | `boolean` | `true` |
| `date` | `string` or `{ from, to }` | `"2025-01-15"` |
| `select` / `radio` | `string` (master **value**) | `"blog"` |
| `multiselect` | `string[]` | `["cloudflare", "cms"]` |
| `image` / `file` | `string` (asset UUID) | `"550e8400-..."` |
| `image_gallery` | UUID string or `{ assetId, caption? }[]` | `[{ "assetId": "…" }]` |
| `video_embed` | `string` (URL) | `"https://youtube.com/..."` |
| `entry_ref` | `string` (referenced entry **UUID**) | `"7c9e6679-..."` |

Resolve `image` / `file` UUIDs using `mediaUrls[fieldKey]` from the response.

## Error Handling

| HTTP Status | Code | How to handle |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Fix the request parameters per the error message |
| 401 | `UNAUTHORIZED` | API key is invalid, revoked, or missing |
| 429 | `RATE_LIMITED` | Wait for `Retry-After` seconds, then retry; reduce parallel tool calls |
| 403 | `FORBIDDEN` | Scope too narrow (e.g., blueprint apply with `content` key) |
| 403 | `PLAN_REQUIRED` | Full-text search (`?q=`) requires Business plan+ |
| 404 | `NOT_FOUND` | Verify the slug or ID |
| 301 | — | Slug changed — follow the `Location` header |
| 304 | — | Content unchanged — use cached version |

## Best Practices

1. **Start with `llms.txt`** to see what published content exists
2. **Prefer `full` day-to-day** — use `content` to restrict to entries; revoke short-lived setup keys when done
3. **Use `include_snapshot=true`** on list requests to avoid per-entry round trips
4. **Follow 301 redirects** — slugs can change after entries are renamed
5. **Cache with ETags** — send `If-None-Match` to avoid re-downloading unchanged content
6. **Review before publishing** — use the draft → pending_review → published workflow even for AI-generated content

## Next Steps

- [Production Safety for AI Agents](/en/guide/production-safety) — scopes, approval, dryRun, idempotency, audit
- [AI Assist](/en/guide/ai-assist) — AI features inside the admin panel
- [Public API Reference](/en/api/public-api) — Complete endpoint specifications
- [API Overview](/en/api/overview) — Authentication and rate limits
- [npm: @luno-cms/mcp](https://www.npmjs.com/package/@luno-cms/mcp) — MCP server package
