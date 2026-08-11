---
title: Embed & Pub · API only
description: LUNO Embed & Pub — widget.js, iframe, pub.luno.rest. Done-state checklist and do-now steps (pairs with path C API only).
prev:
  text: Contact
  link: /en/products/contact
next:
  text: AI Agents
  link: /en/products/agents
---

# Embed & Pub

Surfaces for putting published content **on an existing site**. Use widget / iframe snippets, or host list and detail pages on `pub.luno.rest`.

## What you have (done state)

| Item | State |
|---|---|
| Published content | Form set has at least one published entry |
| Widget | Published widget id (`luno-…`) |
| Key | Public API key (`luno_pub_…`) issued |
| Display | Snippet on a page; list (or detail) renders |

## When to use

- Embed a news list on a corporate site or landing page
- Ship look-and-feel without a full custom frontend
- Validate delivery before building a custom Headless UI

## Checklist

- [ ] Widget published; you have a `luno-…` id
- [ ] Public API key issued
- [ ] Embed snippet placed on a page
- [ ] List (or detail) visible in the browser

## Do this now

1. Create and publish a widget in Console; issue a public API key
2. Paste the snippet

::: code-group

```html [HTML]
<div id="luno-list"
     data-api-key="luno_pub_xxxxxxxx"
     data-api-url="https://api.luno.rest"
     data-widget-id="luno-abcdef12">
</div>
<script src="https://api.luno.rest/public/v1/embed/luno-abcdef12.js?api_key=luno_pub_xxxxxxxx" async></script>
```

```ts [JS]
const mount = document.getElementById('luno-list')!
mount.dataset.apiKey = 'luno_pub_xxxxxxxx'
mount.dataset.apiUrl = 'https://api.luno.rest'
mount.dataset.widgetId = 'luno-abcdef12'
const s = document.createElement('script')
s.src =
  'https://api.luno.rest/public/v1/embed/luno-abcdef12.js?api_key=luno_pub_xxxxxxxx'
s.async = true
document.body.appendChild(s)
```

```bash [MCP]
# "Give me the embed snippet for the published widget"
```

:::

3. Details: [Embed on your site](/en/guide/embed). Custom UI: [Path C · API only](/en/guide/paths/api).

## Next

| Goal | Page |
|---|---|
| Embed steps | [Embed on your site](/en/guide/embed) |
| Path C · API only | [Done state](/en/guide/paths/api) |
| SEO & sitemaps | [SEO & sitemaps](/en/guide/seo) |
