---
title: 経路 C · API only — 完成形
description: 公開 API だけで約 3 分後にできている状態と、確認チェックリスト。
prev:
  text: 経路 B · Console
  link: /ja/guide/paths/console
next:
  text: 公開 API
  link: /ja/api/public-api#api-only
---

# 経路 C · API only — 完成形

約 3 分後、**管理画面を開かずに公開コンテンツを読める**状態になります（すでに公開済みのプロジェクトがある前提）。

## できていること

| 項目 | 状態 |
|---|---|
| ベース URL | `/public/p/{projectId}/v1` を使っている |
| 発見 | `llms.txt` で公開フォームセット / エントリが分かる |
| 取得 | 一覧・単体（`include_snapshot=true`）が取れる |
| （任意）キー | サイト設定で必須なら `X-Luno-Public-Api-Key` を付けている |

## 確認チェックリスト

1. `projectId` を用意した（MCP `get_public_api_info` またはプロジェクト設定）
2. 次が 200 で Markdown / JSON を返す

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/llms.txt"
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
const llms = await fetch(`${BASE}/llms.txt`).then((r) => r.text())
const list = await fetch(
  `${BASE}/form-sets/blog/entries?include_snapshot=true`
).then((r) => r.json())
```

```bash [MCP]
# エージェント例: 「projectId の llms.txt を読んで公開構造を要約して」
```

:::

3. （任意）サイトに [埋め込み](/ja/products/embed) または自前 fetch を繋いだ

## 次の一手

| 目的 | ページ |
|---|---|
| エンドポイント一覧 | [公開 API](/ja/api/public-api#api-only) |
| 埋め込みで載せる | [Embed & Pub](/ja/products/embed) |
| 公開イベントで再生成 | [Webhooks](/ja/products/webhooks) |
| 中身を書きたい | [経路 A · Agents](/ja/guide/paths/agents) / [経路 B · Console](/ja/guide/paths/console) |
