---
title: Masters
description: LUNO マスタ — エンティティ・レコード・サイト公開・公開 API。完成形チェックと今すぐやる手順。
prev:
  text: Webhooks
  link: /ja/products/webhooks
next:
  text: 公開 API キー
  link: /ja/products/public-api-keys
---

# Masters

カテゴリやタグなどの**共通選択肢**をマスタエンティティ＋レコードで管理し、Form Set の select / radio 等から参照します。サイトへ公開すると公開 API から読めます。

## できていること（完成形）

| 項目 | 状態 |
|---|---|
| エンティティ | `key` 付きマスタが 1 つ以上ある |
| レコード | `value`（言語共通）と `label`（表示）が入っている |
| サイト公開 | Console で **サイトへ公開** 済み（未公開は公開 API に出ない） |
| 公開 API | `master-entities` / `.../records` が 200 |
| （任意） | `master.published` Webhook を購読している |

## いつ使うか

- ブログカテゴリ・都道府県など、複数 Form Set で共有する選択肢
- 公開サイトのフィルタ UI を API から組み立てたいとき
- Agents で Blueprint からマスタ定義を投入したいとき

## 確認チェックリスト

- [ ] Console → **マスタデータ** でエンティティとレコードを作成した
- [ ] **サイトへ公開** した（空マスタは公開できない）
- [ ] `GET .../master-entities/{key}/records?locale=ja` で `value` / `label` が返る
- [ ] Form Set の select がマスタ参照で、公開 snapshot の保存値は **value**

## 今すぐやる

1. マスタを作成し、レコードを追加する（`value` は安定 ID、`label` は表示名）
2. **サイトへ公開** する
3. 公開 API で確認する

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/master-entities"
curl "https://api.luno.rest/public/p/{projectId}/v1/master-entities/category/records?locale=ja"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
const entities = await fetch(`${BASE}/master-entities`).then((r) => r.json())
const records = await fetch(
  `${BASE}/master-entities/category/records?locale=ja`
).then((r) => r.json())
```

```bash [MCP]
# 「category マスタを作ってサイト公開し、公開 records を確認して」
```

:::

4. Form Set の select / radio にマスタを紐付け、エントリを公開する

## 次の一手

| 目的 | ページ |
|---|---|
| エンドポイント | [公開 API · マスタ](/ja/api/public-api#masters) |
| フィールド連携 | [フォームビルダー](/ja/guide/form-builder) |
| `master.published` | [Webhooks](/ja/products/webhooks) |
| Blueprint / MCP | [AI Agents ガイド](/ja/api/ai-agents) |
