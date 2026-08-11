---
title: メディア管理
description: luno のメディアアップロード・Cloudflare R2 ストレージ・画像バリアント生成・CDN 配信の仕組みと使い方を説明します。
prev:
  text: フォームビルダー
  link: /ja/guide/form-builder
next:
  text: スケジュール公開
  link: /ja/guide/schedule
---

# メディア管理

luno のメディアは **Cloudflare R2** に保存され、公開 API 経由で CDN キャッシュを効かせながら配信されます。認証なしで高速に画像・ファイルを配信できます。

::: tip 今すぐやる（3 行）
1. Console の **メディア** で画像を 1 枚アップロードする  
2. エントリの image フィールドに紐付けて **公開** する  
3. 公開 API の `mediaUrls` に完全 URL が出ることを確認する  
:::

## アップロード

### 管理画面からアップロード

管理画面の **「メディア」** メニューから直接ファイルをアップロードできます。

1. 「メディア」をクリック
2. ファイルをドラッグ＆ドロップ、または「アップロード」ボタンをクリック
3. アップロード完了後、asset ID が発行されます

### エントリ編集画面からアップロード

`image` または `file` タイプのフィールドからも直接アップロードできます。

1. エントリ編集画面を開く
2. 画像フィールドの「アップロード」ボタンをクリック
3. ファイルを選択 → 自動的にアップロードされてフィールドに紐付く

### 対応ファイルタイプ

| カテゴリ | 形式 |
|---|---|
| **画像** | JPEG、PNG、WebP、GIF、SVG、AVIF |
| **ドキュメント** | PDF、Word（.docx）、Excel（.xlsx）、PowerPoint（.pptx） |
| **アーカイブ** | ZIP、tar.gz |
| **その他** | プロジェクト設定で制限・拡張可能 |

::: tip ファイルサイズ制限
デフォルトのアップロード上限は 50MB です。プロジェクト設定で変更できます。
:::

## 公開メディア配信

アップロードしたメディアは以下の公開エンドポイントから**認証なし**で取得できます：

```
GET /public/v1/media/{assetId}
```

### レスポンスヘッダー

| ヘッダー | 値 | 説明 |
|---|---|---|
| `Cache-Control` | `public, max-age=31536000` | 1 年間の CDN・ブラウザキャッシュ |
| `ETag` | `"<hash>"` | 条件付きリクエスト対応 |
| `Content-Type` | ファイルタイプに応じる | `image/jpeg`, `application/pdf` など |

### curl での取得例

```bash
# 直接 URL でアクセス
curl -O https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001

# ヘッダーを確認
curl -I https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001
```

## エントリレスポンスの mediaUrls

エントリの API レスポンスには `mediaUrls` オブジェクトが含まれます。画像・ファイルフィールドのキーに対して完全な URL がマッピングされるため、フロントエンドで URL を組み立てる必要がありません。

```json
{
  "entry": { "id": "...", "slug": "my-post" },
  "data": {
    "cover": "550e8400-e29b-41d4-a716-446655440001",
    "attachment": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
  },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001",
    "attachment": "https://your-domain.com/public/v1/media/7c9e6679-7425-40de-944b-e07fc1f90ae7"
  }
}
```

### TypeScript での使用例

```typescript
interface EntryResponse {
  data: Record<string, unknown>
  mediaUrls: Record<string, string>
}

async function getPostWithCover(slug: string): Promise<EntryResponse> {
  const res = await fetch(
    `https://your-domain.com/public/v1/form-sets/blog/entries/${slug}`
  )
  return res.json()
}

const post = await getPostWithCover('my-first-post')
const coverUrl = post.mediaUrls.cover  // 完全な URL が取得できる
```

### React での使用例

```tsx
function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<EntryResponse | null>(null)

  useEffect(() => {
    fetch(`/public/v1/form-sets/blog/entries/${slug}`)
      .then(r => r.json())
      .then(setPost)
  }, [slug])

  if (!post) return <div>Loading...</div>

  return (
    <article>
      {post.mediaUrls.cover && (
        <img
          src={post.mediaUrls.cover}
          alt={post.data.title as string}
          loading="lazy"
        />
      )}
      <h1>{post.data.title as string}</h1>
    </article>
  )
}
```

## 画像バリアント

画像フィールドにアップロードした画像は、非同期でリサイズされた複数のサイズバリアントが生成されます（Cloudflare R2 + Workers Queue 処理）。

| バリアント | 用途 |
|---|---|
| `original` | オリジナルサイズ（常に利用可能） |
| `large` | 記事本文・ヒーロー画像用 |
| `medium` | 一覧サムネイル用 |
| `small` | アイコン・OGP 画像用 |

::: warning アップロード直後の動作
バリアントは非同期で生成されるため、アップロード直後はオリジナルサイズのみ利用可能です。バリアントが生成されるまでに数秒〜数十秒かかる場合があります。
:::

### WebP の自動変換

`Accept: image/webp` ヘッダーを送ると、ブラウザが WebP に対応している場合に WebP 形式で画像が返されます。

```bash
# WebP を要求する
curl -H "Accept: image/webp" \
  https://your-domain.com/public/v1/media/asset-uuid
```

Next.js の `<Image>` コンポーネントや、img タグの `loading="lazy"` などと組み合わせることで、最適なパフォーマンスが得られます。

## プロフィールアバター

ユーザーのプロフィールアバターは、管理 API の `PATCH /admin/v1/me/profile` に `avatarAssetId` を送ることで設定できます。

```bash
curl -X PATCH https://your-domain.com/admin/v1/me/profile \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{ "avatarAssetId": "asset-uuid-here" }'
```

内部的に `luno-asset:<tenantId>:<assetId>` 形式で保存されます。アバター画像は認証付きエンドポイント経由で表示されます。

## ストレージの設定（セルフホスト）

メディアファイルは Cloudflare R2 バケットに保存されます。`wrangler.toml` で以下のように設定します：

```toml
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "your-luno-media-bucket"
```

本番用のバケットを作成するには：

```bash
wrangler r2 bucket create your-luno-media-bucket
```

詳細は[セルフホスト：環境変数](/ja/self-hosting/env-vars)を参照してください。

## メディア管理の Tips

::: tip 画像の最適化
アップロード前に画像を圧縮・最適化しておくと、バリアント生成の元データが最適化されます。Squoosh や ImageOptim などのツールが便利です。
:::

::: tip CDN キャッシュのパージ
アップロード後に URL が変わるため、同じ asset ID で異なる画像に置き換えることはできません。画像を差し替える場合は新しい asset をアップロードし、フィールドの値を更新してください。
:::

## 次のステップ

- [フォームビルダー](/ja/guide/form-builder) — image・file フィールドの設定方法
- [SEO・サイトマップ](/ja/guide/seo) — OGP 画像の設定
- [セルフホスト：環境変数](/ja/self-hosting/env-vars) — R2 バインディングの設定
