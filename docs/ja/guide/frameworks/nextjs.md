---
title: Next.js レシピ
description: App Router から LUNO 公開 API で一覧・詳細を読む最短例。ISR と Webhook 再検証への導線。
prev:
  text: フレームワーク別レシピ
  link: /ja/guide/frameworks/
next:
  text: Astro
  link: /ja/guide/frameworks/astro
---

# Next.js

経路 **C · API only** — App Router で公開エントリを読む最短例です。

::: tip 今すぐやる（3 行）
1. `LUNO_PROJECT_ID` を `.env.local` に置く  
2. 下の一覧ページを貼って `pnpm dev`  
3. 公開後の再検証は [Webhook](/ja/api/webhooks) へ  
:::

## 環境変数

```bash
# .env.local
LUNO_PROJECT_ID=your-project-id
# 公開 API キー必須のサイトのみ
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

## 一覧（App Router）

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

## 詳細

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

## 公開後にキャッシュを更新する

`entry.published` で `revalidatePath` / `revalidateTag` する例は [Webhook · Next.js](/ja/api/webhooks#nextjsapp-router) を参照してください。

## 次の一手

| 目的 | ページ |
|---|---|
| ほかの FW | [Astro](/ja/guide/frameworks/astro) · [Nuxt](/ja/guide/frameworks/nuxt) |
| API 全体 | [公開 API](/ja/api/public-api#api-only) |
| OGP / sitemap | [SEO・サイトマップ](/ja/guide/seo) |
| Embed で載せる | [Embed & Pub](/ja/products/embed) |
