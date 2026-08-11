---
title: Media Management
description: How to upload, serve, and use media files in luno HCMS — Cloudflare R2 storage, CDN delivery, image variants, and the mediaUrls response field.
prev:
  text: Form builder
  link: /en/guide/form-builder
next:
  text: Scheduled publishing
  link: /en/guide/schedule
---

# Media Management

luno stores all media files in **Cloudflare R2** and serves them through the public API with aggressive CDN caching. Images and files are accessible without authentication via a stable, cacheable URL.

::: tip Do this now (3 lines)
1. Upload one image under Console **Media**  
2. Attach it to an entry image field and **Publish**  
3. Confirm `mediaUrls` on the Public API returns a full URL  
:::

## Uploading Files

### From the Media library

Go to **Media** in the admin sidebar to upload files directly:

1. Click **Media** in the left sidebar
2. Drag and drop files, or click **Upload**
3. After upload completes, an asset ID is issued automatically

### From an entry's edit view

You can also upload directly from `image` or `file` fields inside an entry:

1. Open an entry for editing
2. Click the **Upload** button on an image or file field
3. Select a file — it uploads automatically and attaches to the field

### Supported file types

| Category | Formats |
|---|---|
| **Images** | JPEG, PNG, WebP, GIF, SVG, AVIF |
| **Documents** | PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx) |
| **Archives** | ZIP, tar.gz |
| **Other** | Configurable per project |

::: tip File size limit
The default upload limit is 50 MB. This can be adjusted in project settings.
:::

## Serving Media via the Public API

Every uploaded asset is available at:

```
GET /public/v1/media/{assetId}
```

No authentication is required.

### Response headers

| Header | Value | Effect |
|---|---|---|
| `Cache-Control` | `public, max-age=31536000` | 1-year CDN + browser cache |
| `ETag` | `"<hash>"` | Conditional request support |
| `Content-Type` | File-specific | `image/jpeg`, `application/pdf`, etc. |

### Fetching with curl

```bash
# Download the file directly
curl -O https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001

# Inspect the response headers
curl -I https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001
```

## The mediaUrls Field in API Responses

Every entry response that contains image or file fields includes a `mediaUrls` object alongside `data`. This maps field keys to fully-qualified CDN URLs, so you never need to construct media URLs manually.

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

### TypeScript usage

```typescript
interface EntryResponse {
  data: Record<string, unknown>
  mediaUrls: Record<string, string>
}

async function getPost(slug: string): Promise<EntryResponse> {
  const res = await fetch(
    `https://your-domain.com/public/v1/form-sets/blog/entries/${slug}`
  )
  return res.json()
}

const post = await getPost('my-first-post')
const coverUrl = post.mediaUrls.cover  // Full CDN URL, ready to use
```

### React example

```tsx
interface Post {
  data: { title: string }
  mediaUrls: { cover?: string }
}

function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    fetch(`https://your-domain.com/public/v1/form-sets/blog/entries/${slug}`)
      .then(r => r.json())
      .then(setPost)
  }, [slug])

  if (!post) return <p>Loading...</p>

  return (
    <article>
      {post.mediaUrls.cover && (
        <img
          src={post.mediaUrls.cover}
          alt={post.data.title}
          loading="lazy"
          decoding="async"
        />
      )}
      <h1>{post.data.title}</h1>
    </article>
  )
}
```

## Image Variants

When an image is uploaded, luno asynchronously generates resized variants for common use cases using a Cloudflare Workers Queue:

| Variant | Typical use |
|---|---|
| `original` | Full resolution (always available immediately after upload) |
| `large` | Hero images, article headers |
| `medium` | Card thumbnails, listing images |
| `small` | Icons, OGP images |

::: warning Variants take a moment to generate
Immediately after upload, only the original is available. Variants are generated asynchronously within a few seconds to a minute, depending on image size.
:::

### WebP auto-conversion

Send `Accept: image/webp` to receive a WebP-optimized version when available:

```bash
curl -H "Accept: image/webp" \
  https://your-domain.com/public/v1/media/asset-uuid
```

Modern browsers automatically send this header, so Next.js `<Image>` and similar components benefit from WebP automatically.

## Profile Avatars

User profile avatars are set by sending `avatarAssetId` to the Admin API:

```bash
curl -X PATCH https://your-domain.com/admin/v1/me/profile \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{ "avatarAssetId": "asset-uuid-here" }'
```

The avatar is stored internally as `luno-asset:<tenantId>:<assetId>` and served through an authenticated endpoint in the admin panel.

## Storage Configuration (Self-hosting)

Media files are stored in a Cloudflare R2 bucket. Configure it in `wrangler.toml`:

```toml
[[r2_buckets]]
binding     = "MEDIA_BUCKET"
bucket_name = "your-luno-media-bucket"
```

Create the bucket with:

```bash
wrangler r2 bucket create your-luno-media-bucket
```

See [Environment Variables](/en/self-hosting/env-vars) for the full `wrangler.toml` reference.

## Tips

::: tip Optimize before uploading
Pre-compress images with tools like Squoosh or ImageOptim before uploading. Smaller originals mean faster variant generation and lower R2 storage costs.
:::

::: tip Media URLs are stable
Asset URLs never change after upload (the asset ID is permanent). To replace an image, upload a new file and update the field value to point to the new asset ID.
:::

## Next Steps

- [Form Builder](/en/guide/form-builder) — Configure `image` and `file` fields
- [SEO & Sitemaps](/en/guide/seo) — Setting OGP images for social sharing
- [Environment Variables](/en/self-hosting/env-vars) — R2 bucket configuration
