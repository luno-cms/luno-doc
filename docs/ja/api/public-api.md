---
title: 公開 API リファレンス
description: luno の公開 API 全エンドポイントの仕様、クエリパラメータ、リクエスト・レスポンス例を詳しく説明します。認証不要。
---

# 公開 API リファレンス

**ベース URL：** `https://{your-domain}/public/v1`

認証不要。すべてのレスポンスは `Content-Type: application/json` です（`/media/:assetId` と XML エンドポイントを除く）。

---

## フォームセット

### GET /form-sets/:slug

フォームセットのメタ情報と、そのプライマリエントリ（slug: `main` を優先）の公開コンテンツを返します。

**パラメータ**

| パラメータ | 場所 | 型 | 説明 |
|---|---|---|---|
| `slug` | パス | string | フォームセットの slug |
| `locale` | クエリ | string | ロケール（例: `ja`, `en`） |

**リクエスト例**

```bash
curl https://your-domain.com/public/v1/form-sets/settings?locale=ja
```

**レスポンス例（200）**

```json
{
  "formSet": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "settings",
    "name": "サイト設定",
    "description": null
  },
  "entry": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "slug": "main"
  },
  "revision": {
    "id": "a2f3d4e5-...",
    "revision": 3,
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "data": {
    "site_name": "My Website",
    "tagline": "最高のヘッドレス CMS",
    "logo": "asset-uuid",
    "primary_color": "#3b82f6"
  },
  "mediaUrls": {
    "logo": "https://your-domain.com/public/v1/media/asset-uuid"
  }
}
```

---

### GET /form-sets/:formSetSlug/entries

フォームセットの公開エントリ一覧を返します。

**パラメータ**

| パラメータ | 場所 | 型 | デフォルト | 説明 |
|---|---|---|---|---|
| `formSetSlug` | パス | string | — | フォームセットの slug |
| `page` | クエリ | integer | `1` | ページ番号（1 始まり） |
| `limit` | クエリ | integer | `20` | 1 ページあたりの件数（最大 `100`） |
| `offset` | クエリ | integer | — | オフセット（`page` の代わりに指定可） |
| `locale` | クエリ | string | — | ロケールフィルター（例: `ja`） |
| `q` | クエリ | string | — | 全文検索キーワード（Business プラン以上） |
| `sort` | クエリ | string | — | ソートキー（例: `created_at:desc`, `updated_at:asc`） |
| `include_snapshot` | クエリ | boolean | `false` | `true` でフィールド値・mediaUrls を含める |

**リクエスト例**

```bash
# ページ 1 を取得（デフォルト）
curl "https://your-domain.com/public/v1/form-sets/blog/entries"

# フィールド値付きで 5 件取得
curl "https://your-domain.com/public/v1/form-sets/blog/entries?limit=5&include_snapshot=true"

# 全文検索（Business プラン以上）
curl "https://your-domain.com/public/v1/form-sets/blog/entries?q=cloudflare&locale=ja"

# 更新日時降順でソート
curl "https://your-domain.com/public/v1/form-sets/blog/entries?sort=updated_at:desc"
```

**レスポンス例（200）**

```json
{
  "formSet": {
    "id": "uuid",
    "slug": "blog",
    "name": "ブログ",
    "description": null
  },
  "total": 42,
  "limit": 20,
  "offset": 0,
  "items": [
    {
      "entry": {
        "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "slug": "my-first-post"
      },
      "published": {
        "revisionId": "a2f3d4e5-...",
        "revision": 2,
        "updatedAt": "2025-01-15T10:00:00Z"
      }
    },
    {
      "entry": {
        "id": "another-uuid",
        "slug": "second-post"
      },
      "published": {
        "revisionId": "b3e4f5a6-...",
        "revision": 1,
        "updatedAt": "2025-01-10T08:00:00Z"
      }
    }
  ]
}
```

`include_snapshot=true` の場合、各 `published` オブジェクトに `snapshot`（フィールド値）と `mediaUrls` が追加されます：

```json
{
  "items": [
    {
      "entry": { "id": "uuid", "slug": "my-first-post" },
      "published": {
        "revisionId": "uuid",
        "revision": 2,
        "updatedAt": "2025-01-15T10:00:00Z",
        "snapshot": {
          "title": "はじめての投稿",
          "cover": "asset-uuid",
          "category": "blog"
        },
        "mediaUrls": {
          "cover": "https://your-domain.com/public/v1/media/asset-uuid"
        }
      }
    }
  ]
}
```

