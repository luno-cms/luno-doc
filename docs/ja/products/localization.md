---
title: 多言語
description: LUNO コンテンツ多言語 — サイト設定、localizable フィールド、locale クエリ、AI 翻訳。完成形チェックと今すぐやる手順。
prev:
  text: 公開 API キー
  link: /ja/products/public-api-keys
next:
  text: コンテンツ管理
  link: /ja/guide/content-management
---

# 多言語

サイト単位でコンテンツ言語を有効にし、エントリの text / textarea / tiptap とマスタの `label` を言語別に持てます。公開 API は `?locale=` で解決します。

## できていること（完成形）

| 項目 | 状態 |
|---|---|
| サイト多言語 | **設定 → サイト** で ON、対応言語とデフォルト言語がある |
| フィールド | text / textarea / tiptap が言語別（共通にしたい場合は `locale_shared`） |
| 公開確認 | `?locale=ja` 等で期待する文言が返る |
| （任意） | AI 翻訳を 1 回実行した（**Standard 以上**） |

## いつ使うか

- 同一エントリを ja / en などで出し分けたい
- マスタの表示ラベルだけ言語別にしたい（`value` は言語共通）
- エージェントに翻訳候補を作らせたい（Standard 以上）

## プラン上の上限

| 項目 | Free | Solo / Standard / Business+ |
|---|---|---|
| コンテンツ多言語本体 | 利用可 | 利用可 |
| ロケール数 | **最大 2** | **最大 3** |
| AI ロケール翻訳 | 不可 | **Standard 以上** |

利用可能なロケールキーは `default`（English）、`ja`、`en` です（`default` と `en` の併存時は `en` が整理されます）。

## 確認チェックリスト

- [ ] **設定 → サイト → コンテンツ多言語** を ON にした
- [ ] ロケール数がプラン上限内
- [ ] エントリで言語タブを埋めて公開した
- [ ] マスタ `label` も必要言語を入れた
- [ ] Free / Solo なら AI 翻訳は対象外だと分かっている

## 今すぐやる

1. **設定 → サイト** で多言語を ON にし、例: default + `ja` を有効化する
2. エントリ編集で言語タブに入力して公開する
3. 公開 API で確認する

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries/my-post?locale=ja"
curl "https://api.luno.rest/public/p/{projectId}/v1/master-entities/category/records?locale=ja"
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'
await fetch(`${BASE}/form-sets/blog/entries/my-post?locale=ja`)
```

```bash [MCP]
# Standard+: 「このエントリを ja に翻訳して」→ translate_entry_locales
# サイト多言語の ON/OFF 変更は tenant_admin JWT のみ
```

:::

## 次の一手

| 目的 | ページ |
|---|---|
| 運用の詳細 | [コンテンツ管理](/ja/guide/content-management) |
| AI アシスト | [AI アシスト](/ja/guide/ai-assist) |
| MCP 翻訳 | [AI Agents ガイド](/ja/api/ai-agents) |
| 料金・プラン | [luno.rest](https://luno.rest) |
