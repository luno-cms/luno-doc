---
title: Widget Embedding
description: Embed luno content into any external site with a single script tag. Covers widget types, data attributes, CSS customization, and the JavaScript API.
---

# Widget Embedding

luno widgets let you display CMS-managed content on any external site using **a single `<script>` tag**. WordPress sites, static HTML pages, marketing landing pages — any site that can run JavaScript can embed luno content without a framework.

## Basic Embedding

```html
<!-- Step 1: Add the script tag to your page -->
<script
  src="https://your-domain.com/public/v1/widget.js"
  defer
></script>

<!-- Step 2: Place a div where you want content to appear -->
<div
  data-luno-widget="content"
  data-form-set="blog"
  data-entry="my-first-post"
></div>
```

After the script loads, every element with a `data-luno-widget` attribute is automatically replaced with the corresponding content.

## Widget Types

### Single entry (`data-luno-widget="content"`)

Displays the content of one specific entry.

```html
<!-- Show the latest announcement from the news form set -->
<div
  data-luno-widget="content"
  data-form-set="news"
  data-entry="latest-announcement"
  data-locale="en"
></div>
```

### Entry list (`data-luno-widget="list"`)

Displays a paginated list of entries from a form set.

```html
<!-- Show the 5 most recent blog posts -->
<div
  data-luno-widget="list"
  data-form-set="blog"
  data-limit="5"
  data-locale="en"
></div>
```

## data Attribute Reference

| Attribute | Description | Default | Required for |
|---|---|---|---|
| `data-luno-widget` | Widget type: `content` or `list` | — | Both |
| `data-form-set` | Form set slug | — | Both |
| `data-entry` | Entry slug | — | `content` type |
| `data-limit` | Number of entries to show | `10` | `list` type |
| `data-locale` | Locale code (e.g., `en`, `ja`) | — | Optional |
| `data-template` | Custom template ID | — | Optional |
| `data-sort` | Sort key (e.g., `created_at:desc`) | — | `list` type |

## Customization

Go to **Widgets → Settings** in the admin panel to configure the appearance.

### Field display selection

Choose which fields are displayed and in what order. For example, in a blog listing you might show only "title", "published_date", and "thumbnail".

### Widget roles

Assign semantic roles to fields so templates can apply appropriate styles automatically:

| Role | Effect |
|---|---|
| `title` | Rendered as a heading (`<h2>`, etc.) |
| `thumbnail` | Rendered as a featured image |
| `description` | Rendered as a summary paragraph |
| `date` | Rendered as a formatted date string |
| `category` | Rendered as a category badge |

### CSS customization

Write custom CSS in the admin panel, or let the AI generate it for you.

**AI CSS generation example:**

Prompt: "Dark theme. Full-width cards. Background color shifts on hover. System fonts."

→ The AI generates:

```css
.luno-widget {
  background: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.luno-widget-item {
  background: #242424;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: background-color 0.15s ease;
  border: 1px solid #333;
}

.luno-widget-item:hover {
  background: #2a2a2a;
}

.luno-widget-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 0.5rem;
}

.luno-widget-description {
  font-size: 0.875rem;
  color: #aaaaaa;
  line-height: 1.6;
  margin: 0;
}
```

You can fine-tune the generated CSS in the admin editor.

## JavaScript API

After the widget script loads, a `window.luno` object is available for programmatic control.

### Manual rendering

```javascript
document.addEventListener('DOMContentLoaded', () => {
  window.luno.render(document.getElementById('my-widget'), {
    formSet: 'blog',
    entry: 'my-post',
    locale: 'en',
  })
})
```

### Fetch data only (bring your own template)

If you want to use luno data but render with your own markup:

```javascript
// Fetch a list of entries
const { items } = await window.luno.fetchList('blog', {
  limit: 5,
  locale: 'en',
})

items.forEach(({ entry, published }) => {
  const title = published.snapshot?.title
  const coverUrl = published.mediaUrls?.cover
  console.log(entry.slug, title, coverUrl)
})
```

```javascript
// Fetch a single entry
const entry = await window.luno.fetchEntry('blog', 'my-first-post', {
  locale: 'en',
})
console.log(entry.data.title)
console.log(entry.mediaUrls.cover)
```

### Event listeners

```javascript
// Fires when a widget finishes rendering
document.addEventListener('luno:rendered', (e) => {
  console.log('Widget rendered:', e.detail.widgetId)
})

// Fires if a widget fails to load data
document.addEventListener('luno:error', (e) => {
  console.error('Widget error:', e.detail.error)
})
```

## Caching Behavior

| Resource | Cache-Control |
|---|---|
| `widget.js` script | `public, max-age=300` (5 minutes) |
| Content data | `public, max-age=60` (1 minute, with ETag) |
| Images and media | `public, max-age=31536000` (1 year) |

After publishing a content update, the widget refreshes within 1 minute.

## WordPress Integration

Add the widget script in your theme's `functions.php`:

```php
function add_luno_widget_script() {
  wp_enqueue_script(
    'luno-widget',
    'https://your-domain.com/public/v1/widget.js',
    [],
    null,
    true  // load in footer
  );
}
add_action('wp_enqueue_scripts', 'add_luno_widget_script');
```

Then use a Custom HTML block to place the widget div anywhere in your content.

## Next Steps

- [AI Assist](/en/guide/ai-assist) — AI-generated CSS for widget styling
- [Content Management](/en/guide/content-management) — Managing the content your widgets display
- [Public API Reference](/en/api/public-api) — Direct API access for custom integrations
