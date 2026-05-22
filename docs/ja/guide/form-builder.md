---
title: フォームビルダー
description: luno のフォームセット（コンテンツモデル）の作成方法と、全フィールドタイプの詳細・設定項目・API レスポンス形式を説明します。
---

# フォームビルダー

**フォームセット（Form Set）** は luno のコンテンツモデルです。フィールドを自由に組み合わせてコンテンツの構造を定義します。「ブログ記事」「お知らせ」「製品情報」など、サイトで管理するコンテンツの型ごとにフォームセットを作成します。

## フォームセットの作成

1. 管理画面サイドバー → **「設定」→「フォームセット」**
2. **「新規作成」** をクリック
3. 表示名（例: `ブログ`）と slug（例: `blog`）を入力
4. フィールドを追加して保存

::: warning slug の命名規則
slug は公開 API の URL に使われます（例: `/public/v1/form-sets/blog/entries`）。英数字とハイフンのみ使用してください。作成後の変更は可能ですが、既存コンテンツの URL がすべて変わるため、注意が必要です。
:::

### AI によるフィールド提案

フォームセットの新規作成時に、用途をテキストで説明すると AI がフィールド構成を提案します。

**例：**

入力: 「ニュース記事を管理したい。タイトル・本文・公開日・カテゴリが必要」

→ AI が以下を提案:
```
- title (text, 必須)
- body (tiptap, 必須)
- published_date (date)
- category (select, 選択肢: news / press / blog)
```

## フィールドタイプ一覧

| タイプ | 管理画面での表示 | ローカライズ | API の値の型 |
|---|---|:---:|---|
| `text` | 1 行テキスト | ✓ | `string` |
| `textarea` | 複数行テキスト | ✓ | `string` |
| `tiptap` | リッチテキスト（WYSIWYG） | ✓ | `string`（HTML） |
| `number` | 数値 | — | `number` |
| `boolean` | 真偽値（チェックボックス） | — | `boolean` |
| `date` | 日付・日時 | — | `string`（ISO 8601） |
| `select` | 単一選択（ドロップダウン） | — | `string` |
| `radio` | 単一選択（ラジオボタン） | — | `string` |
| `multiselect` | 複数選択 | — | `string[]` |
| `image` | 画像アップロード | — | `string`（asset UUID） |
| `file` | ファイルアップロード | — | `string`（asset UUID） |
| `video_embed` | 動画埋め込み URL | — | `string`（URL） |
| `entry_ref` | 別エントリへの参照 | — | `string`（entry slug） |

## フィールドタイプ詳細

### text — 1 行テキスト

```json
{
  "type": "text",
  "key": "title",
  "label": "タイトル",
  "required": true,
  "localizable": true,
  "minLength": 1,
  "maxLength": 200
}
```

API レスポンス例:
```json
{ "data": { "title": "はじめての投稿" } }
```

タイトル・見出し・短いキャッチフレーズに適しています。`localizable: true` で多言語対応できます。

### textarea — 複数行テキスト

```json
{
  "type": "textarea",
  "key": "summary",
  "label": "要約",
  "required": false,
  "localizable": true,
  "maxLength": 500
}
```

API レスポンス例:
```json
{ "data": { "summary": "この記事は...\n複数行のテキストです。" } }
```

メタ説明文・抜粋・メモなど、プレーンテキストの複数行入力に適しています。

### tiptap — リッチテキスト

```json
{
  "type": "tiptap",
  "key": "body",
  "label": "本文",
  "required": true,
  "localizable": true
}
```

API レスポンス例:
```json
{
  "data": {
    "body": "<h2>見出し</h2><p>本文のテキストです。<strong>太字</strong>も使えます。</p><ul><li>リスト項目</li></ul>"
  }
}
```

対応する書式:
- 見出し（H1〜H6）
- 太字・斜体・下線・取り消し線
- リスト（順序あり・なし）
- リンク・画像挿入
- コードブロック・引用
- テーブル

::: tip リッチテキストの表示
HTML 文字列として返されるため、フロントエンドでは `dangerouslySetInnerHTML`（React）や `v-html`（Vue）で表示できます。XSS 対策として、ユーザー入力がそのまま含まれる場合はサニタイズを検討してください。
:::

### number — 数値

```json
{
  "type": "number",
  "key": "price",
  "label": "価格",
  "required": true,
  "min": 0,
  "max": 9999999
}
```

API レスポンス例:
```json
{ "data": { "price": 1980 } }
```

整数・小数の両方に対応。在庫数・順番・価格などに使用します。

### boolean — 真偽値

```json
{
  "type": "boolean",
  "key": "is_featured",
  "label": "注目記事",
  "defaultValue": false
}
```

API レスポンス例:
```json
{ "data": { "is_featured": true } }
```

フラグ・トグル・チェックボックスに使用します。

### date — 日付・日時

```json
{
  "type": "date",
  "key": "published_date",
  "label": "公開日",
  "required": false,
  "includeTime": false
}
```

API レスポンス例:
```json
{ "data": { "published_date": "2025-01-15" } }
```

`includeTime: true` の場合は ISO 8601 の日時形式（`"2025-01-15T09:00:00Z"`）で返されます。

### select / radio — 単一選択

```json
{
  "type": "select",
  "key": "category",
  "label": "カテゴリ",
  "required": true,
  "options": [
    { "value": "news", "label": "ニュース" },
    { "value": "blog", "label": "ブログ" },
    { "value": "case-study", "label": "事例" }
  ]
}
```

