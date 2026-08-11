---
title: Nuxt recipe
description: Shortest Nuxt examples to list and read LUNO Public API entries with useFetch.
prev:
  text: Astro
  link: /en/guide/frameworks/astro
next:
  text: Public API
  link: /en/api/public-api
---

# Nuxt

Path **C · API only** — shortest `useFetch` examples for published entries.

::: tip Do this now (3 lines)
1. Put `NUXT_PUBLIC_LUNO_PROJECT_ID` in `.env`  
2. Paste the list page below and run `nuxt dev`  
3. For post-publish refresh, go to [Webhooks](/en/products/webhooks)  
:::

## Environment

```bash
# .env
NUXT_PUBLIC_LUNO_PROJECT_ID=your-project-id
# Only if the site requires a public API key (server-side)
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

## List

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

## Detail

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

If a public API key is required, attach `X-Luno-Public-Api-Key` only in server-side `$fetch` (or a Nitro route). Do not put the key in `NUXT_PUBLIC_*`.

## Next

| Goal | Page |
|---|---|
| Other stacks | [Next.js](/en/guide/frameworks/nextjs) · [Astro](/en/guide/frameworks/astro) |
| Full API | [Public API](/en/api/public-api#api-only) |
| Webhooks | [Webhooks](/en/products/webhooks) |
| Drop-in embed | [Embed & Pub](/en/products/embed) |
