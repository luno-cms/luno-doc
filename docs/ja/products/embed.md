---
title: Embed & Pub · API only
description: LUNO Embed & Pub — widget.js・iframe・pub.luno.rest。完成形チェックと今すぐやる手順（経路 C API only と相性）。
prev:
  text: Contact
  link: /ja/products/contact
next:
  text: AI Agents
  link: /ja/products/agents
---

# Embed & Pub

公開コンテンツを**既存サイトに載せる**ための面です。widget / iframe スニペット、または `pub.luno.rest` のホスト型一覧・詳細を使います。

## できていること（完成形）

| 項目 | 状態 |
|---|---|
| 公開コンテンツ | フォームセットに公開済みエントリがある |
| ウィジェット | 公開済み widget id（`luno-…`）がある |
| キー | 公開 API キー（`luno_pub_…`）を発行済み |
| 表示 | HTML にスニペットを貼り、一覧が表示される |

## いつ使うか

- コーポレートサイトや LP にニュース一覧を埋め込みたい
- フルフロントを自前実装せず、見た目ごと任せたい
- Headless で自前 UI を組む前に、まず配信だけ確認したい

## 確認チェックリスト

- [ ] ウィジェットを公開し `luno-…` id を得た
- [ ] 公開 API キーを発行した
- [ ] 埋め込みスニペットをページに置いた
- [ ] ブラウザで一覧（または詳細）が表示される

## 今すぐやる

1. Console でウィジェットを作成・公開し、公開 API キーを発行する
2. スニペットを貼る

::: code-group

```html [HTML]
<div id="luno-list"
     data-api-key="luno_pub_xxxxxxxx"
     data-api-url="https://api.luno.rest"
     data-widget-id="luno-abcdef12">
</div>
<script src="https://api.luno.rest/public/v1/embed/luno-abcdef12.js?api_key=luno_pub_xxxxxxxx" async></script>
```

```ts [JS]
const mount = document.getElementById('luno-list')!
mount.dataset.apiKey = 'luno_pub_xxxxxxxx'
mount.dataset.apiUrl = 'https://api.luno.rest'
mount.dataset.widgetId = 'luno-abcdef12'
const s = document.createElement('script')
s.src =
  'https://api.luno.rest/public/v1/embed/luno-abcdef12.js?api_key=luno_pub_xxxxxxxx'
s.async = true
document.body.appendChild(s)
```

```bash [MCP]
# 「公開ウィジェットの埋め込みスニペットを出して」
```

:::

3. 詳細手順は [サイトへの埋め込み](/ja/guide/embed)、自前 UI は [経路 C · API only](/ja/guide/paths/api) へ

## 次の一手

| 目的 | ページ |
|---|---|
| 埋め込み手順 | [サイトへの埋め込み](/ja/guide/embed) |
| 経路 C · API only | [完成形](/ja/guide/paths/api) |
| SEO・サイトマップ | [SEO・サイトマップ](/ja/guide/seo) |
