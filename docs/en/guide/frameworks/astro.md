---
title: Astro recipe
description: Shortest Astro examples to list and read LUNO Public API entries for SSG / hybrid sites.
prev:
  text: Next.js
  link: /en/guide/frameworks/nextjs
next:
  text: Nuxt
  link: /en/guide/frameworks/nuxt
---

# Astro

Path **C · API only** — shortest frontmatter fetch examples for published entries.

::: tip Do this now (3 lines)
1. Put `LUNO_PROJECT_ID` in `.env`  
2. Paste the list page below and run `astro dev`  
3. For OGP, see the Astro example in [SEO & sitemaps](/en/guide/seo)  
:::

## Environment

```bash
# .env
LUNO_PROJECT_ID=your-project-id
# LUNO_PUBLIC_API_KEY=luno_pub_…
```

```ts
// src/lib/luno.ts
const PROJECT_ID = import.meta.env.LUNO_PROJECT_ID
export const LUNO_BASE = `https://api.luno.rest/public/p/${PROJECT_ID}/v1`

export function lunoHeaders(): HeadersInit {
  const key = import.meta.env.LUNO_PUBLIC_API_KEY
  return key ? { 'X-Luno-Public-Api-Key': key } : {}
}
```

## List

```astro
---
// src/pages/blog/index.astro
import { LUNO_BASE, lunoHeaders } from '../../lib/luno'

const res = await fetch(
  `${LUNO_BASE}/form-sets/blog/entries?include_snapshot=true&sort=updated_at:desc`,
  { headers: lunoHeaders() }
)
const { items } = await res.json()
---

<ul>
  {items.map(({ entry, published }) => (
    <li>
      <a href={`/blog/${entry.slug}/`}>
        {published.snapshot?.title ?? entry.slug}
      </a>
    </li>
  ))}
</ul>
```

## Detail

```astro
---
// src/pages/blog/[slug].astro
import { LUNO_BASE, lunoHeaders } from '../../lib/luno'

const { slug } = Astro.params
const res = await fetch(
  `${LUNO_BASE}/form-sets/blog/entries/${slug}?include_snapshot=true`,
  { headers: lunoHeaders() }
)
if (!res.ok) return Astro.redirect('/404')
const { data, mediaUrls } = await res.json()
---

<article>
  <h1>{data.title}</h1>
  {mediaUrls?.cover && <img src={mediaUrls.cover} alt="" />}
  <div set:html={data.body} />
</article>
```

For static paths, generate `slug` values from the same list endpoint in `getStaticPaths`.

## Next

| Goal | Page |
|---|---|
| Other stacks | [Next.js](/en/guide/frameworks/nextjs) · [Nuxt](/en/guide/frameworks/nuxt) |
| Full API | [Public API](/en/api/public-api#api-only) |
| OGP | [SEO & sitemaps](/en/guide/seo) |
| Rebuild hooks | [Webhooks](/en/products/webhooks) |
