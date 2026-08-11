---
title: クイックスタート
description: LUNO のはじめ方 — Agents（MCP）・Console・API only の3経路から選び、管理画面または公開 API まで進めます。
next:
  text: Content
  link: /ja/products/content
---

# クイックスタート

LUNO は AI ネイティブなコンテンツ運用プラットフォームです。目的に合わせて次のどれかから始めてください。

## 経路を選ぶ

| 経路 | 向いている人 | 所要 | 入口 |
|---|---|---|---|
| **A. Agents（MCP）** | Cursor / Claude Code / Codex でコンテンツを触りたい | 約 5 分 | [AI Agents](/ja/products/agents) → [詳細ガイド](/ja/api/ai-agents) |
| **B. Console** | 管理画面で作成・承認・公開を理解したい | 約 10 分 | [このページの手順](#console) |
| **C. API only** | 公開済みコンテンツを読む・サイトに繋ぐだけ | 約 3 分 | [公開 API](/ja/api/public-api#api-only) |

```bash
# 経路 A（推奨・最短）
npx @luno-cms/mcp setup
```

経路 B の手順は以下です。経路 A / C は上のリンク先へ進んでください。

## Console で始める {#console}

管理画面にログインし、最初のエントリを公開して公開 API から取得できる状態にします。

### ステップ 1：管理画面にログイン

luno の管理画面 URL（例: `https://cms.example.com`）にアクセスします。

ログイン方法はプロジェクトの設定によって異なります：

| 方法 | 説明 |
|---|---|
| **メール + パスワード** | 管理者から届いた招待メールのリンクからパスワードを設定してログイン |
| **Google アカウント** | 「Google でログイン」ボタンをクリックして OAuth 認証 |

::: tip 招待メールが届いていない場合
プロジェクトの管理者に連絡して、あなたのメールアドレスへの招待を送ってもらってください。
:::

### ステップ 2：画面構成を確認する

ログイン後、左のサイドバーにナビゲーションが表示されます。

| メニュー | 説明 |
|---|---|
| **ダッシュボード** | 公開数・下書き数・最近の更新サマリー |
| **フォームセット名** | 各コンテンツ種別のエントリ一覧（例：ブログ、お知らせ） |
| **メディア** | 画像・ファイルのアップロード管理 |
| **マスタデータ** | カテゴリ・タグなど共通参照データの管理 |
| **お問い合わせ** | コンタクトフォームの受信管理 |
| **メンバー** | プロジェクトメンバーの招待・ロール設定 |
| **ウィジェット** | 外部サイト埋め込みコンテンツの設定 |
| **設定** | フォームセット・Webhook・API キーなどの設定 |

### ステップ 3：最初のエントリを作成する

#### フォームセットを選ぶ

サイドバーから目的のフォームセット（例：「ブログ」「お知らせ」）をクリックします。フォームセットはコンテンツの型定義です。管理者が事前に作成してあります。

#### エントリを新規作成する

「新規エントリ」ボタンをクリックして各フィールドに値を入力します。

- **テキストフィールド**：タイトルや説明文を入力
- **リッチテキスト（tiptap）**：見出し・箇条書き・リンクを含む本文を編集
- **メディアフィールド**：画像をアップロードしてコンテンツに紐付け

入力が完了したら「保存」をクリックします。エントリは **下書き（draft）** として保存されます。

#### レビュー申請 → 承認 → 公開

保存後、右上のステータスボタンから公開フローを進めます：

```
下書き → レビュー申請 → 承認 → 公開済み
```

1. **レビュー申請**（submit_for_review）：担当レビュアーに確認を依頼します。
2. **承認**（approve）：レビュアーがコンテンツを確認して承認します。
   - 「今すぐ公開」→ ステータスが **公開済み（published）** になります
   - 「スケジュール公開」→ 指定日時に自動公開されます
3. **公開済み**：公開 API からコンテンツが取得できるようになります。

::: tip ロールについて
**tenant_admin**（管理者）はすべての操作が可能です。**tenant_user**（一般ユーザー）はレビュー申請まで操作できます。詳細は[コンテンツ管理](/ja/guide/content-management)を参照してください。
:::

### ステップ 4：公開 API でデータを取得する

公開後すぐに、認証なしで公開 API からコンテンツを取得できます。本番では [`/public/p/{projectId}/v1`](/ja/api/public-api) を推奨します。

#### エントリ一覧を取得する

::: code-group

```bash [curl]
# 推奨: projectId 固定ベース
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true"

# Host 解決（公開ホストがある場合）
curl "https://cms.example.com/public/v1/form-sets/blog/entries?include_snapshot=true"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'

const res = await fetch(
  `${BASE}/form-sets/blog/entries?include_snapshot=true`
)
if (!res.ok) throw new Error(`API error: ${res.status}`)
const { items } = await res.json()
```

```bash [MCP]
# サイトリポジトリで一度だけ
npx @luno-cms/mcp setup

# エージェントに例:
# 「blog フォームセットの公開エントリを一覧して」
# MCP が Public API / Admin API 経由で取得します
```

:::

レスポンス例：

```json
{
  "formSet": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "blog",
    "name": "ブログ"
  },
  "total": 1,
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
        "revision": 1,
        "updatedAt": "2025-01-15T10:00:00Z"
      }
    }
  ]
}
```

#### 特定エントリを全フィールド付きで取得する

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries/my-first-post?include_snapshot=true"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'

async function getPost(slug: string) {
  const res = await fetch(
    `${BASE}/form-sets/blog/entries/${slug}?include_snapshot=true`
  )
  if (!res.ok) {
    if (res.status === 404) throw new Error('記事が見つかりません')
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}
```

```bash [MCP]
# エージェントに例:
# 「slug my-first-post の公開本文を取得して」
```

:::

レスポンス例：

```json
{
  "formSet": { "slug": "blog", "name": "ブログ" },
  "entry": { "id": "...", "slug": "my-first-post" },
  "revision": { "revision": 1, "updatedAt": "2025-01-15T10:00:00Z" },
  "data": {
    "title": "はじめての投稿",
    "body": "<p>こんにちは、世界！</p>",
    "cover": "asset-uuid-here",
    "published_date": "2025-01-15"
  },
  "mediaUrls": {
    "cover": "https://cms.example.com/public/v1/media/asset-uuid-here"
  }
}
```

`data` のキーはフォームセットのフィールド `key` と対応します。`mediaUrls` に画像の完全 URL が入ります。

#### Next.js での使用例

```ts
// app/blog/page.tsx
export default async function BlogPage() {
  const res = await fetch(
    'https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true',
    { next: { revalidate: 60 } }
  )
  const { items } = await res.json()

  return (
    <ul>
      {items.map(({ entry, published }) => (
        <li key={entry.slug}>
          <a href={`/blog/${entry.slug}`}>
            {published.snapshot?.title}
          </a>
        </li>
      ))}
    </ul>
  )
}
```

## トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| エントリ一覧が空 | まだ公開済みエントリがない | 下書きを承認・公開してください |
| `404 NOT_FOUND` | フォームセットの slug が違う | 管理画面のフォームセット設定で slug を確認 |
| フィールド値が返らない | `include_snapshot=true` を忘れた | クエリパラメータを追加してください |
| 画像 URL が返らない | `mediaUrls` を確認していない | `mediaUrls[fieldKey]` が完全な URL です |

## 次のステップ

- [Content 概要](/ja/products/content) — コンテンツ面の全体像
- [コンテンツ管理](/ja/guide/content-management) — リビジョン・スケジュール公開・プレビュー
- [フォームビルダー](/ja/guide/form-builder) — フィールドとモデル設計
- [公開 API](/ja/api/public-api) — エンドポイント仕様（経路 C）
- [AI Agents](/ja/products/agents) — MCP で始める（経路 A）
