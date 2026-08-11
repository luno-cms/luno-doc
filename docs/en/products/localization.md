---
title: Localization
description: LUNO content locales — site setup, localizable fields, locale query, AI translation. Done-state checklist and do-now steps.
prev:
  text: Public API keys
  link: /en/products/public-api-keys
next:
  text: Plans
  link: /en/products/plans
---

# Localization

Enable content languages per site. Entry `text` / `textarea` / `tiptap` fields and master `label`s can be per-locale. The Public API resolves them with `?locale=`.

## Done state

| Item | State |
|---|---|
| Site locales | ON under **Settings → Site**, with languages + default locale |
| Fields | text / textarea / tiptap are per-locale (use `locale_shared` when shared) |
| Public check | `?locale=ja` (etc.) returns expected copy |
| Optional | Ran AI locale translation once (**Standard+**) |

## When to use

- Serve the same entry in ja / en (and more)
- Localize master display labels only (`value` stays locale-stable)
- Ask an agent to draft translations (Standard+)

## Plan limits

| Item | Free | Solo / Standard / Business+ |
|---|---|---|
| Content locales feature | Yes | Yes |
| Max locales | **2** | **3** |
| AI locale translation | No | **Standard+** |

Available locale keys: `default` (English), `ja`, `en` (`en` is dropped when both `default` and `en` are present).

## Checklist

- [ ] Turned on **Settings → Site → Content locales**
- [ ] Locale count within plan limit
- [ ] Filled language tabs on an entry and published
- [ ] Filled master `label`s for needed locales
- [ ] Know AI translation is unavailable on Free / Solo

## Do this now

1. Enable locales under **Settings → Site** (e.g. default + `ja`)
2. Edit an entry per language tab and publish
3. Verify via Public API

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries/my-post?locale=ja"
curl "https://api.luno.rest/public/p/{projectId}/v1/master-entities/category/records?locale=ja"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
await fetch(`${BASE}/form-sets/blog/entries/my-post?locale=ja`)
```

```bash [MCP]
# Standard+: “Translate this entry to ja” → translate_entry_locales
# Toggling site locales requires tenant_admin JWT
```

:::

## Next

| Goal | Page |
|---|---|
| Ops detail | [Content management](/en/guide/content-management) |
| AI assist | [AI assist](/en/guide/ai-assist) |
| MCP translation | [AI Agents guide](/en/api/ai-agents) |
| Plan gates | [Plans](/en/products/plans) |
