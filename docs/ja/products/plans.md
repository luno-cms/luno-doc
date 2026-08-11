---
title: プラン
description: LUNO プラン境界 — Standard / Business で使える機能の早見表。Webhook・検索・AI 翻訳など。
prev:
  text: 多言語
  link: /ja/products/localization
next:
  text: コンテンツ管理
  link: /ja/guide/content-management
---

# プラン

機能ごとに最低プランが異なります。Console の **設定 → プラン** で現状を確認し、足りない面だけ上げてください。料金の詳細は [luno.rest](https://luno.rest) を参照してください。

## できていること（完成形）

| 項目 | 状態 |
|---|---|
| 現在プラン | Free / Solo / Standard / Business（または Enterprise / Agency Workspace）を把握している |
| 必要機能 | 使いたい機能の最低プランが分かっている |
| エラー | `PLAN_REQUIRED` が出たら、下表で足りない面を特定できる |

## 早見表（コード上のゲート）

### Standard 以上

| 機能 | 備考 |
|---|---|
| Webhook | 登録・配送 |
| エージェント API キー | `sk-agent-…` / MCP |
| AI ロケール翻訳 | 1 実行 ≈ AI チケット 1（課金 ON 時） |
| スケジュール公開 | 承認＋日時指定 |
| 未公開プレビュー | プレビュー JWT 等 |
| 監査ログ | 操作履歴 |
| ログイン共ブランド | ログイン画面のブランド |

### Business 以上

| 機能 | 備考 |
|---|---|
| 公開 API 全文検索 `?q=` | エントリ一覧 |
| `entry_ref` フィールド | Form Set |
| 担当者アサイン | エントリ運用 |
| ログイン IP 許可リスト | Console |
| ホワイトラベル | Powered by 非表示など |

### 全プラン

| 機能 | 備考 |
|---|---|
| 公開 API 読み取り / Embed / Pub | `/public/...` |
| 公開 API キー発行 | `luno_pub_…` |
| コンテンツ多言語 | ロケール数のみ差（Free: 2 / 他: 3） |
| MCP サーバー利用（キー発行は Standard+） | パッケージ自体は公開 |

::: warning Solo と Webhook
Webhook は **Standard 以上**です（Solo では登録できません）。
:::

## 確認チェックリスト

- [ ] **設定 → プラン** で現在プランを確認した
- [ ] ISR / 外部通知が必要なら Standard 以上を検討した
- [ ] 公開 API の `q` 検索や `entry_ref` が必要なら Business 以上を検討した
- [ ] Agents（MCP）を使うなら Standard 以上でエージェントキーを発行できる

## 今すぐやる

1. Console → **設定 → プラン** を開く
2. 使いたい機能だけ下表と突き合わせる（全部上げなくてよい）
3. 足りなければアップグレードし、該当ガイドへ戻る

| やりたいこと | 最低 | 次のページ |
|---|---|---|
| 公開イベントで再生成 | Standard | [Webhooks](/ja/products/webhooks) |
| MCP / エージェント | Standard | [AI Agents](/ja/products/agents) |
| AI でロケール翻訳 | Standard | [多言語](/ja/products/localization) |
| `?q=` 全文検索 | Business | [公開 API](/ja/api/public-api) |
| `entry_ref` | Business | [フォームビルダー](/ja/guide/form-builder) |

## 次の一手

| 目的 | ページ |
|---|---|
| 公開読み取り（経路 C） | [API only 完成形](/ja/guide/paths/api) |
| 製品マップ | [製品ハブ](/ja/) |
| 価格・プラン詳細 | [luno.rest](https://luno.rest) |
