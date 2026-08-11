---
title: Form Builder
description: How to create form sets (content types) in luno HCMS and a complete reference for all field types, their configuration options, and API response formats.
prev:
  text: Content management
  link: /en/guide/content-management
next:
  text: Media
  link: /en/guide/media
---

# Form Builder

A **Form Set** is luno's content model. It defines the structure of a category of content by combining typed fields. Create one form set for each type of content you manage — "Blog Posts", "News", "Products", "Team Members", etc.

::: tip Do this now (3 lines)
1. **Settings → Form Sets → New** (display name + slug)  
2. Add 2–3 required fields and save  
3. Create one entry, then hit `/form-sets/{slug}/entries` on the Public API  
:::

## Creating a Form Set

1. Admin panel sidebar → **Settings → Form Sets**
2. Click **New Form Set**
3. Enter a display name (e.g., `Blog`) and a slug (e.g., `blog`)
4. Add fields and save

::: warning Slug naming rules
The slug is used in the public API URL: `/public/v1/form-sets/blog/entries`. Use only lowercase letters, numbers, and hyphens. Changing the slug after content is published will change the API URL for all entries in this form set.
:::

### AI field suggestions

When creating a new form set, describe your use case in plain text and the AI will suggest a field structure:

**Example:** "I want to manage technical blog posts. I need a title, body, author, tags, thumbnail image, publish date, and SEO meta fields."

→ The AI suggests:
```
- title           (text, required, localizable)
- body            (tiptap, required, localizable)
- author          (entry_ref → authors form set)
- tags            (multiselect)
- thumbnail       (image)
- published_date  (date)
- meta_description (textarea, localizable)
- og_image        (image)
```

## Field Types Reference

| Type | UI Control | Localizable | API value type |
|---|---|:---:|---|
| `text` | Single-line input | ✓ | `string` |
| `url` | URL input | — | `string` |
| `textarea` | Multi-line input | ✓ | `string` |
| `tiptap` | WYSIWYG rich text editor | ✓ | Tiptap doc (JSON) or `string` |
| `number` | Numeric input | — | `number` |
| `boolean` | Checkbox / toggle | — | `boolean` |
| `date` | Date/time picker | — | `string` (ISO 8601) or `{ from, to }` |
| `select` | Dropdown | — | `string` (master value) |
| `radio` | Radio buttons | — | `string` (master value) |
| `multiselect` | Multi-select checkboxes | — | `string[]` |
| `image` | Image upload | — | `string` (asset UUID) |
| `image_gallery` | Image gallery | — | UUID string or `{ assetId, caption? }[]` |
| `file` | File upload | — | `string` (asset UUID) |
| `video_embed` | Video embed URL input | — | `string` (URL) |
| `entry_ref` | Reference to another entry | — | `string` (referenced entry UUID) |

## Field Type Details

### text — Single-line text

```json
{
  "type": "text",
  "key": "title",
  "label": "Title",
  "required": true,
  "localizable": true,
  "minLength": 1,
  "maxLength": 200
}
```

API response:
```json
{ "data": { "title": "My First Post" } }
```

Use for: titles, headings, short labels, taglines. Supports localization.

### textarea — Multi-line plain text

```json
{
  "type": "textarea",
  "key": "summary",
  "label": "Summary",
  "required": false,
  "localizable": true,
  "maxLength": 500
}
```

API response:
```json
{ "data": { "summary": "A brief summary of the article." } }
```

Use for: excerpts, meta descriptions, short descriptions without HTML formatting.

### tiptap — Rich text (WYSIWYG)

```json
{
  "type": "tiptap",
  "key": "body",
  "label": "Body",
  "required": true,
  "localizable": true
}
```

API response:
```json
{
  "data": {
    "body": "<h2>Introduction</h2><p>Body text here. <strong>Bold</strong> works.</p>"
  }
}
```

Supported formatting: headings (H1–H6), bold, italic, underline, strikethrough, ordered and unordered lists, links, inline images, code blocks, blockquotes, tables.

::: tip Rendering rich text
The value is an HTML string. In React, use `dangerouslySetInnerHTML` with `__html: content`. In Vue, use `v-html`. Consider sanitizing if user-generated content flows into this field.
:::

### number — Numeric value

```json
{
  "type": "number",
  "key": "price",
  "label": "Price",
  "required": true,
  "min": 0,
  "max": 9999999
}
```

API response:
```json
{ "data": { "price": 1980 } }
```

Supports integers and decimals. Use for: prices, quantities, sort order, ratings.

### boolean — True/false toggle

```json
{
  "type": "boolean",
  "key": "is_featured",
  "label": "Featured",
  "defaultValue": false
}
```

API response:
```json
{ "data": { "is_featured": true } }
```

