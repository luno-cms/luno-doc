---
title: Framework recipes
description: Thin recipes to read the LUNO Public API from Next.js, Astro, and Nuxt. Path C · API only.
prev:
  text: Done state C · API only
  link: /en/guide/paths/api
next:
  text: Next.js
  link: /en/guide/frameworks/nextjs
---

# Framework recipes

Continuation of path **C · API only**. These pages show the shortest Public API wiring for each stack (`/public/p/{projectId}/v1`). Full endpoint specs live in the [Public API](/en/api/public-api#api-only).

## Pick a stack

| Framework | Best for | Page |
|---|---|---|
| **Next.js** | App Router, ISR, webhook revalidation | [Next.js](/en/guide/frameworks/nextjs) |
| **Astro** | SSG / hybrid content sites | [Astro](/en/guide/frameworks/astro) |
| **Nuxt** | Vue, `useFetch`, server fetches | [Nuxt](/en/guide/frameworks/nuxt) |

No framework? Use [Embed & Pub](/en/products/embed).

## Shared prerequisites

1. Have a `projectId` (project settings, or MCP `get_public_api_info`)
2. Have a published form set (e.g. `blog`)
3. Prefer base URL **`https://api.luno.rest/public/p/{projectId}/v1`**

If the site requires a public API key, send `X-Luno-Public-Api-Key: luno_pub_…`.

## Smoke check

```bash
curl "https://api.luno.rest/public/p/{projectId}/v1/llms.txt"
```

## Next

| Goal | Page |
|---|---|
| Full endpoints | [Public API](/en/api/public-api#api-only) |
| Rebuild on publish | [Webhooks](/en/products/webhooks) |
| SEO / OGP | [SEO & sitemaps](/en/guide/seo) |
