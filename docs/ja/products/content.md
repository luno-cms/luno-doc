---
title: Headless CMS · Console / Agents
description: LUNO の free backend 上の Headless CMS — Form Set・エントリ・承認・公開。secure API。経路 B Console / 経路 A MCP。
prev:
  text: 完成形 C · API only
  link: /ja/guide/paths/api
next:
  text: Contact Form
  link: /ja/products/contact
---

# Headless CMS

backend platform 上の **Headless CMS** 能力です。コンテンツの**定義・作成・承認・公開**を一つのフローで回します。Form Set で型を決め、エントリとリビジョンで版管理し、公開 API / Pub / Embed へ届けます。

## できていること（完成形）

| 項目 | 状態 |
|---|---|
| Form Set | 公開したい型（例: blog）がある |
| エントリ | **公開済み**が 1 件以上 |
| 配信 | 公開 API で一覧 / 単体が取れる |
| （任意） | レビュー承認またはスケジュール公開を一度使った |

## いつ使うか

- ブログ・お知らせ・事例・製品情報などの構造化コンテンツ
- 承認が必要なチーム運用
- 公開後に API / 埋め込み / Pub で配信したいとき

## 確認チェックリスト

- [ ] フォームセットの slug を把握している
- [ ] エントリが **公開済み**
- [ ] `include_snapshot=true` で本文が返る
- [ ] （任意）メディアが `mediaUrls` に出る

## 今すぐやる

1. 経路を選ぶ — [B · Console 完成形](/ja/guide/paths/console) または [A · Agents 完成形](/ja/guide/paths/agents)
2. 1 件公開する（Console またはエージェント）
3. 公開 API で確認する

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?include_snapshot=true"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
const res = await fetch(
  `${BASE}/form-sets/blog/entries?include_snapshot=true`
)
const data = await res.json()
```

```bash [MCP]
# 「blog の公開エントリを本文付きで一覧して」
```

:::

4. モデル設計は [フォームビルダー](/ja/guide/form-builder)、承認詳細は [コンテンツ管理](/ja/guide/content-management) へ

## 次の一手

| 目的 | ページ |
|---|---|
| 経路 B · Console | [完成形](/ja/guide/paths/console) |
| 経路 A · Agents | [完成形](/ja/guide/paths/agents) |
| フィールド設計 | [フォームビルダー](/ja/guide/form-builder) |
| 承認・リビジョン | [コンテンツ管理](/ja/guide/content-management) |
| スケジュール公開 | [スケジュール公開](/ja/guide/schedule) |
