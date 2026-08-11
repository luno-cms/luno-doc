---
title: Next.js recipe
description: Shortest App Router examples to list and read LUNO Public API entries, plus ISR / webhook revalidation links.
prev:
  text: Framework recipes
  link: /en/guide/frameworks/
next:
  text: Astro
  link: /en/guide/frameworks/astro
---

# Next.js

Path **C · API only** — shortest App Router examples for published entries.

::: tip Do this now (3 lines)
1. Put `LUNO_PROJECT_ID` in `.env.local`  
2. Paste the list page below and run `pnpm dev`  
3. For post-publish revalidation, go to [Webhooks](/en/api/webhooks)  
:::

## Environment

```bash
# .env.local
LUNO_PROJECT_ID=your-project-id
# Only if the site requires a public API key
# LUNO_PUBLIC_API_KEY=luno_pub_…
```

```ts
// lib/luno.ts
const PROJECT_ID = process.env.LUNO_PROJECT_ID!
export const LUNO_BASE = `https://api.luno.rest/public/p/${PROJECT_ID}/v1`

export function lunoHeaders(): HeadersInit {
  const key = process.env.LUNO_PUBLIC_API_KEY
  return key ? { 'X-Luno-Public-Api-Key': key } : {}
}
```

## List (App Router)

```ts
// app/blog/page.tsx
import { LUNO_BASE, lunoHeaders } from '@/lib/luno'

export default async function BlogPage() {
  const res = await fetch(
    `${LUNO_BASE}/form-sets/blog/entries?include_snapshot=true&sort=updated_at:desc`,
    {
      headers: lunoHeaders(),
      next: { revalidate: 60 },
    }
  )
  const { items } = await res.json()

  return (
    <ul>
      {items.map(({ entry, published }: any) => (
        <li key={entry.slug}>
          <a href={`/blog/${entry.slug}`}>
            {published.snapshot?.title ?? entry.slug}
          </a>
        </li>
      ))}
    </ul>
  )
}
```

## Detail

```ts
// app/blog/[slug]/page.tsx
import { LUNO_BASE, lunoHeaders } from '@/lib/luno'

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const res = await fetch(
    `${LUNO_BASE}/form-sets/blog/entries/${slug}?include_snapshot=true`,
    {
      headers: lunoHeaders(),
      next: { revalidate: 60 },
    }
  )
  if (!res.ok) return <p>Not found</p>
  const { data, mediaUrls } = await res.json()

  return (
    <article>
      <h1>{data.title}</h1>
      {mediaUrls?.cover && <img src={mediaUrls.cover} alt="" />}
      <div dangerouslySetInnerHTML={{ __html: data.body }} />
    </article>
  )
}
```

## Refresh cache after publish

See [Webhooks · Next.js](/en/api/webhooks#nextjs-app-router) for `revalidatePath` / `revalidateTag` patterns on `entry.published`.

## Next

| Goal | Page |
|---|---|
| Other stacks | [Astro](/en/guide/frameworks/astro) · [Nuxt](/en/guide/frameworks/nuxt) |
| Full API | [Public API](/en/api/public-api#api-only) |
| OGP / sitemap | [SEO & sitemaps](/en/guide/seo) |
| Drop-in embed | [Embed & Pub](/en/products/embed) |
