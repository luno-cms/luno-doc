---
title: Nuxt レシピ
description: Nuxt から LUNO 公開 API で一覧・詳細を読む最短例。useFetch / サーバ側取得。
prev:
  text: Astro
  link: /ja/guide/frameworks/astro
next:
  text: 公開 API
  link: /ja/api/public-api
---

# Nuxt

経路 **C · API only** — `useFetch` で公開エントリを読む最短例です。

::: tip 今すぐやる（3 行）
1. `NUXT_PUBLIC_LUNO_PROJECT_ID` を `.env` に置く  
2. 下の一覧ページを貼って `nuxt dev`  
3. 公開後の再検証は [Webhooks](/ja/products/webhooks) へ  
:::

## 環境変数

```bash
# .env
NUXT_PUBLIC_LUNO_PROJECT_ID=your-project-id
# 公開 API キー必須のサイトのみ（サーバ側で付与）
# NUXT_LUNO_PUBLIC_API_KEY=luno_pub_…
```

```ts
// composables/useLuno.ts
export function useLunoBase() {
  const config = useRuntimeConfig()
  const id = config.public.lunoProjectId as string
  return `https://api.luno.rest/public/p/${id}/v1`
}
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    lunoPublicApiKey: process.env.NUXT_LUNO_PUBLIC_API_KEY || '',
    public: {
      lunoProjectId: process.env.NUXT_PUBLIC_LUNO_PROJECT_ID || '',
    },
  },
})
```

## 一覧

```vue
<!-- pages/blog/index.vue -->
<script setup lang="ts">
const base = useLunoBase()
const { data } = await useFetch(`${base}/form-sets/blog/entries`, {
  query: { include_snapshot: 'true', sort: 'updated_at:desc' },
})
</script>

<template>
  <ul>
    <li v-for="item in data?.items ?? []" :key="item.entry.slug">
      <NuxtLink :to="`/blog/${item.entry.slug}`">
        {{ item.published?.snapshot?.title ?? item.entry.slug }}
      </NuxtLink>
    </li>
  </ul>
</template>
```

## 詳細

```vue
<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const base = useLunoBase()
const { data, error } = await useFetch(
  `${base}/form-sets/blog/entries/${route.params.slug}`,
  { query: { include_snapshot: 'true' } }
)
</script>

<template>
  <p v-if="error">Not found</p>
  <article v-else-if="data">
    <h1>{{ data.data.title }}</h1>
    <img v-if="data.mediaUrls?.cover" :src="data.mediaUrls.cover" alt="" />
    <div v-html="data.data.body" />
  </article>
</template>
```

公開 API キーが必要な場合は、サーバ専用の `$fetch`（`server/` や `useRequestFetch`）側で `X-Luno-Public-Api-Key` を付けてください。キーを `NUXT_PUBLIC_*` に載せないでください。

## 次の一手

| 目的 | ページ |
|---|---|
| ほかの FW | [Next.js](/ja/guide/frameworks/nextjs) · [Astro](/ja/guide/frameworks/astro) |
| API 全体 | [公開 API](/ja/api/public-api#api-only) |
| Webhook | [Webhooks](/ja/products/webhooks) |
| Embed で載せる | [Embed & Pub](/ja/products/embed) |
