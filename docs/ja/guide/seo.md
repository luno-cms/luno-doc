---
title: SEO・サイトマップ
description: luno の自動サイトマップ生成・OGP メタ情報・schema.org JSON-LD・slug リダイレクトなど、SEO 向け機能の使い方を説明します。
prev:
  text: スケジュール公開
  link: /ja/guide/schedule
next:
  text: AI アシスト
  link: /ja/guide/ai-assist
---

# SEO・サイトマップ

luno は SEO に必要な機能を標準で提供しています。サイトマップ・OGP・schema.org JSON-LD を自動生成し、slug 変更時の 301 リダイレクトも自動で処理します。

::: tip 今すぐやる（3 行）
1. 公開エントリが 1 件以上あることを確認する  
2. `GET /public/p/{projectId}/v1/sitemap.xml` を開く  
3. フロントの metadata に `ogp.json` / `schema.json` を繋ぐ（任意）  
:::

## サイトマップ

### 全体サイトマップ

```
GET /public/v1/sitemap.xml
```

プロジェクト内の**全フォームセットの全公開エントリ**を含む XML サイトマップを返します。Google Search Console の「サイトマップ」に登録することで、検索エンジンにコンテンツを効率的に伝えられます。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.com/blog/my-first-post</loc>
    <lastmod>2025-01-15T10:00:00Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-site.com/news/important-announcement</loc>
    <lastmod>2025-01-10T09:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### フォームセット別サイトマップ

```
GET /public/v1/form-sets/{slug}/sitemap.xml
```

特定のフォームセットのエントリのみを含むサイトマップです。コンテンツ種別ごとに分割管理したい場合に使用します。

```bash
# ブログのサイトマップのみ取得
curl https://your-domain.com/public/v1/form-sets/blog/sitemap.xml
```

### Next.js での実装例

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // luno のサイトマップを取得してパース
  const res = await fetch(
    `${process.env.LUNO_BASE_URL}/public/v1/sitemap.xml`,
    { next: { revalidate: 3600 } }  // 1時間キャッシュ
  )
  const xml = await res.text()

  // XML から URL を抽出（DOMParser または xml2js を使用）
  const urls = parseXmlUrls(xml)

  return urls.map(({ loc, lastmod }) => ({
    url: loc.replace('https://your-domain.com/public/v1', ''),
    lastModified: lastmod,
  }))
}
```

::: tip Google Search Console への登録
1. Google Search Console を開く
2. 「インデックス作成」→「サイトマップ」
3. `https://your-domain.com/public/v1/sitemap.xml` を入力して送信
:::

## OGP メタ情報

```
GET /public/v1/form-sets/{formSetSlug}/entries/{entrySlug}/ogp.json
```

OGP（Open Graph Protocol）メタ情報を JSON 形式で返します。SNS シェア時のサムネイル・タイトル・説明文として使われます。

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-post/ogp.json
```

レスポンス例：

```json
{
  "og:title": "はじめての投稿 | My Blog",
  "og:description": "この記事では luno の使い方を解説します。",
  "og:image": "https://your-domain.com/public/v1/media/cover-asset-uuid",
  "og:url": "https://your-site.com/blog/my-post",
  "og:type": "article",
  "og:site_name": "My Blog",
  "twitter:card": "summary_large_image"
}
```

### フロントエンドでの実装例

#### Next.js の generateMetadata

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const res = await fetch(
    `${process.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${params.slug}/ogp.json`
  )
  const ogp = await res.json()

  return {
    title: ogp['og:title'],
    description: ogp['og:description'],
    openGraph: {
      title: ogp['og:title'],
      description: ogp['og:description'],
      images: [ogp['og:image']],
      url: ogp['og:url'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogp['og:title'],
      description: ogp['og:description'],
      images: [ogp['og:image']],
    },
  }
}
```

#### Astro での実装例

```astro
---
const { slug } = Astro.params
const ogpRes = await fetch(
  `${import.meta.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${slug}/ogp.json`
)
const ogp = await ogpRes.json()
---

<head>
  <title>{ogp['og:title']}</title>
  <meta name="description" content={ogp['og:description']} />
  <meta property="og:title" content={ogp['og:title']} />
  <meta property="og:description" content={ogp['og:description']} />
  <meta property="og:image" content={ogp['og:image']} />
  <meta property="og:url" content={ogp['og:url']} />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

## schema.org JSON-LD

```
GET /public/v1/form-sets/{formSetSlug}/entries/{entrySlug}/schema.json
```

schema.org 形式の JSON-LD を返します。`<script type="application/ld+json">` に埋め込むことで検索エンジンにリッチリザルトの情報を提供できます。

```bash
curl https://your-domain.com/public/v1/form-sets/blog/entries/my-post/schema.json
```

レスポンス例：

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "はじめての投稿",
  "description": "この記事では luno の使い方を解説します。",
  "image": "https://your-domain.com/public/v1/media/cover-asset-uuid",
  "datePublished": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T10:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "My Blog"
  },
  "publisher": {
    "@type": "Organization",
    "name": "My Blog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://your-site.com/logo.png"
    }
  }
}
```

### Next.js での埋め込み例

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const [postRes, schemaRes] = await Promise.all([
    fetch(`${process.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${params.slug}`),
    fetch(`${process.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${params.slug}/schema.json`),
  ])
  const post = await postRes.json()
  const schema = await schemaRes.json()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article>
        <h1>{post.data.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.data.body }} />
      </article>
    </>
  )
}
```

## SEO フィールドの設定

フォームセットに専用の SEO フィールドを追加することで、エントリごとにメタ情報をカスタマイズできます。

### 推奨 SEO フィールド構成

| フィールドキー | タイプ | 役割 |
|---|---|---|
| `title` | text | ページタイトル（`og:title` に使用） |
| `meta_description` | textarea | メタ説明文（`og:description` に使用） |
| `og_image` | image | OGP 画像（`og:image` に使用） |
| `slug` | text | URL スラッグ |

### フォームセットの SEO 設定

管理画面の **「フォームセット」→「SEO 設定」** で、どのフィールドを OGP・schema.org のどの属性に対応させるかを指定できます。未設定の場合は `title` フィールドや `body` フィールドから自動推定されます。

## slug の自動リダイレクト

エントリの slug を変更すると、旧 slug への 301 リダイレクトが自動作成されます。

```
旧: GET /public/v1/form-sets/blog/entries/old-slug
→ HTTP 301
   Location: /public/v1/form-sets/blog/entries/new-slug
```

これにより検索エンジンの評価が引き継がれ、被リンクも無効になりません。

### フロントエンドでのリダイレクト対応

フロントエンドでも 301 を正しく処理する必要があります：

```typescript
// Next.js での例：slugs の変更に追従
export async function getPost(slug: string) {
  const res = await fetch(
    `${process.env.LUNO_BASE_URL}/public/v1/form-sets/blog/entries/${slug}`,
    { redirect: 'follow' }  // リダイレクトに自動追従
  )

  if (res.status === 404) notFound()

  return res.json()
}
```

## robots.txt の設定

luno 自体は robots.txt を提供しません。フロントエンドのホスティング側で設定してください。

```
# サイトマップを robots.txt に記載する例
User-agent: *
Allow: /

Sitemap: https://your-domain.com/public/v1/sitemap.xml
```

## 次のステップ

- [メディア管理](/ja/guide/media) — OGP 画像のアップロードと管理
- [公開 API リファレンス](/ja/api/public-api) — サイトマップ・OGP エンドポイントの仕様
- [コンテンツ管理](/ja/guide/content-management) — slug 変更とリダイレクトの詳細
