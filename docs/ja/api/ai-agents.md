---
title: AI エージェント向けガイド
description: AI エージェントが luno を利用するための完全ガイド。MCP サーバーのセットアップ、API キーの発行、llms.txt の活用、コンテンツ操作の例を説明します。
---

# AI エージェント向けガイド

このページでは、AI エージェント（Claude・GPT など LLM ベースのシステム）が luno を使ってコンテンツを読み取り・作成・管理するための設定と API の使い方を説明します。

## luno の AI 連携の概要

luno は以下の 3 つの方法で AI エージェントと連携できます：

| 方法 | 認証 | 用途 |
|---|---|---|
| **公開 API** | 不要 | コンテンツの読み取り専用 |
| **MCP サーバー** | API キー | Claude Desktop / Cursor 等での直接操作 |
| **エージェント API** | API キー | プログラムからのコンテンツ操作 |

## MCP サーバーのセットアップ

luno は [Model Context Protocol（MCP）](https://modelcontextprotocol.io/) に対応しており、Claude Desktop などの MCP 対応ツールから直接コンテンツを操作できます。

### Claude Desktop の設定

`~/.config/claude-desktop/config.json`（macOS: `~/Library/Application Support/Claude/config.json`）に以下を追加します：

```json
{
  "mcpServers": {
    "luno": {
      "command": "npx",
      "args": ["-y", "@luno/mcp-server"],
      "env": {
        "LUNO_API_URL": "https://your-domain.com",
        "LUNO_API_KEY": "luno_agent_your-api-key-here"
      }
    }
  }
}
```

### Cursor での設定

Cursor の設定（`Settings` → `MCP`）に以下を追加します：

```json
{
  "luno": {
    "command": "npx",
    "args": ["-y", "@luno/mcp-server"],
    "env": {
      "LUNO_API_URL": "https://your-domain.com",
      "LUNO_API_KEY": "luno_agent_your-api-key-here"
    }
  }
}
```

設定後、Claude / Cursor に「luno のブログ記事を一覧表示して」のように指示するだけでコンテンツを操作できます。

## API キーの発行

AI エージェントが管理 API にアクセスするには API キーが必要です。

1. 管理画面の **「設定」→「API キー」→「新規作成」** をクリック
2. キーの名前（例: `Claude Agent`）と権限スコープを設定
3. 発行されたキー（`luno_agent_xxxx...`）を**安全な場所に保存**

::: warning キーの管理
API キーは発行時に一度だけ表示されます。GitHub・フロントエンドのコード・チャットに貼り付けないでください。環境変数として管理してください。
:::

## llms.txt

luno は [llms.txt 仕様](https://llmstxt.org/) に準拠したエンドポイントを提供しています。

```bash
# 短い概要版
curl https://your-domain.com/public/v1/llms.txt

# 詳細版（全エンドポイント仕様）
curl https://your-domain.com/public/v1/llms-full.txt
```

AI エージェントのシステムプロンプトにこのテキストを含めることで、API の使い方をエージェントに伝えられます：

```
[システムプロンプト例]
あなたは luno CMS のコンテンツ管理を支援する AI アシスタントです。
以下の API 仕様に従ってコンテンツを取得・作成してください。

{llms.txt の内容}
```

## 公開 API での読み取り（認証不要）

AI エージェントが公開コンテンツを読み取る場合は認証不要です。

### コンテンツ構造の把握

```bash
# まず llms.txt でフォームセット一覧を確認
curl https://your-domain.com/public/v1/llms.txt

# または sitemap.xml から URL パターンを解析
curl https://your-domain.com/public/v1/sitemap.xml
```

### エントリ一覧の取得

```bash
# 全フィールド付きで取得
curl "https://your-domain.com/public/v1/form-sets/blog/entries?include_snapshot=true&limit=10"
```

### Python でのページング処理

```python
import httpx
import asyncio

BASE_URL = "https://your-domain.com/public/v1"

async def fetch_all_entries(form_set_slug: str) -> list[dict]:
    """フォームセットの全公開エントリを取得する"""
    all_items = []
    page = 1
    limit = 100

    async with httpx.AsyncClient() as client:
        while True:
            res = await client.get(
                f"{BASE_URL}/form-sets/{form_set_slug}/entries",
                params={
                    "page": page,
                    "limit": limit,
                    "include_snapshot": "true",
                }
            )
            res.raise_for_status()
            data = res.json()

            all_items.extend(data["items"])

            total = data["total"]
            offset = data["offset"] + limit
            if offset >= total:
                break
            page += 1

    return all_items

async def main():
    entries = await fetch_all_entries("blog")
    for item in entries:
        slug = item["entry"]["slug"]
        title = item["published"].get("snapshot", {}).get("title", "")
        print(f"{slug}: {title}")

asyncio.run(main())
```

### TypeScript / Fetch でのサンプル

```typescript
const BASE_URL = 'https://your-domain.com/public/v1'

interface EntryItem {
  entry: { id: string; slug: string }
  published: {
    revisionId: string
    revision: number
    updatedAt: string
    snapshot?: Record<string, unknown>
    mediaUrls?: Record<string, string>
  }
}

interface EntryListResponse {
  formSet: { id: string; slug: string; name: string }
  total: number
  limit: number
  offset: number
  items: EntryItem[]
}

async function fetchEntries(
  formSetSlug: string,
  page = 1
): Promise<EntryListResponse> {
  const url = new URL(`${BASE_URL}/form-sets/${formSetSlug}/entries`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', '20')
  url.searchParams.set('include_snapshot', 'true')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function getEntry(formSetSlug: string, entrySlug: string) {
  const res = await fetch(`${BASE_URL}/form-sets/${formSetSlug}/entries/${entrySlug}`)
  if (res.status === 301) {
    // slug が変更された場合はリダイレクト先を取得
    const newUrl = res.headers.get('location')!
    const redirect = await fetch(newUrl)
    return redirect.json()
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
```

## エージェント API でのコンテンツ操作

API キーを使って AI エージェントがコンテンツを作成・更新できます。

### フォームセット一覧の取得

```bash
curl https://your-domain.com/admin/v1/form-sets \
  -H "Authorization: Bearer luno_agent_your-api-key"
```

### エントリの作成

```bash
curl -X POST https://your-domain.com/admin/v1/form-sets/{formSetId}/entries \
  -H "Authorization: Bearer luno_agent_your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "ai-generated-post-2025-01",
    "fields": {
      "title": "AI が自動生成した記事",
      "body": "<p>コンテンツ本文...</p>",
      "category": "blog",
      "tags": ["ai", "automation"]
    }
  }'
```

### リビジョンの更新

```bash
curl -X PATCH https://your-domain.com/admin/v1/revisions/{revisionId} \
  -H "Authorization: Bearer luno_agent_your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "title": "更新されたタイトル",
      "body": "<p>更新されたコンテンツ</p>"
    }
  }'
```

### エントリの公開

```bash
curl -X POST https://your-domain.com/admin/v1/revisions/{revisionId}/publish \
  -H "Authorization: Bearer luno_agent_your-api-key"
```

## Claude との会話例

MCP サーバーが設定されている場合、以下のような自然言語での指示が使えます：

**コンテンツの確認**
```
ユーザー: luno のブログ記事を最新 5 件表示して
Claude: [luno MCP を使って取得] 以下が最新のブログ記事です...
```

**コンテンツの作成**
```
ユーザー: 「Cloudflare Workers の基本」というタイトルで
         ブログ記事の下書きを作成して
Claude: [luno MCP でエントリを作成] 下書きを作成しました。
       slug: cloudflare-workers-basics
       レビュー申請をしてよいですか？
```

**コンテンツの分析**
```
ユーザー: ブログ記事の中でカテゴリが「技術」のものを全部リストアップして
Claude: [luno MCP で全エントリを取得してフィルタリング] 
       「技術」カテゴリの記事は 12 件あります...
```

## フィールド値の型リファレンス

エージェントがフィールド値を扱う際の型対応表：

| フィールドタイプ | `data` の値の型 | 例 |
|---|---|---|
| `text` | `string` | `"タイトルです"` |
| `textarea` | `string` | `"複数行\nテキスト"` |
| `tiptap` | `string`（HTML） | `"<p>本文</p>"` |
| `number` | `number` | `42` |
| `boolean` | `boolean` | `true` |
| `date` | `string`（ISO 8601） | `"2025-01-15"` |
| `select` / `radio` | `string` | `"news"` |
| `multiselect` | `string[]` | `["tag1", "tag2"]` |
| `image` / `file` | `string`（asset UUID） | `"550e8400-..."` |
| `video_embed` | `string`（URL） | `"https://youtube.com/..."` |
| `entry_ref` | `string`（entry slug） | `"author-yamada"` |

`image` / `file` の asset UUID は `mediaUrls[fieldKey]` で完全 URL に解決されます。

## エラーハンドリング

| HTTP ステータス | コード | 対処方法 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | パラメータを確認して修正 |
| 401 | `UNAUTHORIZED` | API キーが正しいか確認 |
| 403 | `PLAN_REQUIRED` | 全文検索（`q`）は Business プラン以上 |
| 404 | `NOT_FOUND` | slug が正しいか確認 |
| 301 | — | slug 変更によるリダイレクト。`Location` ヘッダーの URL に再リクエスト |
| 304 | — | コンテンツ未変更。`ETag` キャッシュを使用 |

## コンテンツ検索のベストプラクティス

1. **`/public/v1/llms.txt`** でコンテンツ構造を把握する
2. 目的のフォームセット slug を特定する
3. `include_snapshot=true` で一覧取得し、`data` フィールドを確認する
4. 詳細が必要な場合は個別エントリを取得する
5. `ETag` / `If-None-Match` でリクエスト数を節約する
6. ページングは `total` と `offset` で判定する

## 次のステップ

- [AI アシスト](/ja/guide/ai-assist) — 管理画面での AI 機能
- [公開 API リファレンス](/ja/api/public-api) — 全エンドポイントの仕様
- [API 概要](/ja/api/overview) — 認証・エラーコードの詳細