API レスポンス例:
```json
{ "data": { "category": "blog" } }
```

`select` はドロップダウン、`radio` はラジオボタンで表示されます。選択肢は静的リストまたはマスターデータから指定できます。

### multiselect — 複数選択

```json
{
  "type": "multiselect",
  "key": "tags",
  "label": "タグ",
  "options": [
    { "value": "cloudflare", "label": "Cloudflare" },
    { "value": "cms", "label": "CMS" },
    { "value": "api", "label": "API" }
  ]
}
```

API レスポンス例:
```json
{ "data": { "tags": ["cloudflare", "cms"] } }
```

複数のタグ・ジャンル・属性に使用します。

### image — 画像アップロード

```json
{
  "type": "image",
  "key": "cover",
  "label": "カバー画像",
  "required": false
}
```

API レスポンス例:
```json
{
  "data": { "cover": "550e8400-e29b-41d4-a716-446655440001" },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/550e8400-e29b-41d4-a716-446655440001"
  }
}
```

`data[key]` は asset UUID です。`mediaUrls[key]` に完全な URL が含まれます。対応形式: JPEG、PNG、WebP、GIF、SVG。

### file — ファイルアップロード

```json
{
  "type": "file",
  "key": "attachment",
  "label": "添付ファイル",
  "accept": ["application/pdf"]
}
```

API レスポンス例:
```json
{
  "data": { "attachment": "asset-uuid" },
  "mediaUrls": { "attachment": "https://your-domain.com/public/v1/media/asset-uuid" }
}
```

PDF・Word・Excel などのドキュメントファイルに使用します。

### video_embed — 動画埋め込み

```json
{
  "type": "video_embed",
  "key": "video",
  "label": "動画"
}
```

API レスポンス例:
```json
{ "data": { "video": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } }
```

YouTube・Vimeo などの埋め込み URL を格納します。動画ファイルの直接アップロードではなく、URL 参照です。

### entry_ref — エントリ参照（Business プラン以上）

```json
{
  "type": "entry_ref",
  "key": "author",
  "label": "著者",
  "targetFormSet": "authors",
  "required": true
}
```

API レスポンス例:
```json
{ "data": { "author": "yamada-taro" } }
```

同一プロジェクト内の別フォームセットのエントリを参照します。`data[key]` は参照先エントリの slug です。著者プロフィール・関連記事・製品カテゴリなどのリレーション設定に使用します。

::: warning Business プラン制限
`entry_ref` フィールドは Business プラン以上で利用可能です。
:::

## フィールドの共通設定

すべてのフィールドで設定できる共通項目：

| 設定項目 | 説明 |
|---|---|
| **ラベル** | 管理画面での表示名（例: `タイトル`） |
| **キー（key）** | API レスポンスの `data` オブジェクト内のキー名（英数字・アンダースコア） |
| **必須（required）** | `true` の場合、入力なしで保存・申請不可 |
| **localizable** | 多言語対応を有効化（text / textarea / tiptap のみ） |
| **説明（description）** | 管理画面の入力フォームに表示するヒントテキスト |
| **非表示（hidden）** | 管理画面のエントリ一覧に表示しない（API には含まれる） |

## マスターデータ連携

`select`・`radio`・`multiselect` の選択肢は、静的リストの他に**マスターデータ**から取得できます。

マスターデータは複数のフォームセット間で共有できる選択肢リストです。例えば「都道府県」「業種」「商品カテゴリ」など、複数のフォームセットで共通利用する場合に適しています。

管理画面の「マスタデータ」メニューでデータを登録し、フィールド設定で「マスターデータから選択」を有効にしてマスターを紐付けます。

## フォームセットの一覧表示設定

管理画面のエントリ一覧に表示する**カラム**と**デフォルトソート順**をフォームセット単位で設定できます。

- 一覧カラム: 表示するフィールドと順番
- デフォルトソート: `created_at:desc`（作成日降順）など

この設定は公開 API の `?sort` パラメータのデフォルト値にも影響します。

## フォームセットのテンプレート

よく使うフォームセットのパターンはテンプレートとして保存・再利用できます。「ブログ」「LP」「Q&A」などのブループリントから素早くフォームセットを生成できます。

## API レスポンスの全体像

フィールドを定義したフォームセットのエントリ取得レスポンス例：

```json
{
  "formSet": {
    "id": "uuid",
    "slug": "blog",
    "name": "ブログ"
  },
  "entry": {
    "id": "uuid",
    "slug": "my-first-post"
  },
  "revision": {
    "id": "uuid",
    "revision": 3,
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "data": {
    "title": "はじめての投稿",
    "summary": "この記事では...",
    "body": "<h2>はじめに</h2><p>...</p>",
    "cover": "asset-uuid",
    "category": "blog",
    "tags": ["cloudflare", "cms"],
    "is_featured": true,
    "published_date": "2025-01-15",
    "author": "yamada-taro"
  },
  "mediaUrls": {
    "cover": "https://your-domain.com/public/v1/media/asset-uuid"
  },
  "widgetRoles": {
    "title": "title",
    "cover": "thumbnail",
    "summary": "description"
  }
}
```

## 次のステップ

- [メディア管理](/ja/guide/media) — 画像・ファイルのアップロードと配信
- [コンテンツ管理](/ja/guide/content-management) — エントリのライフサイクルと承認フロー
- [公開 API リファレンス](/ja/api/public-api) — フィールド値の取得方法の詳細
