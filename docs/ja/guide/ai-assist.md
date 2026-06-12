---
title: AI アシスト
description: luno の AI 機能（コンテンツ生成・フォームセット提案・ウィジェット CSS 生成・AI エージェント連携）の使い方を説明します。
---

# AI アシスト

luno はコンテンツ管理作業を効率化する複数の AI アシスト機能を備えています。コンテンツの下書き生成からフォームセットの構造提案、AI エージェントとの連携まで、幅広く対応します。

## コンテンツ AI

管理画面のエントリ編集画面で、フィールドに AI 生成候補を直接表示できます。

### 対応フィールドタイプ

| フィールドタイプ | できること |
|---|---|
| `text` | タイトル・見出しの候補提案、A/B バリアント生成 |
| `textarea` | 説明文・要約・メタ説明の生成 |
| `tiptap` | 本文の下書き生成・リライト・翻訳 |

### 使い方

1. エントリ編集画面でフィールドにフォーカス
2. フィールド右上の「✨ AI」ボタンをクリック
3. 指示（プロンプト）を入力する（例: 「SEO を意識して 150 文字以内で書いてください」）
4. 生成された候補を確認し「採用」または「再生成」をクリック
5. 必要に応じて手動で修正

### AI アシストの活用例

**タイトルの A/B バリアント生成:**

入力: 「クラウド CMS の導入事例記事のタイトル候補を 3 つ提案してください」

→ 出力:
```
1. 「年間 300 時間の作業を削減：luno 導入で変わったコンテンツ管理の現場」
2. 「非エンジニアでも使える！ヘッドレス CMS 移行成功事例」
3. 「Cloudflare Workers × CMS でグローバルサイトの表示速度が 2 倍になった話」
```

**メタ説明文の生成:**

入力: 「本文の内容をもとに、Google 検索用のメタ説明文を 120 文字で書いてください」

## フォームセット提案

フォームセットの新規作成時に、用途を自然言語で説明すると AI がフィールド構成を提案します。

### 使い方

1. 「設定」→「フォームセット」→「新規作成」
2. 「AI でフィールドを提案」をクリック
3. 用途を入力

**例1: ブログ記事**

入力: 「技術ブログの記事を管理したい。タイトル・本文・著者・タグ・サムネイル・公開日が必要で、SEO 対応も必要」

→ AI が以下を提案:
```
- title (text, 必須, localizable)
- body (tiptap, 必須, localizable)
- author (entry_ref, 参照先: authors)
- tags (multiselect)
- thumbnail (image)
- published_date (date)
- meta_description (textarea, localizable)
- og_image (image)
```

**例2: 製品情報**

入力: 「EC サイトの商品情報を管理したい。商品名・説明・価格・在庫・カテゴリ・複数の商品画像が必要」

→ AI が以下を提案:
```
- name (text, 必須)
- description (tiptap, 必須)
- price (number, 必須, min: 0)
- stock (number, min: 0)
- category (select, 選択肢: electronics / clothing / food / other)
- images (image) ← 複数画像のヒントも提示
```

## ウィジェット CSS 生成

ウィジェットのスタイルを自然言語で指示すると、対応する CSS を自動生成します。

### 使い方

1. 「ウィジェット」→「スタイル設定」
2. 「AI で CSS を生成」をクリック
3. デザインの要件を入力

**例:**

入力: 「ダークテーマ。カード形式で横幅全幅。ホバーで淡い背景色変化。フォントはシステムフォント」

→ 以下のような CSS が生成されます：

```css
.luno-widget {
  background: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.luno-widget-item {
  background: #242424;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: background-color 0.15s ease;
  border: 1px solid #333;
}

.luno-widget-item:hover {
  background: #2a2a2a;
}

.luno-widget-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 0.5rem;
}

.luno-widget-description {
  font-size: 0.875rem;
  color: #aaaaaa;
  line-height: 1.6;
  margin: 0;
}
```

生成後は管理画面のエディタで微調整できます。

## スキーマコンテキスト（AI エージェント向け）

管理画面の **「設定」→「スキーマコンテキスト」** では、フォームセットの意味的な説明を追加できます。

### 用途

AI エージェントが luno のコンテンツ構造を正確に理解できるよう、各フォームセットの目的とフィールドの意味を記述します。

### 例

```
フォームセット: blog
説明: テクニカルブログの記事を管理します。
- title: 記事のSEOタイトル（60文字以内推奨）
- body: Markdown ではなく HTML（tiptap エディタで入力）
- author: authors フォームセットへの参照（entry_ref）
- tags: 技術タグのスラッグ（例: cloudflare, typescript, cms）
- og_image: SNSシェア用のOGP画像（1200x630px推奨）
```

このコンテキストは `GET /admin/v1/schema-context` で取得でき、AI エージェントのシステムプロンプトに組み込むか、MCP サーバーが自動的に参照します。

## AI エージェントとの連携

luno は AI エージェント（Claude・GPT など）からコンテンツを直接作成・更新できます。

### MCP サーバーとの連携

Claude Desktop などの MCP 対応ツールで luno MCP サーバーを設定すると、AI が直接コンテンツを作成・公開できます。

詳細は [AI エージェント向けガイド](/ja/api/ai-agents) を参照してください。

### API キーで直接操作

AI エージェントが管理 API を直接呼び出す場合：

```bash
# エージェント API でエントリを作成
curl -X POST https://api.luno.rest/admin/v1/form-sets/{formSetId}/entries \
  -H "Authorization: Bearer sk-agent-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "ai-generated-post",
    "fields": {
      "title": "AI が生成した記事",
      "body": "<p>内容...</p>"
    }
  }'
```

## AI 機能の設定

AI 機能を使うには、管理画面の **「設定」→「AI 設定」** で LLM の API キーを設定します。

| 設定項目 | 説明 |
|---|---|
| **AI プロバイダー** | OpenAI または Anthropic を選択 |
| **API キー** | 選択したプロバイダーの API キー |
| **モデル** | 使用するモデル（例: `gpt-4o`, `claude-3-5-sonnet-20241022`） |

::: tip API キーのコスト
AI アシスト機能はトークン消費に応じて LLM プロバイダーへの課金が発生します。使用量に応じたコストが別途かかることをご注意ください。
:::

## 注意事項

::: warning AI 生成コンテンツのレビュー
AI が生成したコンテンツは必ず人間がレビューしてから公開してください。誤情報・不適切な表現が含まれる可能性があります。luno の承認フロー（draft → pending_review → published）を活用してください。
:::

- 生成結果は毎回異なります
- 長文の生成は LLM のコンテキスト長に制限があります
- 多言語コンテンツを生成する場合は、ロケールを明示的に指示してください

## 次のステップ

- [AI エージェント向けガイド](/ja/api/ai-agents) — MCP サーバーと API キーの設定
- [フォームビルダー](/ja/guide/form-builder) — フォームセットの作成
- [サイトへの埋め込み](/ja/guide/embed) — CSS カスタマイズの詳細
