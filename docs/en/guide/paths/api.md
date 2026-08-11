---
title: Path C · API only — Done state
description: What you have after ~3 minutes with the Public API, plus a checklist.
prev:
  text: Path B · Console
  link: /en/guide/paths/console
next:
  text: Public API
  link: /en/api/public-api#api-only
---

# Path C · API only — Done state

In about 3 minutes you can **read published content without opening the admin console** (assumes a project with published content).

## What you have

| Item | State |
|---|---|
| Base URL | Using `/public/p/{projectId}/v1` |
| Discovery | `llms.txt` shows public form sets / entries |
| Fetch | List and single entry (`include_snapshot=true`) work |
| (Optional) key | Sending `X-Luno-Public-Api-Key` if the site requires it |

## Checklist

1. You have a `projectId` (MCP `get_public_api_info` or project settings)
2. These return 200 with Markdown / JSON

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/llms.txt"
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
const llms = await fetch(`${BASE}/llms.txt`).then((r) => r.text())
const list = await fetch(
  `${BASE}/form-sets/blog/entries?include_snapshot=true`
).then((r) => r.json())
```

```bash [MCP]
# Agent prompt example: "Read llms.txt for this projectId and summarize the public structure"
```

:::

3. (Optional) Wired [Embed](/en/products/embed) or your own fetch on the site

## Next

| Goal | Page |
|---|---|
| Endpoint reference | [Public API](/en/api/public-api#api-only) |
| Drop-in UI | [Embed & Pub](/en/products/embed) |
| Rebuild on publish | [Webhooks](/en/products/webhooks) |
| Write content | [Path A · Agents](/en/guide/paths/agents) / [Path B · Console](/en/guide/paths/console) |
