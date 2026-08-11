---
title: 経路 C · API only — 完成形
description: スタート経路 C · API only。約 3 分後の完成形、確認チェックリスト、今すぐやる手順。
prev:
  text: 完成形 B · Console
  link: /ja/guide/paths/console
next:
  text: Content
  link: /ja/products/content
---

# 経路 C · API only — 完成形

約 3 分後、**管理画面を開かずに公開コンテンツを読める**状態になります（公開済みプロジェクトがある前提）。

## できていること

| 項目 | 状態 |
|---|---|
| ベース URL | `/public/p/{projectId}/v1` を使っている |
| 発見 | `llms.txt` で公開フォームセット / エントリが分かる |
| 取得 | 一覧・単体（`include_snapshot=true`）が取れる |
| （任意）キー | 必須設定なら `X-Luno-Public-Api-Key` を付けている |

## 確認チェックリスト

- [ ] `projectId` を用意した
- [ ] `llms.txt` が 200 で返る
- [ ] エントリ一覧（`include_snapshot=true`）が取れる
- [ ] （任意）サイトに Embed または自前 fetch を繋いだ

## 今すぐやる

1. `projectId` を取得する（プロジェクト設定、または MCP `get_public_api_info`）
2. 公開インデックスを読む

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/llms.txt"
```

```ts [JS]
const text = await fetch(
  'https://api.luno.rest/public/p/{projectId}/v1/llms.txt'
).then((r) => r.text())
```

```bash [MCP]
# 「この projectId の llms.txt を読んで公開構造を要約して」
```

:::

3. エントリを本文付きで取る

```bash
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true"
```

4. エンドポイント全体は [公開 API · API only](/ja/api/public-api#api-only) へ

## 次の一手

| 目的 | ページ |
|---|---|
| エンドポイント一覧 | [公開 API](/ja/api/public-api#api-only) |
| サイトに繋ぐ | [フレームワーク別レシピ](/ja/guide/frameworks/)（Next.js / Astro / Nuxt） |
| 埋め込みで載せる | [Embed & Pub](/ja/products/embed) |
| 公開イベントで再生成 | [Webhooks](/ja/products/webhooks) |
| 中身を書く | [経路 A · Agents](/ja/guide/paths/agents) / [経路 B · Console](/ja/guide/paths/console) |
