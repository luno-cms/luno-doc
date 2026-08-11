---
title: Astro レシピ
description: Astro から LUNO 公開 API で一覧・詳細を読む最短例。SSG / ハイブリッド向け。
prev:
  text: Next.js
  link: /ja/guide/frameworks/nextjs
next:
  text: Nuxt
  link: /ja/guide/frameworks/nuxt
---

# Astro

経路 **C · API only** — フロントマターで公開エントリを読む最短例です。

::: tip 今すぐやる（3 行）
1. `LUNO_PROJECT_ID` を `.env` に置く  
2. 下の一覧ページを貼って `astro dev`  
3. OGP は [SEO・サイトマップ](/ja/guide/seo) の Astro 例へ  
:::

## 環境変数

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

## 一覧

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

## 詳細

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

静的パスが必要な場合は `getStaticPaths` で同じ一覧エンドポイントから `slug` を生成してください。

## 次の一手

| 目的 | ページ |
|---|---|
| ほかの FW | [Next.js](/ja/guide/frameworks/nextjs) · [Nuxt](/ja/guide/frameworks/nuxt) |
| API 全体 | [公開 API](/ja/api/public-api#api-only) |
| OGP | [SEO・サイトマップ](/ja/guide/seo) |
| 再ビルド連携 | [Webhooks](/ja/products/webhooks) |
