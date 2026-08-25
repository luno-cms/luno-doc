---
title: Headless CMS · Backend capability
description: Headless CMS is a LUNO Backend Platform capability—not the product category. Form sets, entries, approval, publish.
prev:
  text: Done state C · API only
  link: /en/guide/paths/api
next:
  text: Contact Form
  link: /en/products/contact
---

# Headless CMS

Headless CMS is a **capability of the LUNO Backend Platform**, not the product category.

```text
LUNO
└── AI-era Backend Platform
    ├── Agent Backend
    ├── Headless CMS   ← this page
    ├── Forms
    ├── Auth
    ├── Storage
    └── APIs
```

See [Docs Home · Agent Backend](/en/#agent-backend) for BUILD / OPERATE / GOVERN. This page is the content capability: define, create, approve, and publish in one flow. Form Sets shape the model; entries and revisions manage versions; public API, Pub, and Embed deliver the result.

Do not read “LUNO is a CMS” as the category claim. CMS, forms, and publishing sit under the platform.

## What you have (done state)

| Item | State |
|---|---|
| Form Set | A type you want to publish (e.g. blog) exists |
| Entry | At least one **Published** entry |
| Delivery | List / single entry work on the Public API |
| (Optional) | Used review approval or scheduled publish once |

## When to use

- Structured content: blog, news, case studies, product info
- Team workflows that need approval
- Delivery via API, embed, or Pub after publish

## Checklist

- [ ] You know the form set slug
- [ ] An entry is **Published**
- [ ] Bodies return with `include_snapshot=true`
- [ ] (Optional) Media appears in `mediaUrls`

## Do this now

1. Pick a path — [B · Console done state](/en/guide/paths/console) or [A · Agents done state](/en/guide/paths/agents)
2. Publish one entry (Console or agent)
3. Verify via Public API

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
const res = await fetch(
  `${BASE}/form-sets/blog/entries?include_snapshot=true`
)
const data = await res.json()
```

```bash [MCP]
# "List published blog entries with bodies"
```

:::

4. Model design: [Form builder](/en/guide/form-builder). Approvals: [Content management](/en/guide/content-management).

## Next

| Goal | Page |
|---|---|
| Platform model | [Docs Home · Agent Backend](/en/#agent-backend) |
| Path B · Console | [Done state](/en/guide/paths/console) |
| Path A · Agents | [Done state](/en/guide/paths/agents) |
| Field design | [Form builder](/en/guide/form-builder) |
| Approvals & revisions | [Content management](/en/guide/content-management) |
| Scheduled publishing | [Scheduled publishing](/en/guide/schedule) |
