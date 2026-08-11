---
title: AI Agents（MCP）ガイド · 経路 A
description: スタート経路 A · Agents（MCP）。セットアップ、エージェント API キー（full/content/schema）、llms.txt、コンテンツ操作。
prev:
  text: 完成形 A · Agents
  link: /ja/guide/paths/agents
next:
  text: 公開 API
  link: /ja/api/public-api
---

# AI エージェント向けガイド

::: tip スタート経路 A
このページは **Agents（MCP）** 経路の詳細です。全体の入口は [クイックスタート](/ja/guide/getting-started) と [AI Agents 概要](/ja/products/agents) を参照してください。
:::

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

**パッケージ:** [`@luno-cms/mcp`](https://www.npmjs.com/package/@luno-cms/mcp) — 手順の正本は npm の README です。

### 推奨: 既存サイト + Cursor / Claude Code / Codex

**サイトリポジトリのルート**で:

```bash
cd my-existing-site
npx @luno-cms/mcp setup
# → 1) Claude Code  2) Cursor  3) Codex を選択
```

| 選択 | 書き込まれるもの |
|---|---|
| Claude Code | `.claude/skills/luno/` + `.mcp.json` |
| Cursor | `.cursor/skills/luno/` + `.cursor/mcp.json` |
| Codex | `.agents/skills/luno/` + `.codex/config.toml` |

**キーの正本は `.agents/luno/`**（gitignore。コミットされるのは `*.example` のみ）:

| ファイル | 用途 |
|---|---|
| `.agents/luno/dev.env` | ローカル API（`http://127.0.0.1:8787/admin`） |
| `.agents/luno/stg.env` | staging（`https://stg-api.luno.rest/admin`） |
| `.agents/luno/prod.env` | production（`https://api.luno.rest/admin`） |
| `.agents/luno/env` | いま有効な環境（`env switch` で更新） |

各 `*.env` の中身:

```bash
LUNO_API_URL=https://api.luno.rest/admin
LUNO_AGENT_KEY=sk-agent-xxxxxxxx
```

その後:

1. 管理画面 **設定 → エージェント API キー** でキーを発行
2. エージェントで `/luno` に貼るか、非対話で:

```bash
npx @luno-cms/mcp env set-key stg 'sk-agent-…'
npx @luno-cms/mcp env switch stg
npx @luno-cms/mcp env status
```

MCP サーバー名: `luno-dev` / `luno-stg` / `luno-prod`  
（`npx @luno-cms/mcp run stg` は `.agents/luno/stg.env` を読みます）

::: tip
`.agents/luno/*.env` は **Git に入れないでください**。環境・サイトごとにキーを分けるのが安全です。
:::

### 環境変数（MCP プロセスが読む値）

| 変数 | 例 | 説明 |
|---|---|---|
| `LUNO_API_URL` | `https://api.luno.rest/admin` | 管理 API のベース（**`/admin` まで含む**、末尾スラッシュなし） |
| `LUNO_AGENT_KEY` | `sk-agent-…` | 管理画面で発行したエージェント API キー |

キーは MCP JSON に直書きせず、`.agents/luno/{dev,stg,prod}.env` に置くのを推奨します。ローカル API は `http://127.0.0.1:8787/admin`。

### 代替: MCP 設定の `env` に直書き（Claude Desktop / 一時利用）

`setup` / `.agents/luno/` を使わない場合は、クライアント設定に変数を直接書けます。

**Claude Desktop** — macOS: `~/Library/Application Support/Claude/claude_desktop_config.json` / Windows: `%APPDATA%\Claude\claude_desktop_config.json`

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

**Cursor** — Settings → MCP、またはプロジェクトの `.cursor/mcp.json` に同様の形。キー発行後、管理画面 **設定 → エージェント API キー** にも貼り付け用スニペットが出ます。

日常のサイト開発では `npx @luno-cms/mcp setup` を使い、キーを `.agents/luno/` に置いて `dev` / `stg` / `prod` を切り替えてください。

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
| **`full`**（推奨） | 記事 + スキーマ設定 | エントリ・メディア・Form Set / Contact / Blueprint |
| **`content`** | 記事のみ | スキーマ読み取り、エントリ作成・更新、リビジョン保存・公開、メディア一覧 |
| **`schema`** | 互換エイリアス | `full` と同権限 |

### 推奨フロー

1. 普段は **`full`** キー（記事だけに絞るなら **`content`**）
2. 必要なら Blueprint / テンプレ適用用に短期キーを使い、終わったら revoke

### エージェントキーでは不可（スコープ問わず）

- Form Set / Contact Form の**削除**
- フォームブロック / フィールド定義の**削除**
- 他 API キーの発行、メンバー招待、課金・SNS 設定の変更

`content` キーで Blueprint 適用などを呼ぶと **403 Forbidden** になります。

## MCP ツール一覧

`@luno-cms/mcp` が提供するツール（正本は [npm README](https://www.npmjs.com/package/@luno-cms/mcp)）:

### コンテンツ（`content` / `full`）

| ツール | 説明 |
|---|---|
| `get_tenant_schema` | プロジェクト全体のスキーマ |
| `list_form_sets` / `get_form_set_schema` | Form Set 一覧・フィールド定義（select 等の `masterEntityKey` / sampleValues 含む） |
| `get_public_api_info` | `projectId` と公開 API ベース URL（`/public/p/{projectId}/v1`） |
| `list_entries` / `get_entry` | エントリ一覧・詳細 |
| `create_entry` / `update_entry` | エントリ作成・slug 更新 |
| `list_revisions` / `save_revision` / `publish_revision` | リビジョン操作 |
| `submit_entry_for_review` | 承認申請 |
| `list_media` / `upload_media` | メディア一覧・アップロード（`filePath` / `sourceUrl` / `base64`） |
| `list_master_entities` / `get_master_entity` | マスタエンティティ |
| `list_master_records` / `create_master_record` | マスタレコード参照・作成 |
| `update_master_record` / `update_master_tree` | マスタ更新（**エージェントキー不可** — ユーザ JWT が必要） |
| `get_project_content_locales` | サイト多言語設定の取得 |
| `patch_project_content_locales` | 多言語設定の更新（**tenant_admin JWT のみ**） |
| `translate_entry_locales` | AI ロケール一括翻訳（**Standard+**） |
| `search_admin_help` / `get_admin_help_article` / `ask_admin_help` | 管理画面ヘルプ KB |
| `get_login_branding` / `get_login_appearance` / `update_login_appearance` | ログイン見た目 |
| `list_console_login_ip_allowlists` / `add_…` / `delete_…` | ログイン IP 許可リスト（**Business+**） |

### スキーマセットアップ（**`full` / `schema` 必須**）

| ツール | 管理 API |
|---|---|
| `apply_form_blueprint` | `POST /admin/v1/form-blueprints/apply` |
| `validate_master_blueprint` / `apply_master_blueprint` | マスタ Blueprint の検証・適用 |
| `apply_builtin_form_template` | `POST /admin/v1/form-set-templates/:id/apply` |
| `create_contact_form` / `update_contact_form` | Contact Form 作成・更新（`autoreply_*` 可） |

### dryRun（スキーマ適用のプレビュー）

`apply_form_blueprint`・`apply_master_blueprint`・`apply_builtin_form_template` は **`dryRun: true`** を渡せます。DB に書き込まずプレビューが返ります。

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

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true&limit=10"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
const res = await fetch(
  `${BASE}/form-sets/blog/entries?include_snapshot=true&limit=10`
)
const data = await res.json()
```

```bash [MCP]
npx @luno-cms/mcp setup
# エージェント例: 「blog の公開エントリを 10 件、本文付きで一覧して」
```

:::

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
| `text` / `url` | `string` | `"タイトルです"` / `"https://…"` |
| `textarea` | `string` | `"複数行\nテキスト"` |
| `tiptap` | Tiptap doc(JSON) または `string` | `"<p>本文</p>"` |
| `number` | `number` | `42` |
| `boolean` | `boolean` | `true` |
| `date` | `string` または `{ from, to }` | `"2025-01-15"` |
| `select` / `radio` | `string`（マスタの **value**） | `"news"` |
| `multiselect` | `string[]` | `["tag1", "tag2"]` |
| `image` / `file` | `string`（asset UUID） | `"550e8400-..."` |
| `image_gallery` | UUID 文字列、または `{ assetId, caption? }[]` | `[{ "assetId": "…" }]` |
| `video_embed` | `string`（URL） | `"https://youtube.com/..."` |
| `entry_ref` | `string`（参照エントリ **UUID**） | `"7c9e6679-..."` |

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
2. **普段は `full`** — 記事だけに絞るなら `content`。短期のセットアップキーは終わったら revoke
3. **`include_snapshot=true`** で一覧取得し、個別 GET を減らす
4. **301 リダイレクト**に従う（slug 変更時）
5. **`ETag` / `If-None-Match`** でリクエスト数を節約する
6. **公開前に人間がレビュー** — draft → pending_review → published を推奨

## 次のステップ

- [AI アシスト](/ja/guide/ai-assist) — 管理画面での AI 機能
- [公開 API リファレンス](/ja/api/public-api) — 全エンドポイントの仕様
- [API 概要](/ja/api/overview) — 認証・エラーコードの詳細
- [npm: @luno-cms/mcp](https://www.npmjs.com/package/@luno-cms/mcp) — MCP サーバーパッケージ
