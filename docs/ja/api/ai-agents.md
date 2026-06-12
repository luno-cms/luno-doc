---
title: AI エージェント向けガイド
description: AI エージェントが luno を利用するための完全ガイド。MCP サーバー、エージェント API キーのスコープ、llms.txt、コンテンツ操作の例を説明します。
---

# AI エージェント向けガイド

このページでは、AI エージェント（Claude・GPT・Cursor など LLM ベースのシステム）が luno を使ってコンテンツを読み取り・作成・管理するための設定と API の使い方を説明します。

## luno の AI 連携の概要

luno は以下の 3 つの方法で AI エージェントと連携できます。

| 方法 | 認証 | 用途 |
|---|---|---|
| **公開 API** | 不要 | 公開コンテンツの読み取り |
| **MCP サーバー** | エージェント API キー | Claude Desktop / Cursor 等での直接操作 |
| **エージェント API** | エージェント API キー | 管理 API と同じルートをプログラムから呼び出し |

**MCP パッケージ:** [`@luno-cms/mcp`](https://www.npmjs.com/package/@luno-cms/mcp)（`npx -y @luno-cms/mcp`）

## MCP サーバーのセットアップ

luno は [Model Context Protocol（MCP）](https://modelcontextprotocol.io/) に対応しており、Claude Desktop や Cursor から自然言語で CMS を操作できます。

### 環境変数

| 変数 | 例 | 説明 |
|---|---|---|
| `LUNO_API_URL` | `https://api.luno.rest/admin` | 管理 API のベース（**`/admin` まで含む**、末尾スラッシュなし） |
| `LUNO_AGENT_KEY` | `sk-agent-…` | 管理画面で発行したエージェント API キー |

ローカル開発では `http://127.0.0.1:8787/admin` を指定します。

### Claude Desktop の設定

macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "luno": {
      "command": "npx",
      "args": ["-y", "@luno-cms/mcp"],
      "env": {
        "LUNO_API_URL": "https://api.luno.rest/admin",
        "LUNO_AGENT_KEY": "sk-agent-xxxxxxxx"
      }
    }
  }
}
```

### Cursor での設定

Cursor の **Settings → MCP** に以下を追加します。

```json
{
  "luno": {
    "command": "npx",
    "args": ["-y", "@luno-cms/mcp"],
    "env": {
      "LUNO_API_URL": "https://api.luno.rest/admin",
      "LUNO_AGENT_KEY": "sk-agent-xxxxxxxx"
    }
  }
}
```

キー発行後、管理画面 **設定 → エージェント API キー**（`/settings/api-keys`）にも MCP 設定スニペットが表示されます。

## エージェント API キーの発行

管理 API（MCP 含む）を呼ぶには **エージェント API キー**が必要です。

1. 管理画面 **設定 → エージェント API キー** → **新規作成**
2. 名前（例: `Claude Agent`）を入力
3. **スコープ**を選択（下表参照）
4. 表示されたキー（`sk-agent-…`）を**必ずコピー**（再表示不可）

::: warning キーの管理
GitHub・フロントエンドのコード・チャットに貼り付けないでください。環境変数またはシークレット管理ツールで保管してください。
:::

## キーのスコープ

各キーには `scope` があり、操作可能な API が決まります。キーは発行したプロジェクトに固定され、`X-Project-Id` は不要です。

| スコープ | 用途 | できること |
|---|---|---|
| **`content`**（既定） | 日常のコンテンツ運用 | スキーマ読み取り、エントリ作成・更新、リビジョン保存・公開、メディア一覧 |
| **`schema`** | 初期セットアップ | `content` のすべて + Blueprint 適用、Builtin テンプレ適用、Contact Form 作成・更新 |

### 推奨フロー

1. **セットアップ（短期）:** **`schema`** キーを発行 → blog テンプレ適用、Contact Form 作成
2. **運用（常用）:** **`content`** キーを発行 → 記事の作成・公開
3. **セットアップ完了後:** `schema` キーを revoke

### エージェントキーでは不可（スコープ問わず）

- Form Set / Contact Form の**削除**
- フォームブロック / フィールド定義の**削除**
- 他 API キーの発行、メンバー招待、課金・SNS 設定の変更

`content` キーで Blueprint 適用などを呼ぶと **403 Forbidden** になります。

## MCP ツール一覧

`@luno-cms/mcp` が提供するツール:

### コンテンツ（`content` スコープ）

| ツール | 説明 |
|---|---|
| `get_tenant_schema` | プロジェクト全体のスキーマ |
| `list_form_sets` / `get_form_set_schema` | Form Set 一覧・フィールド定義 |
| `list_entries` / `get_entry` | エントリ一覧・詳細 |
| `create_entry` / `update_entry` | エントリ作成・slug 更新 |
| `list_revisions` / `save_revision` / `publish_revision` | リビジョン操作 |
| `submit_entry_for_review` | 承認申請 |
| `list_media` | メディア一覧 |

### スキーマセットアップ（**`schema` スコープ必須**）

| ツール | 管理 API |
|---|---|
| `apply_form_blueprint` | `POST /admin/v1/form-blueprints/apply` |
| `apply_builtin_form_template` | `POST /admin/v1/form-set-templates/:id/apply` |
| `create_contact_form` | `POST /admin/v1/contact-forms` |

### dryRun（スキーマ適用のプレビュー）

`apply_form_blueprint` と `apply_builtin_form_template` は **`dryRun: true`** を渡せます。DB に書き込まず `{ dryRun: true, operations: [...] }` が返るので、blog テンプレ適用前に作成内容を確認してください。

CLI: `hcms form apply --dry-run` / `hcms template apply --dry-run`

## llms.txt

各サイトは [llms.txt 仕様](https://llmstxt.org/) に沿ったエンドポイントで、**公開済みコンテンツ**の一覧を返します。

```bash
curl https://api.luno.rest/public/v1/llms.txt
# プロジェクトの公開ホストでも同様:
curl https://your-domain.com/public/v1/llms.txt
```

システムプロンプトに含めると、エージェントが利用可能なコンテンツを把握できます。

```
[システムプロンプト例]
あなたは luno CMS のコンテンツ管理を支援する AI アシスタントです。
以下が公開コンテンツの一覧です。

