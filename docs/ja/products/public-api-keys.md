---
title: 公開 API キー
description: LUNO 公開 API キー（luno_pub_…）— 発行、ヘッダー、エージェントキーとの違い。完成形チェックと今すぐやる手順。
prev:
  text: Masters
  link: /ja/products/masters
next:
  text: 多言語
  link: /ja/products/localization
---

# 公開 API キー

公開コンテンツの読み取りや Embed で使うキーです。プレフィックスは **`luno_pub_…`**。管理操作用のエージェントキー（`sk-agent-…`）とは別物です。

## できていること（完成形）

| 項目 | 状態 |
|---|---|
| キー | `luno_pub_…` を発行し、安全に保管している（再表示なし） |
| 呼び出し | ヘッダーまたは Bearer で試行できる |
| 切り分け | Embed / Host 解決用と、Agents 用 `sk-agent-…` を混同していない |

## エージェントキーとの違い

| | 公開 API キー | エージェント API キー |
|---|---|---|
| プレフィックス | `luno_pub_…` | `sk-agent-…` |
| 用途 | 公開読み取り / Embed / Host でのテナント解決 | 管理 API / MCP |
| ベース | `/public/...` | `/admin/v1` |
| 発行 | 設定 → **公開 API キー** | 設定 → **エージェント API キー** |
| プラン | 全プランで発行可 | **Standard 以上** |

## いつ必要か

- **Embed / ウィジェット** — `data-api-key` に必須
- **Host 版** `/public/v1` でキーによりテナントを特定したいとき
- **`/public/p/{projectId}/v1`** — パスに projectId があれば、読み取りは通常キー不要

## 確認チェックリスト

- [ ] Console → **設定 → 公開 API キー** で発行した（tenant_admin）
- [ ] 作成直後にコピーした（あとから見られない）
- [ ] Embed なら `data-api-key`、サーバ取得なら環境変数＋ヘッダー
- [ ] エージェントキーを公開 API に付けていない

## 今すぐやる

1. **設定 → 公開 API キー** で新規作成し、`luno_pub_…` をコピーする
2. 呼び出しを確認する

::: code-group

```bash [curl]
curl -H "X-Luno-Public-Api-Key: luno_pub_…" \
  "https://api.luno.rest/public/v1/form-sets/blog/entries?limit=1"
# または projectId 固定（キーなしでも可）
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?limit=1"
```

```ts [JS]
await fetch('https://api.luno.rest/public/v1/form-sets/blog/entries?limit=1', {
  headers: { 'X-Luno-Public-Api-Key': process.env.LUNO_PUBLIC_API_KEY! },
})
// Authorization: Bearer luno_pub_… でも可
```

```bash [MCP]
# 公開キーは MCP では使わない。エージェントキーは settings → Agent API Keys
```

:::

3. Embed なら [Embed & Pub](/ja/products/embed)、フレームワーク配線は [レシピ](/ja/guide/frameworks/) へ

## 次の一手

| 目的 | ページ |
|---|---|
| 公開エンドポイント | [公開 API](/ja/api/public-api#api-only) |
| Embed | [Embed & Pub](/ja/products/embed) |
| Agents（別キー） | [AI Agents](/ja/products/agents) |
| プラン境界 | [プラン](/ja/products/plans) |
