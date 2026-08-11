---
title: フレームワーク別レシピ
description: Next.js / Astro / Nuxt から公開 API でコンテンツを読む最短レシピ。経路 C · API only。
prev:
  text: 完成形 C · API only
  link: /ja/guide/paths/api
next:
  text: Next.js
  link: /ja/guide/frameworks/nextjs
---

# フレームワーク別レシピ

経路 **C · API only** の続きです。公開 API（`/public/p/{projectId}/v1`）をフロントに繋ぐ最短例だけを置きます。仕様の全体は [公開 API](/ja/api/public-api#api-only) を参照してください。

## 選ぶ

| フレームワーク | 向いていること | ページ |
|---|---|---|
| **Next.js** | App Router・ISR・Webhook 再検証 | [Next.js](/ja/guide/frameworks/nextjs) |
| **Astro** | SSG / ハイブリッド・コンテンツサイト | [Astro](/ja/guide/frameworks/astro) |
| **Nuxt** | Vue・`useFetch`・サーバ側取得 | [Nuxt](/ja/guide/frameworks/nuxt) |

フレームワークなしで載せるなら [Embed & Pub](/ja/products/embed) です。

## 共通の前提

1. `projectId` を用意する（プロジェクト設定、または MCP `get_public_api_info`）
2. 公開済みフォームセット（例: `blog`）がある
3. ベース URL は **`https://api.luno.rest/public/p/{projectId}/v1`**（推奨）

サイト設定で公開 API キー必須の場合は、ヘッダー `X-Luno-Public-Api-Key: luno_pub_…` を付けます。

## 今すぐ確認

```bash
curl "https://api.luno.rest/public/p/{projectId}/v1/llms.txt"
```

## 次の一手

| 目的 | ページ |
|---|---|
| エンドポイント一覧 | [公開 API](/ja/api/public-api#api-only) |
| 公開イベントで再生成 | [Webhooks](/ja/products/webhooks) |
| SEO / OGP | [SEO・サイトマップ](/ja/guide/seo) |