{llms.txt の内容}

公開 API で読み取り、MCP 経由で下書きを作成してください。
```

API の詳細仕様は [公開 API リファレンス](/ja/api/public-api) および本ページを参照してください。

## 公開 API での読み取り（認証不要）

公開 API ベース: `https://{your-domain}/public/v1`

### コンテンツ構造の把握

```bash
curl https://your-domain.com/public/v1/llms.txt
curl https://your-domain.com/public/v1/sitemap.xml
```

### エントリ一覧の取得

```bash
curl "https://your-domain.com/public/v1/form-sets/blog/entries?include_snapshot=true&limit=10"
```

### Python でのページング処理

```python
import httpx
import asyncio

BASE_URL = "https://your-domain.com/public/v1"

async def fetch_all_entries(form_set_slug: str) -> list[dict]:
    all_items = []
    page = 1
    limit = 100

    async with httpx.AsyncClient() as client:
        while True:
            res = await client.get(
                f"{BASE_URL}/form-sets/{form_set_slug}/entries",
                params={"page": page, "limit": limit, "include_snapshot": "true"},
            )
            res.raise_for_status()
            data = res.json()
            all_items.extend(data["items"])
            if data["offset"] + limit >= data["total"]:
                break
            page += 1

    return all_items
```

## エージェント API でのコンテンツ操作

エージェント API ベース: `https://{your-domain}/admin/v1`  
認証: `Authorization: Bearer sk-agent-…`

### フォームセット一覧

```bash
curl https://api.luno.rest/admin/v1/form-sets \
  -H "Authorization: Bearer sk-agent-xxxxxxxx"
```

### エントリの作成

```bash
curl -X POST https://api.luno.rest/admin/v1/form-sets/{formSetId}/entries \
  -H "Authorization: Bearer sk-agent-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "ai-generated-post-2025-01",
    "fields": {
      "title": "AI が自動生成した記事",
      "body": "<p>コンテンツ本文...</p>"
    }
  }'
```

### 公開

MCP の `publish_revision` を使うか、管理 API を直接呼びます。

```bash
curl -X POST https://api.luno.rest/admin/v1/revisions/{revisionId}/publish \
  -H "Authorization: Bearer sk-agent-xxxxxxxx"
```

## Claude との会話例

**コンテンツの確認**

> ユーザー: luno のブログ記事を最新 5 件表示して  
> Claude: [MCP で取得] 以下が最新のブログ記事です…

**コンテンツの作成**

> ユーザー: 「Cloudflare Workers の基本」というタイトルで下書きを作成して  
> Claude: [MCP でエントリ作成] 下書きを作成しました。slug: `cloudflare-workers-basics`

**初期セットアップ（schema キー）**

> ユーザー: blog テンプレを適用して、お問い合わせフォームも作って  
> Claude: [`apply_builtin_form_template` と `create_contact_form` を実行] セットアップ完了しました

## フィールド値の型リファレンス

| フィールドタイプ | 値の型 | 例 |
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

## エラーハンドリング

| HTTP ステータス | コード | 対処方法 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | パラメータを確認して修正 |
| 401 | `UNAUTHORIZED` | キーが無効・失効・未設定 |
| 403 | `FORBIDDEN` | スコープ不足（例: `content` キーで Blueprint 適用） |
| 403 | `PLAN_REQUIRED` | 全文検索（`q`）は Business プラン以上 |
| 404 | `NOT_FOUND` | slug が正しいか確認 |
| 301 | — | slug 変更。`Location` へ再リクエスト |
| 304 | — | 未変更。`ETag` キャッシュを使用 |

## ベストプラクティス

1. **`llms.txt`** で公開コンテンツの全体像を把握する
2. **キーを分ける** — セットアップは `schema`、日常運用は `content`。セットアップ後は `schema` を revoke
3. **`include_snapshot=true`** で一覧取得し、個別 GET を減らす
4. **301 リダイレクト**に従う（slug 変更時）
5. **`ETag` / `If-None-Match`** でリクエスト数を節約する
6. **公開前に人間がレビュー** — draft → pending_review → published を推奨

## 次のステップ

- [AI アシスト](/ja/guide/ai-assist) — 管理画面での AI 機能
- [公開 API リファレンス](/ja/api/public-api) — 全エンドポイントの仕様
- [API 概要](/ja/api/overview) — 認証・エラーコードの詳細
- [npm: @luno-cms/mcp](https://www.npmjs.com/package/@luno-cms/mcp) — MCP サーバーパッケージ
