---
title: SEO & Sitemaps
description: luno auto-generates XML sitemaps, OGP meta tags, and schema.org JSON-LD for every published entry. Learn how to integrate them into Next.js, Astro, and other frameworks.
---

# SEO & Sitemaps

luno generates SEO-critical data automatically for every published entry: XML sitemaps, Open Graph metadata, and schema.org JSON-LD. Slug renames trigger automatic 301 redirects to preserve search rankings.

## XML Sitemaps

### Full sitemap

```
GET /public/v1/sitemap.xml
```

Returns an XML sitemap covering **all published entries across all form sets** in your project. Submit this URL to Google Search Console to help search engines discover your content efficiently.

```bash
curl https://your-domain.com/public/v1/sitemap.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.com/blog/my-first-post</loc>
    <lastmod>2025-01-15T10:00:00Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-site.com/news/product-launch</loc>
    <lastmod>2025-01-10T09:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Per-form-set sitemap

```
GET /public/v1/form-sets/{slug}/sitemap.xml
```

Returns a sitemap for a single form set. Useful when you want to manage sitemaps per content type.

```bash
curl https://your-domain.com/public/v1/form-sets/blog/sitemap.xml
```

### Next.js sitemap integration

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch luno's sitemap XML
  const res = await fetch(
    `${process.env.LUNO_BASE_URL}/public/v1/sitemap.xml`,
    { next: { revalidate: 3600 } }
  )
  const xml = await res.text()

  // Parse URLs from the XML (use xml2js, fast-xml-parser, or a simple regex)
  const urls = parseUrlsFromSitemap(xml)

  return urls.map(({ loc, lastmod }) => ({
    url: loc,
    lastModified: new Date(lastmod),
  }))
}
```

::: tip Registering with Google Search Console
1. Open Google Search Console
2. Go to **Indexing → Sitemaps**
3. Enter `https://your-domain.com/public/v1/sitemap.xml` and click **Submit**
:::

## OGP Metadata

```
GET /public/v1/form-sets/{formSetSlug}/entries/{entrySlug}/ogp.json
```

Returns Open Graph Protocol metadata as a JSON object. Use this to set the `<meta>` tags that control how your content appears when shared on social media.

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-post/ogp.json
```

Response:

```json
{
  "og:title": "My First Post | My Blog",
  "og:description": "A concise description of the article.",
  "og:image": "https://your-domain.com/public/v1/media/cover-asset-uuid",
  "og:url": "https://your-site.com/blog/my-post",
  "og:type": "article",
  "og:site_name": "My Blog",
  "twitter:card": "summary_large_image"
}
```

### Next.js generateMetadata

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const res = await fetch(
    `${process.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${params.slug}/ogp.json`
  )
  const ogp = await res.json()

  return {
    title: ogp['og:title'],
    description: ogp['og:description'],
    openGraph: {
      title: ogp['og:title'],
      description: ogp['og:description'],
      images: [{ url: ogp['og:image'] }],
      url: ogp['og:url'],
      type: 'article',
      siteName: ogp['og:site_name'],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogp['og:title'],
      description: ogp['og:description'],
      images: [ogp['og:image']],
    },
  }
}
```

### Astro

```astro
---
const { slug } = Astro.params
const ogpRes = await fetch(
  `${import.meta.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${slug}/ogp.json`
)
const ogp = await ogpRes.json()
---

<head>
  <title>{ogp['og:title']}</title>
  <meta name="description" content={ogp['og:description']} />
  <meta property="og:title" content={ogp['og:title']} />
  <meta property="og:description" content={ogp['og:description']} />
  <meta property="og:image" content={ogp['og:image']} />
  <meta property="og:url" content={ogp['og:url']} />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

## schema.org JSON-LD

```
GET /public/v1/form-sets/{formSetSlug}/entries/{entrySlug}/schema.json
```

Returns structured data in [schema.org](https://schema.org) JSON-LD format. Embedding this in `<script type="application/ld+json">` enables rich results in Google Search (article dates, breadcrumbs, etc.).

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-post/schema.json
```

Response:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "My First Post",
  "description": "A concise description.",
  "image": "https://your-domain.com/public/v1/media/cover-uuid",
  "datePublished": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T10:00:00Z",
  "author": { "@type": "Organization", "name": "My Blog" },
  "publisher": {
    "@type": "Organization",
    "name": "My Blog",
    "logo": { "@type": "ImageObject", "url": "https://your-site.com/logo.png" }
  }
}
```

### Next.js integration

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const [postRes, schemaRes] = await Promise.all([
    fetch(`${process.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${params.slug}`),
    fetch(`${process.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${params.slug}/schema.json`),
  ])
  const post = await postRes.json()
  const schema = await schemaRes.json()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article>
        <h1>{post.data.title as string}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.data.body as string }} />
      </article>
    </>
  )
}
```

## SEO Field Configuration

Add dedicated SEO fields to your form set so editors can customize meta information per entry:

### Recommended SEO field layout

| Field key | Type | Used as |
|---|---|---|
| `title` | text | Page title and `og:title` |
| `meta_description` | textarea | `<meta name="description">` and `og:description` |
| `og_image` | image | `og:image` (1200×630 px recommended) |

### SEO roles in form set settings

Go to **Form Sets → [your form set] → SEO Settings** to map which field is used for each SEO role. If not configured, luno infers from common field names (`title`, `body`, etc.).

## Slug Redirects

When you rename an entry's slug, luno automatically creates a 301 redirect from the old URL to the new one:

```
Old: GET /public/v1/form-sets/blog/entries/old-slug
→  HTTP 301 Moved Permanently
   Location: /public/v1/form-sets/blog/entries/new-slug
```

This preserves inbound links and search engine equity when you restructure your content.

### Following redirects in code

```typescript
// fetch follows redirects by default (redirect: 'follow')
const res = await fetch(
  `${process.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${slug}`,
  { redirect: 'follow' }
)
if (res.status === 404) notFound()
return res.json()
```

## robots.txt

luno does not serve a `robots.txt` file. Configure it at your frontend hosting level:

```
User-agent: *
Allow: /

Sitemap: https://your-domain.com/public/v1/sitemap.xml
```

## Next Steps

- [Media Management](/en/guide/media) — Uploading OGP cover images
- [Public API Reference](/en/api/public-api) — Sitemap and OGP endpoint specs
- [Content Management](/en/guide/content-management) — Slug changes and automatic redirects
