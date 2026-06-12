---
title: API 概要
description: luno の公開 API・管理 API・エージェント API の認証方式、ベース URL、レスポンス形式、エラーコード、ページネーション、キャッシュ、CORS を説明します。
---

# API 概要

luno は用途に応じた 3 つの API を提供しています。フロントエンドからのコンテンツ取得・管理操作・AI エージェントとの連携、それぞれに適した API を使い分けてください。

## API の種類

### 公開 API（Public API）

**ベース URL：** `https://{your-domain}/public/v1`

| 項目 | 詳細 |
|---|---|
| **認証** | 不要（API キー・トークンなし） |
| **CORS** | `Access-Control-Allow-Origin: *`（すべてのオリジンを許可） |
| **用途** | 公開コンテンツの取得・コンタクトフォーム送信・メディア配信 |
| **主なクライアント** | ブラウザ・CDN・AI エージェント・外部システム |

```bash
# 認証なしで直接呼び出せる
curl https://your-domain.com/public/v1/form-sets/blog/entries
```

### 管理 API（Admin API）

**ベース URL：** `https://{your-domain}/admin/v1`

| 項目 | 詳細 |
|---|---|
| **認証** | JWT Bearer トークン必須 |
| **用途** | コンテンツ作成・編集・承認・メンバー管理・設定変更 |
| **主なクライアント** | luno 管理画面（Admin SPA）|

```bash
# JWT トークンが必要
curl https://your-domain.com/admin/v1/form-sets \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### エージェント API（Agent API）

**ベース URL：** `https://{your-domain}/admin/v1`（管理 API と同じ）

| 項目 | 詳細 |
|---|---|
| **認証** | エージェント API キー（`sk-agent-` プレフィックス） |
| **用途** | AI エージェント・自動化からのコンテンツ / スキーマ操作 |
| **キーの発行** | 管理画面「設定」→「エージェント API キー」（`/settings/api-keys`） |
| **スコープ** | `content`（記事運用）/ `schema`（Form Set・Contact セットアップ） |

```bash
curl https://api.luno.rest/admin/v1/form-sets \
  -H "Authorization: Bearer sk-agent-xxxxxxxx"
```

## 認証の詳細

### JWT 認証（管理 API）

管理画面へのログイン後、`POST /admin/v1/auth/login/password` でトークンを取得します。トークンは HS256 署名付き JWT で、有効期限は設定に依存します。

```bash
# ログインしてトークンを取得
curl -X POST https://your-domain.com/admin/v1/auth/login/password \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@example.com", "password": "your-password" }'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": "uuid", "email": "admin@example.com" }
}
```

以降のリクエストでは `Authorization: Bearer <token>` ヘッダーを付けます。

### エージェント API キー認証

キーは管理画面から発行します：

1. 「設定」→「エージェント API キー」→「新規作成」
2. 名前とスコープ（`content` または `schema`）を選択
3. 表示されたキー（`sk-agent-…`）を安全な場所に保存

初期セットアップのみ **`schema`** キーを使い、完了後は revoke して日常運用は **`content`** キーを使うことを推奨します。エージェントキーでは Form Set / Contact Form の削除はできません。

::: warning キーの取り扱い
API キーは発行時に一度だけ表示されます。GitHub リポジトリやフロントエンドのコードに直接埋め込まないでください。サーバーサイドの環境変数として管理してください。
:::

## レスポンス形式

すべてのレスポンスは `Content-Type: application/json` です。

### 成功レスポンス（単一リソース）

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "slug": "my-first-post",
  "data": {
    "title": "はじめての投稿",
    "body": "<p>本文...</p>"
  },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/asset-uuid"
  }
}
```

### 成功レスポンス（一覧）

```json
{
  "items": [
    {
      "entry": { "id": "uuid", "slug": "my-post" },
      "published": { "revisionId": "uuid", "revision": 2, "updatedAt": "2025-01-15T10:00:00Z" }
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

### エラーレスポンス

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Published entry not found"
  }
}
```

## エラーコード一覧

| コード | HTTP ステータス | 説明 | 対処 |
|---|---|---|---|
| `NOT_FOUND` | 404 | リソースが見つからない | slug や ID を確認 |
| `VALIDATION_ERROR` | 400 | リクエストパラメータ不正 | エラーメッセージで詳細を確認 |
| `UNAUTHORIZED` | 401 | 認証が必要（トークン未設定・期限切れ） | 再ログインしてトークンを更新 |
| `FORBIDDEN` | 403 | 権限不足 | 上位ロールのユーザーで操作 |
| `PLAN_REQUIRED` | 403 | 上位プランが必要な機能 | プランをアップグレード |
| `CONFLICT` | 409 | 競合（slug 重複など） | 別の slug を使用 |
| `INTERNAL_ERROR` | 500 | サーバー内部エラー | 時間を置いて再試行、解消しない場合はサポートへ |

## ページネーション

一覧エンドポイントはページネーションをサポートします。

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `page` | integer | `1` | ページ番号（1 始まり） |
| `limit` | integer | `20` | 1 ページあたりの件数（最大 100） |
| `offset` | integer | — | オフセット指定（`page` の代わりに使用可） |

### 全件取得のサンプルコード

```typescript
async function fetchAllEntries(formSetSlug: string) {
  const BASE = 'https://your-domain.com/public/v1'
  const all: unknown[] = []
  let page = 1
  const limit = 100

  while (true) {
    const res = await fetch(
      `${BASE}/form-sets/${formSetSlug}/entries?page=${page}&limit=${limit}&include_snapshot=true`
    )
    const { items, total, offset } = await res.json()
    all.push(...items)

    if (offset + limit >= total) break
    page++
  }

  return all
}
```

## キャッシュと ETag

公開 API はすべてのレスポンスに `ETag` ヘッダーを付与します。クライアントは `If-None-Match` ヘッダーを送ることで、コンテンツが変更されていない場合に `304 Not Modified` を受け取れます。

```http
# 初回リクエスト
GET /public/v1/form-sets/blog/entries/my-post HTTP/1.1

← HTTP 200
← ETag: "550e8400e29b41d4a716446655440000"
← Cache-Control: public, max-age=60

# 2 回目（キャッシュ検証）
GET /public/v1/form-sets/blog/entries/my-post HTTP/1.1
If-None-Match: "550e8400e29b41d4a716446655440000"

← HTTP 304 Not Modified（変更なしの場合、ボディなし）
```

`Cache-Control: public, max-age=60` も付与されるため、CDN（Cloudflare、Fastly など）によるキャッシュも自動的に有効です。

## CORS

公開 API はすべてのオリジンからのアクセスを許可します：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

ブラウザから直接 `fetch()` でアクセスできます。CORS 回避のためのプロキシ設定は不要です。

## レート制限

| API | 制限 |
|---|---|
| 公開 API | Cloudflare Workers の標準制限に準拠 |
| 管理 API | プランにより異なる |
| エージェント API | API キーごとに設定可能 |

::: tip キャッシュで制限を緩和
`ETag` / `If-None-Match` を活用することでリクエスト数を大幅に削減できます。コンテンツが変更されていない場合の `304` レスポンスはカウントが少なくなります。
:::

## 次のステップ

- [公開 API リファレンス](/ja/api/public-api) — 全エンドポイントの詳細仕様
- [AI エージェント向けガイド](/ja/api/ai-agents) — API キーと MCP サーバーの設定
- [Webhook](/ja/api/webhooks) — イベント通知の設定
