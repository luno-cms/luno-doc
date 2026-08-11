---
title: Masters
description: LUNO Masters — entities, records, site publish, and Public API. Done-state checklist and do-now steps.
prev:
  text: Webhooks
  link: /en/products/webhooks
next:
  text: Public API keys
  link: /en/products/public-api-keys
---

# Masters

Manage shared options (categories, tags, and more) as **master entities + records**, and reference them from Form Set select / radio fields. After you publish a master to the site, the Public API can read it.

## Done state

| Item | State |
|---|---|
| Entity | At least one master with a `key` |
| Records | `value` (locale-stable) and `label` (display) filled |
| Site publish | Published to site in Console (unpublished masters are omitted from Public API) |
| Public API | `master-entities` / `.../records` return 200 |
| Optional | Subscribed to `master.published` webhooks |

## When to use

- Shared options across Form Sets
- Building filter UIs from the Public API
- Seeding master definitions via Agents / Blueprint

## Checklist

- [ ] Created entity + records under Console **Masters**
- [ ] Ran **Publish to site** (empty masters cannot publish)
- [ ] `GET .../master-entities/{key}/records?locale=ja` returns `value` / `label`
- [ ] Form Set select references the master; published snapshots store **value**

## Do this now

1. Create a master and add records (`value` = stable id, `label` = display name)
2. **Publish to site**
3. Verify via Public API

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/master-entities"
curl "https://api.luno.rest/public/p/{projectId}/v1/master-entities/category/records?locale=ja"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
const entities = await fetch(`${BASE}/master-entities`).then((r) => r.json())
const records = await fetch(
  `${BASE}/master-entities/category/records?locale=ja`
).then((r) => r.json())
```

```bash [MCP]
# “Create a category master, publish to site, and verify public records”
```

:::

4. Wire the master into a Form Set select / radio and publish an entry

## Next

| Goal | Page |
|---|---|
| Endpoints | [Public API · Masters](/en/api/public-api#masters) |
| Field wiring | [Form builder](/en/guide/form-builder) |
| `master.published` | [Webhooks](/en/products/webhooks) |
| Blueprint / MCP | [AI Agents guide](/en/api/ai-agents) |
