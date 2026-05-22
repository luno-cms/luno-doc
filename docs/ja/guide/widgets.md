---
title: ウィジェット埋め込み
description: luno ウィジェットを外部サイトに script タグ 1 行で埋め込んでコンテンツを表示する方法、JavaScript API、カスタマイズ方法を説明します。
---

# ウィジェット埋め込み

luno ウィジェットを使うと、管理画面で管理しているコンテンツを **`<script>` タグ 1 行** で任意の外部サイトに埋め込めます。WordPress サイト・既存の HTML ページ・静的サイトなど、フロントエンドの実装方法を問わず利用できます。

## 基本的な埋め込み

```html
<!-- 1. スクリプトタグを <head> または <body> 末尾に追加 -->
<script
  src="https://your-domain.com/public/v1/widget.js"
  defer
></script>

<!-- 2. コンテンツを表示したい場所に div を配置 -->
<div
  data-luno-widget="content"
  data-form-set="blog"
  data-entry="my-first-post"
></div>
```

スクリプト読み込み後、`data-luno-widget` 属性を持つすべての要素が自動的にコンテンツに置き換わります。

## ウィジェットの種類

### コンテンツ表示（`data-luno-widget="content"`）

単一エントリのコンテンツを表示します。

```html
<!-- ニュースの最新お知らせを表示 -->
<div
  data-luno-widget="content"
  data-form-set="news"
  data-entry="latest-announcement"
  data-locale="ja"
></div>
```

### エントリ一覧（`data-luno-widget="list"`）

フォームセットの公開エントリ一覧を表示します。

```html
<!-- ブログの最新 5 件を表示 -->
<div
  data-luno-widget="list"
  data-form-set="blog"
  data-limit="5"
  data-locale="ja"
></div>
```

## data 属性リファレンス

| 属性 | 説明 | デフォルト | 対象 |
|---|---|---|---|
| `data-luno-widget` | ウィジェット種類: `content` / `list` | — | 必須 |
| `data-form-set` | フォームセットの slug | — | 必須 |
| `data-entry` | エントリの slug | — | `content` タイプ必須 |
| `data-limit` | 表示件数 | `10` | `list` タイプのみ |
| `data-locale` | ロケール（例: `ja`, `en`） | — | 任意 |
| `data-template` | カスタムテンプレート ID | — | 任意 |
| `data-sort` | ソートキー（例: `created_at:desc`） | — | `list` タイプのみ |

## ウィジェットのカスタマイズ

管理画面の **「ウィジェット」→「設定」** から表示スタイルをカスタマイズできます。

### 表示フィールドの選択

一覧や詳細に表示するフィールドを選択できます。例えばブログ一覧では「タイトル」「公開日」「サムネイル」のみ表示する、といった設定が可能です。

### ウィジェットロール（Widget Roles）

フィールドに意味的な役割（ロール）を設定すると、テンプレートが自動的にスタイルを適用します：

| ロール | 説明 |
|---|---|
| `title` | メインタイトル（`<h2>` など）として表示 |
| `thumbnail` | サムネイル画像として表示 |
| `description` | 説明文・要約として表示 |
| `date` | 日付として整形して表示 |
| `category` | カテゴリバッジとして表示 |

### CSS カスタマイズ

管理画面でカスタム CSS を書くか、AI アシストで CSS を自動生成できます。

**AI による CSS 生成の例：**

入力: 「カード形式でサムネイル左、テキスト右のレイアウト。角丸あり、ホバーで影あり」

→ 以下のような CSS が生成されます：

```css
.luno-widget-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.luno-widget-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: box-shadow 0.2s;
}

.luno-widget-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.luno-widget-thumbnail {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.25rem;
  flex-shrink: 0;
}

.luno-widget-content {
  flex: 1;
}

.luno-widget-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.luno-widget-description {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}
```

## JavaScript API

ウィジェットスクリプト読み込み後、`window.luno` オブジェクトから JavaScript API を呼び出せます。

### 手動レンダリング

```javascript
// DOMContentLoaded 後に使用
document.addEventListener('DOMContentLoaded', () => {
  // 特定の要素にコンテンツを手動レンダリング
  window.luno.render(document.getElementById('my-widget'), {
    formSet: 'blog',
    entry: 'my-post',
    locale: 'ja',
  })
})
```

### データの取得のみ

フロントエンドで独自のスタイルを適用したい場合は、データだけを取得して自分でレンダリングできます。

```javascript
// エントリ一覧を取得
const { items } = await window.luno.fetchList('blog', {
  limit: 5,
  locale: 'ja',
})

items.forEach((item) => {
  const { entry, published } = item
  console.log(entry.slug)
  console.log(published.snapshot?.title)
  console.log(published.mediaUrls?.cover)
})
```

```javascript
// 単一エントリを取得
const entry = await window.luno.fetchEntry('blog', 'my-first-post', {
  locale: 'ja',
})
console.log(entry.data.title)
console.log(entry.mediaUrls.cover)
```

### イベントリスナー

```javascript
// ウィジェットのレンダリング完了を検知
document.addEventListener('luno:rendered', (e) => {
  console.log('Widget rendered:', e.detail.widgetId)
})

// データ取得エラーを検知
document.addEventListener('luno:error', (e) => {
  console.error('Widget error:', e.detail.error)
})
```

## キャッシュ動作

| リソース | `Cache-Control` |
|---|---|
| `widget.js` スクリプト | `public, max-age=300`（5 分） |
| コンテンツデータ | `public, max-age=60`（1 分、ETag 付き） |
| 画像・メディア | `public, max-age=31536000`（1 年） |

公開後にコンテンツを変更した場合、最大 1 分後にウィジェットの表示が更新されます。

## WordPress プラグインとの連携

WordPress を使っている場合、`functions.php` にスクリプトを追加するか、カスタム HTML ブロックでウィジェットを埋め込めます。

```php
// functions.php
function add_luno_widget_script() {
  wp_enqueue_script(
    'luno-widget',
    'https://your-domain.com/public/v1/widget.js',
    [],
    null,
    true
  );
}
add_action('wp_enqueue_scripts', 'add_luno_widget_script');
```

## 次のステップ

- [AI アシスト](/ja/guide/ai-assist) — ウィジェット CSS の AI 生成
- [コンテンツ管理](/ja/guide/content-management) — ウィジェットで表示するコンテンツの管理
- [公開 API リファレンス](/ja/api/public-api) — データ取得の詳細