Use for: flags, feature toggles, visibility switches.

### date — Date or date-time

```json
{
  "type": "date",
  "key": "published_date",
  "label": "Published Date",
  "required": false,
  "includeTime": false
}
```

API response:
```json
{ "data": { "published_date": "2025-01-15" } }
```

With `includeTime: true`, returns a full ISO 8601 datetime: `"2025-01-15T09:00:00Z"`.

### select / radio — Single selection

```json
{
  "type": "select",
  "key": "category",
  "label": "Category",
  "required": true,
  "options": [
    { "value": "news", "label": "News" },
    { "value": "blog", "label": "Blog" },
    { "value": "case-study", "label": "Case Study" }
  ]
}
```

API response:
```json
{ "data": { "category": "blog" } }
```

`select` renders as a dropdown; `radio` renders as radio buttons. Options can come from a static list or from master data.

### multiselect — Multiple selection

```json
{
  "type": "multiselect",
  "key": "tags",
  "label": "Tags",
  "options": [
    { "value": "cloudflare", "label": "Cloudflare" },
    { "value": "cms", "label": "CMS" },
    { "value": "api", "label": "API" }
  ]
}
```

API response:
```json
{ "data": { "tags": ["cloudflare", "api"] } }
```

### image — Image upload

```json
{
  "type": "image",
  "key": "cover",
  "label": "Cover Image",
  "required": false
}
```

API response:
```json
{
  "data": { "cover": "550e8400-e29b-41d4-a716-446655440001" },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001"
  }
}
```

`data[key]` contains the asset UUID. `mediaUrls[key]` contains the full CDN URL. Supported formats: JPEG, PNG, WebP, GIF, SVG.

### file — File upload

```json
{
  "type": "file",
  "key": "attachment",
  "label": "Attachment",
  "accept": ["application/pdf"]
}
```

Same response structure as image: `data[key]` is the UUID, `mediaUrls[key]` is the full URL.

### video_embed — Video embed URL

```json
{
  "type": "video_embed",
  "key": "video",
  "label": "Video"
}
```

API response:
```json
{ "data": { "video": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } }
```

Stores an embed URL (YouTube, Vimeo, etc.), not a video file upload.

### entry_ref — Entry reference (Business plan+)

```json
{
  "type": "entry_ref",
  "key": "author",
  "label": "Author",
  "targetFormSet": "authors",
  "required": true
}
```

API response:
```json
{ "data": { "author": "7c9e6679-7425-40de-944b-e07fc1f90ae7" } }
```

References an entry in another form set within the same project. The value in `data[key]` is the referenced entry's **UUID** (not slug). Use for: author profiles, related articles, product categories.

::: warning Plan requirement
`entry_ref` requires the Business plan or above.
:::

## Common Field Settings

| Setting | Description |
|---|---|
| **Label** | Display name in the admin panel |
| **Key** | The key in the API `data` object (lowercase and underscores only) |
| **Required** | Saving or submitting fails if empty |
| **Localizable** | Enable per-locale values (`text`, `textarea`, `tiptap` only) |
| **Description** | Hint text shown below the input in the admin panel |
| **Hidden** | Hide from the entry list view (still included in API responses) |

## Master Data Integration

Options for `select`, `radio`, and `multiselect` can come from **Master Data** instead of a static list. Master data is a shared option list that multiple form sets can reference — ideal for shared taxonomies like regions, industries, or product categories.

## List View Configuration

Configure which columns appear in the admin entry list and the default sort order for each form set. This also affects the default behavior of the `?sort` query parameter in the public API.

## Form Set Templates

Save commonly used form set configurations as reusable templates. You can also generate a form set from a predefined blueprint (e.g., "Blog", "Landing Page", "FAQ", "Product Catalog").

## Full API Response Example

```json
{
  "formSet": { "id": "uuid", "slug": "blog", "name": "Blog" },
  "entry": { "id": "uuid", "slug": "my-first-post" },
  "revision": { "id": "uuid", "revision": 3, "updatedAt": "2025-01-15T10:00:00Z" },
  "data": {
    "title": "My First Post",
    "summary": "A quick summary.",
    "body": "<h2>Introduction</h2><p>...</p>",
    "cover": "asset-uuid",
    "category": "blog",
    "tags": ["cloudflare", "cms"],
    "is_featured": true,
    "published_date": "2025-01-15",
    "author": "jane-doe"
  },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/asset-uuid"
  },
  "widgetRoles": {
    "title": "title",
    "cover": "thumbnail",
    "summary": "description"
  }
}
```

## Next Steps

- [Media Management](/en/guide/media) — Uploading and serving images and files
- [Content Management](/en/guide/content-management) — Entry lifecycle and approval workflow
- [Public API Reference](/en/api/public-api) — How to fetch field values via the API
