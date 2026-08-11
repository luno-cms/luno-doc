---
title: Embed on Your Site
description: Add a script tag and widget ID to display article lists and detail pages on any site—no npm or build step required.
---

# Embed on Your Site

With a public API key and widget ID, you can embed blog lists and article pages on any existing site. **No npm install or build step required.**

**Related**
- Starter repo: [luno-cms/starter-widget](https://github.com/luno-cms/starter-widget)
- Live demo: [luno-starter-widget.pages.dev](https://luno-starter-widget.pages.dev/home.html)
- Full SSR / headless: [Public API reference](/en/api/public-api)

## When to use this approach

| Good fit | Not ideal |
|----------|-----------|
| Add a blog section to WordPress or static HTML | You need full routing / SSR under your control |
| Let luno widgets handle layout and styling | You must not expose API keys in the browser → [BFF sample](https://github.com/luno-cms/luno/tree/main/examples/public-api-bff-proxy) |

## Quick start

### Step 1: Publish a widget in LUNO

1. Admin → form set → **publish** at least one entry
2. Create a widget and save list settings
3. **Publish** a widget revision to get the public id (`luno-xxxxxxxx`)
4. **Settings → Public API keys** → issue a key (`luno_pub_…`)

The widget editor **Embed tags** panel shows a ready-to-copy snippet for your project.

### Step 2: Paste into HTML

```html
<div id="luno-list"
     data-api-key="luno_pub_xxxxxxxx"
     data-api-url="https://api.luno.rest"
     data-widget-id="luno-abcdef12">
</div>
<script src="https://api.luno.rest/public/v1/embed/luno-abcdef12.js?api_key=luno_pub_xxxxxxxx" async></script>
```

| Attribute / URL | Meaning |
|-----------------|--------|
| `data-api-url` | API origin (**no trailing slash**) |
| `data-api-key` | Public API key |
| `data-widget-id` | Published widget public id |
| `embed/….js` | Injects theme, page size, CSS, etc. from your published revision |

Appearance and sort order come from **widget settings in the admin**—you do not need `data-theme` on the div.

### Step 3: Deploy static HTML

Host on Cloudflare Pages, GitHub Pages, or any web server.

Clone [starter-widget](https://github.com/luno-cms/starter-widget), replace placeholders (`YOUR_PUBLIC_API_KEY`, etc.), and deploy.

::: tip Replacing YOUR_API_DOMAIN
Templates use `https://YOUR_API_DOMAIN`. Replace with the **hostname only** (e.g. `api.luno.rest`). Do not include `https://` twice.
:::

## Widget types

### List — `#luno-list` / `[data-luno-list]`

Paginated entry list for main blog pages.

### Latest entries — `[data-luno-top]`

Compact list for home or sidebar.

```html
<div data-luno-top
     data-api-key="luno_pub_…"
     data-api-url="https://api.luno.rest"
     data-widget-id="luno-abcdef12"
     data-count="5"
     data-heading="Latest"
     data-link-pattern="article.html?entry={slug}"
     data-see-more-url="index.html">
</div>
```

### Article detail — `#luno-article` / `[data-luno-article]`

Reads slug from URL, e.g. `article.html?entry=my-post`.

```html
<div id="luno-article"
     data-api-key="luno_pub_…"
     data-api-url="https://api.luno.rest"
     data-widget-id="luno-abcdef12"
     data-show-back="true"
     data-back-label="← Back to list">
</div>
```

### Filters — `[data-luno-filter]`

Use the same widget id in `data-target`.

| `data-type` | Purpose |
|-------------|---------|
| `search` | Keyword |
| `category` | Category |
| `monthly` | Month |
| `tags` | Tags |

One **embed script** per page is enough for list, detail, and filters.

## Multi-page layout

| File | Purpose |
|------|---------|
| `index.html` | List + filters |
| `article.html` | Detail (`?entry=`) |
| `home.html` | Home + latest entries |

See [starters/starter-widget](https://github.com/luno-cms/luno/tree/main/starters/starter-widget).

## Frameworks (React / Next.js)

Copy framework snippets from the widget editor **Embed tags** panel.

Next.js example:

```tsx
"use client";

import Script from "next/script";

const API_URL = process.env.NEXT_PUBLIC_LUNO_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_LUNO_API_KEY!;
const WIDGET_ID = "luno-abcdef12";

export function ArticleList() {
  const scriptSrc = `${API_URL}/public/v1/embed/${WIDGET_ID}.js?api_key=${encodeURIComponent(API_KEY)}`;

  return (
    <>
      <div
        id="luno-list"
        data-api-key={API_KEY}
        data-api-url={API_URL}
        data-widget-id={WIDGET_ID}
      />
      <Script src={scriptSrc} strategy="afterInteractive" />
    </>
  );
}
```

For full SSR, use the [Public API](/en/api/public-api) and SDK starters.

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Blank / no entries | Placeholders not replaced; key, widget id, published entries |
| 401 / 403 | Key is `luno_pub_…`; same project as widget |
| Stale settings | Widget has a **published revision** |
| 404 on embed JS | Widget id and API URL in script `src` |

## Next steps

- [Try starter-widget](https://github.com/luno-cms/starter-widget)
- [Content management](/en/guide/content-management)
- [Public API reference](/en/api/public-api)