---

### GET /form-sets/:formSetSlug/entries/:entrySlug

特定エントリの公開コンテンツを返します。slug が変更されていた場合は **HTTP 301** を返します。

**パラメータ**

| パラメータ | 場所 | 型 | 説明 |
|---|---|---|---|
| `formSetSlug` | パス | string | フォームセットの slug |
| `entrySlug` | パス | string | エントリの slug |
| `locale` | クエリ | string | ロケール（例: `ja`, `en`） |

**リクエスト例**

```bash
# 基本取得
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-first-post

# 日本語ロケールで取得
curl "https://your-domain.com/public/v1/form-sets/blog/entries/my-first-post?locale=ja"
```

**レスポンス例（200）**

```json
{
  "formSet": {
    "id": "uuid",
    "slug": "blog",
    "name": "ブログ"
  },
  "entry": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "slug": "my-first-post"
  },
  "revision": {
    "id": "a2f3d4e5-...",
    "revision": 2,
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "data": {
    "title": "はじめての投稿",
    "body": "<h2>はじめに</h2><p>こんにちは、世界！</p>",
    "cover": "asset-uuid-here",
    "category": "blog",
    "tags": ["cloudflare", "cms"],
    "published_date": "2025-01-15",
    "is_featured": true
  },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/asset-uuid-here"
  },
  "widgetRoles": {
    "title": "title",
    "cover": "thumbnail",
    "body": "description"
  }
}
```

**slug 変更時（301）**

```http
HTTP/1.1 301 Moved Permanently
Location: /public/v1/form-sets/blog/entries/new-slug
```

---

## コンテンツ参照

### GET /content/by-path

インポートパスからコンテンツを取得します。外部システムからデータを移行した後に旧 URL でコンテンツを引けるようにする際に使用します。

**パラメータ**

| パラメータ | 場所 | 型 | 説明 |
|---|---|---|---|
| `path` | クエリ | string | インポート時に設定したパス（必須） |
| `locale` | クエリ | string | ロケール（任意） |

**リクエスト例**

```bash
curl "https://your-domain.com/public/v1/content/by-path?path=/old-system/articles/123"
```

レスポンスは `GET /form-sets/:slug/entries/:slug` と同形式。

---

### GET /content/by-slug

フォームセット slug とエントリ slug をクエリパラメータ形式で指定してコンテンツを取得します。

**パラメータ**

| パラメータ | 場所 | 型 | 説明 |
|---|---|---|---|
| `formSetSlug` | クエリ | string | フォームセットの slug（必須） |
| `slug` | クエリ | string | エントリの slug（必須） |
| `locale` | クエリ | string | ロケール（任意） |

```bash
curl "https://your-domain.com/public/v1/content/by-slug?formSetSlug=blog&slug=my-post&locale=ja"
```

---

### GET /content/by-external-id

外部システムのエンティティ ID からコンテンツを取得します。

**パラメータ**

| パラメータ | 場所 | 型 | 最大長 | 説明 |
|---|---|---|---|---|
| `sourceType` | クエリ | string | 50 | 外部システム名（例: `wordpress`, `shopify`） |
| `entityType` | クエリ | string | 200 | エンティティ種別（例: `post`, `product`） |
| `externalId` | クエリ | string | 2000 | 外部システムの ID（必須） |
| `locale` | クエリ | string | — | ロケール（任意） |

```bash
curl "https://your-domain.com/public/v1/content/by-external-id?sourceType=wordpress&entityType=post&externalId=12345"
```

---

## プレビュー

### GET /preview/revisions

署名付き JWT トークンを使って、未公開リビジョンのコンテンツをプレビューします。

**パラメータ**

| パラメータ | 場所 | 型 | 説明 |
|---|---|---|---|
| `token` | クエリ | string | 管理画面から発行した JWT トークン（必須） |

```bash
curl "https://your-domain.com/public/v1/preview/revisions?token=eyJhbGciOiJIUzI1NiJ9..."
```

| ケース | レスポンス |
|---|---|
| 有効なトークン | 200 + エントリ詳細（draft も含む） |
| トークン期限切れ | 401 `UNAUTHORIZED` |
| トークン不正 | 401 `UNAUTHORIZED` |

