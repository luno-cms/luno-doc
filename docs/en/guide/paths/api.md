---
title: Path C · API only — Done state
description: Start path C · API only. Done state after ~3 minutes, checklist, and do-now steps.
prev:
  text: Done state B · Console
  link: /en/guide/paths/console
next:
  text: Content
  link: /en/products/content
---

# Path C · API only — Done state

In about 3 minutes you can **read published content without opening the admin console** (assumes published content exists).

## What you have

| Item | State |
|---|---|
| Base URL | Using `/public/p/{projectId}/v1` |
| Discovery | `llms.txt` shows public form sets / entries |
| Fetch | List and single entry (`include_snapshot=true`) work |
| (Optional) key | Sending `X-Luno-Public-Api-Key` if required |

## Checklist

- [ ] You have a `projectId`
- [ ] `llms.txt` returns 200
- [ ] Entry list with `include_snapshot=true` works
- [ ] (Optional) Wired Embed or your own fetch on the site

## Do this now

1. Get `projectId` (project settings, or MCP `get_public_api_info`)
2. Read the public index

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/llms.txt"
```

```ts [JS]
const text = await fetch(
  'https://api.luno.rest/public/p/{projectId}/v1/llms.txt'
).then((r) => r.text())
```

```bash [MCP]
# "Read llms.txt for this projectId and summarize the public structure"
```

:::

3. Fetch entries with bodies

```bash
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true"
```

4. Full endpoints: [Public API · API only](/en/api/public-api#api-only)

## Next

| Goal | Page |
|---|---|
| Endpoint reference | [Public API](/en/api/public-api#api-only) |
| Wire a site | [Framework recipes](/en/guide/frameworks/) (Next.js / Astro / Nuxt) |
| Drop-in UI | [Embed & Pub](/en/products/embed) |
| Rebuild on publish | [Webhooks](/en/products/webhooks) |
| Write content | [Path A · Agents](/en/guide/paths/agents) / [Path B · Console](/en/guide/paths/console) |
