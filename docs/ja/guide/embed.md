---
title: サイトへの埋め込み
description: 公開 API キーとウィジェット ID を指定するだけ。HTML に script を貼って記事一覧・詳細を表示します（npm / ビルド不要）。
---

# サイトへの埋め込み

公開 API キーとウィジェット ID を指定するだけで、既存サイトにブログ一覧・記事詳細を表示できます。**npm もビルドも不要**です。

**関連**
- 完成例（GitHub）: [luno-cms/starter-widget](https://github.com/luno-cms/starter-widget)
- デモ（Cloudflare Pages）: [luno-starter-widget.pages.dev](https://luno-starter-widget.pages.dev/home.html)
- SDK でフル構築: [公開 API リファレンス](/ja/api/public-api)

## この方式向きの人

| 向いている | 向いていない |
|------------|--------------|
| 既存サイト・WordPress 横に一覧だけ足す | ルーティング・SSR を全部自分で組みたい |
| デザインは luno ウィジェットに任せたい | API キーをブラウザに載せたくない → [BFF サンプル](https://github.com/luno-cms/luno/tree/main/examples/public-api-bff-proxy) |

## クイックスタート

### Step 1: LUNO でウィジェットを公開

1. 管理画面 → フォームセット → 記事を **1 件以上「公開」**
2. ウィジェットを作成し、一覧用の設定を保存
3. リビジョンを **「公開」** して widget public id（`luno-xxxxxxxx`）を得る
4. **設定 → 公開 API キー** でキーを発行（`luno_pub_…`）

管理画面の **ウィジェット編集 → 埋め込みタグ** に、プロジェクト向けの完成スニペットが表示されます。

### Step 2: HTML に貼り付け

```html
<div id="luno-list"
     data-api-key="luno_pub_xxxxxxxx"
     data-api-url="https://api.luno.rest"
     data-widget-id="luno-abcdef12">
</div>
<script src="https://api.luno.rest/public/v1/embed/luno-abcdef12.js?api_key=luno_pub_xxxxxxxx" async></script>
```

| 属性 / URL | 意味 |
|------------|------|
| `data-api-url` | API のオリジン（**末尾スラッシュなし**） |
| `data-api-key` | 公開 API キー |
| `data-widget-id` | 公開済みウィジェット ID |
| `embed/….js` | ウィジェット設定（テーマ・件数・CSS 等）を DB から注入 |

一覧の見た目・件数・ソートは **管理画面のウィジェット設定** が正です。HTML 側に `data-theme` 等を書く必要はありません。

### Step 3: 静的ホストに配置

Cloudflare Pages / GitHub Pages / 既存サーバに HTML を置くだけで動作します。

[starter-widget](https://github.com/luno-cms/starter-widget) を clone し、HTML 内のプレースホルダ（`YOUR_PUBLIC_API_KEY` 等）を置換してデプロイするのが最速です。

::: tip YOUR_API_DOMAIN の置換
テンプレートでは `https://YOUR_API_DOMAIN` と書かれています。ホスト名だけ（例: `api.luno.rest`）に置換してください。`https://` を二重に付けないでください。
:::

## ウィジェット種別

### 一覧 — `#luno-list` / `[data-luno-list]`

記事一覧・ページネーション。メインのブログページ向け。

### 最新記事 — `[data-luno-top]`

トップページやサイドバー向けのコンパクト表示。

```html
<div data-luno-top
     data-api-key="luno_pub_…"
     data-api-url="https://api.luno.rest"
     data-widget-id="luno-abcdef12"
     data-count="5"
     data-heading="最新記事"
     data-link-pattern="article.html?entry={slug}"
     data-see-more-url="index.html">
</div>
```

### 記事詳細 — `#luno-article` / `[data-luno-article]`

`article.html?entry=スラッグ` のように URL から slug を読み取ります。

```html
<div id="luno-article"
     data-api-key="luno_pub_…"
     data-api-url="https://api.luno.rest"
     data-widget-id="luno-abcdef12"
     data-show-back="true"
     data-back-label="← 一覧へ">
</div>
```

### フィルター — `[data-luno-filter]`

一覧と同じ widget id を `data-target` に指定します。

```html
<div data-luno-filter
     data-api-key="luno_pub_…"
     data-api-url="https://api.luno.rest"
     data-type="search"
     data-target="luno-abcdef12">
</div>
```

| `data-type` | 機能 |
|-------------|------|
| `search` | キーワード |
| `category` | カテゴリ |
| `monthly` | 月別 |
| `tags` | タグ |

**embed スクリプトはページに 1 本**で足ります（一覧・詳細・フィルターで共用）。

## 複数ページ構成（定番）

| ファイル | 内容 |
|----------|------|
| `index.html` | 一覧 + フィルター |
| `article.html` | 詳細（`?entry=`） |
| `home.html` | トップ + 最新記事 |

完成例: [starters/starter-widget](https://github.com/luno-cms/luno/tree/main/starters/starter-widget)

## フレームワーク別（React / Next.js 等）

管理画面のウィジェット編集 **埋め込みタグ** で、HTML / React / Vue / Next.js / Svelte のコード例をコピーできます。

Next.js の例:

```tsx
"use client";

import Script from "next/script";

const API_URL = process.env.NEXT_PUBLIC_LUNO_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_LUNO_API_KEY!;
const WIDGET_ID = "luno-abcdef12";

export function ArticleList() {
  const scriptSrc = `${API_URL}/public/v1/embed/${WIDGET_ID}.js?api_key=${encodeURIComponent(API_KEY)}`;

  return (
    <>
      <div
        id="luno-list"
        data-api-key={API_KEY}
        data-api-url={API_URL}
        data-widget-id={WIDGET_ID}
      />
      <Script src={scriptSrc} strategy="afterInteractive" />
    </>
  );
}
```

フル SSR が必要な場合は [公開 API リファレンス](/ja/api/public-api) と SDK スターターを参照してください。

## トラブルシューティング

| 症状 | 確認すること |
|------|----------------|
| 真っ白 / 記事が出ない | HTML のプレースホルダ未置換、公開 API キー・widget id、記事が「公開」済みか |
| 401 / 403 | キーが `luno_pub_` 形式か、プロジェクトが一致しているか |
| 設定が反映されない | ウィジェットの **公開リビジョン** があるか |
| Network で 404 | `embed/luno-….js` の URL と widget id が正しいか |

## 次のステップ

- [starter-widget を試す](https://github.com/luno-cms/starter-widget)
- [コンテンツ管理](/ja/guide/content-management)
- [公開 API リファレンス](/ja/api/public-api)