トークンは管理画面のエントリ編集画面から生成できます（有効期限 **15 分**）。

---

## メディア

### GET /media/:assetId

アップロードされたメディアファイルを返します。

**パラメータ**

| パラメータ | 場所 | 型 | 説明 |
|---|---|---|---|
| `assetId` | パス | string（UUID） | メディアの asset ID |

```bash
# 画像を取得
curl https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001

# WebP を要求（対応ブラウザのみ）
curl -H "Accept: image/webp" \
  https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001
```

**レスポンスヘッダー**

```http
Content-Type: image/jpeg
Cache-Control: public, max-age=31536000
ETag: "abc123def456"
```

---

## サイトマップ

### GET /sitemap.xml

全フォームセットの全公開エントリを含む XML サイトマップを返します。

```bash
curl https://your-domain.com/public/v1/sitemap.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.com/blog/my-first-post</loc>
    <lastmod>2025-01-15T10:00:00Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### GET /form-sets/:slug/sitemap.xml

特定フォームセットのエントリのみを含む XML サイトマップを返します。

```bash
curl https://your-domain.com/public/v1/form-sets/blog/sitemap.xml
```

---

## SEO

### GET /form-sets/:formSetSlug/entries/:entrySlug/schema.json

schema.org JSON-LD を返します。`<script type="application/ld+json">` に埋め込みます。

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-post/schema.json
```

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "はじめての投稿",
  "description": "記事の説明文",
  "image": "https://your-domain.com/public/v1/media/asset-uuid",
  "datePublished": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T10:00:00Z",
  "author": { "@type": "Organization", "name": "My Blog" }
}
```

### GET /form-sets/:formSetSlug/entries/:entrySlug/ogp.json

OGP メタ情報を JSON 形式で返します。

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-post/ogp.json
```

```json
{
  "og:title": "はじめての投稿",
  "og:description": "記事の説明文",
  "og:image": "https://your-domain.com/public/v1/media/asset-uuid",
  "og:url": "https://your-site.com/blog/my-post",
  "og:type": "article",
  "og:site_name": "My Blog",
  "twitter:card": "summary_large_image"
}
```

---

## コンタクトフォーム

### POST /contact-forms/:slug/submit

コンタクトフォームにデータを送信します。

```
POST /public/v1/contact-forms/contact/submit
Content-Type: application/json
```

```bash
curl -X POST https://your-domain.com/public/v1/contact-forms/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "山田 太郎",
    "email": "yamada@example.com",
    "message": "お問い合わせ内容をここに記入します。"
  }'
```

**成功レスポンス（200）**

```json
{
  "ok": true,
  "submissionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

**バリデーションエラー（400）**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email is required"
  }
}
```

---

## AI エージェント向け

### GET /llms.txt

AI クローラー・エージェント向けの**公開コンテンツ一覧**（[llms.txt 仕様](https://llmstxt.org/) 準拠）を返します。

```bash
curl https://your-domain.com/public/v1/llms.txt
```

MCP 設定・エージェントキーのスコープ・管理 API の詳細は [AI エージェント向けガイド](/ja/api/ai-agents) を参照してください。

---

## フィールド値の型リファレンス

`data` オブジェクト内のフィールド値の型：

| フィールドタイプ | 型 | 例 |
|---|---|---|
| `text` | `string` | `"はじめての投稿"` |
| `textarea` | `string` | `"複数行\nテキスト"` |
| `tiptap` | `string`（HTML） | `"<h2>見出し</h2><p>本文</p>"` |
| `number` | `number` | `1980` |
| `boolean` | `boolean` | `true` |
| `date` | `string`（ISO 8601） | `"2025-01-15"` または `"2025-01-15T09:00:00Z"` |
| `select` / `radio` | `string` | `"blog"` |
| `multiselect` | `string[]` | `["tag1", "tag2"]` |
| `image` / `file` | `string`（asset UUID） | `"550e8400-..."` |
| `video_embed` | `string`（URL） | `"https://youtube.com/..."` |
| `entry_ref` | `string`（entry slug） | `"author-yamada"` |

`image` / `file` の UUID は `mediaUrls[fieldKey]` で完全 URL に解決されます。
