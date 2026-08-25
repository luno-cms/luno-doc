---
title: AI エージェントの Production Safety
description: エージェントの本番権限をどう境界するか。スコープ、承認、破壊操作、dryRun、冪等、監査。
prev:
  text: AI エージェント向けガイド
  link: /ja/api/ai-agents
next:
  text: AI Agents 概要
  link: /ja/products/agents
---

# AI エージェントの Production Safety

AI エージェントは本番 backend を運用できます。ただし権限は明示的に境界されています。

LUNO は「エージェントに権限を増やす」ことより、本番の自律を **govern できること** に最適化しています。

このページは、すでに製品にある制御だけをまとめます。Policy DSL を新しく定義しません。他社に権限が無い、という比較もしません。

製品 / セキュリティ概要: [luno.rest Security](https://luno.rest/ja/security)。セットアップ: [AI エージェント向けガイド](/ja/api/ai-agents)。ホームの軸: [ドキュメントホーム · Agent Backend](/ja/#agent-backend)。

## スコープ付きアクセス

エージェント API キー（`sk-agent-…`）は発行したプロジェクトに固定されます。

| スコープ | できること |
|---|---|
| **`full`**（推奨） | エントリ、メディア、Form Set / Contact / Blueprint |
| **`content`** | エントリ、リビジョン、公開、メディア。スキーマ書き込みは **403** |
| **`schema`** | `full` の互換エイリアス |

どのエージェントキーも、他キーの発行・メンバー招待・課金変更はできません。キーごとにレート制限があります（Free: 60 req / 60 秒）。

## 人間の承認

本番公開は、エージェントの無制限デフォルトではなく、人間が govern する経路です。

- エントリは **draft → pending_review → published**
- `submit_entry_for_review` で人間の承認を求める
- **Change Plan** は複数ステップの意図（例: Blueprint 適用 + 公開）を一つの計画にする: **Intent → Change Plan → Human Approval → Execute → Observe → Recover**
- エージェントは dry-run プレビューで計画を **提案** でき、人間が Console で **承認 / 却下** する
- 計画の承認は、スコープ・確認トークン・公開の職務分離を迂回しない
- 却下した場合、本番リソースは変わらない

## 破壊操作

エージェントキーでは、本番構造を黙って大量削除できません。

- Form Set / Contact Form の**削除は不可**
- フォームブロック / フィールド定義の**削除は不可**
- 破壊的 MCP 操作には明示的な確認が必要（Trust Layer）

## プレビュー（dryRun）

スキーマ適用ツールは **`dryRun: true`** を受け取り、DB に書き込まずプレビューを返します。

- `apply_form_blueprint`
- `apply_master_blueprint`
- `apply_builtin_form_template`

人間に Change Plan の承認を求める前に、プレビューを使ってください。

## 安全な再試行（冪等）

主要 create には `idempotencyKey`（または `Idempotency-Key`）を付けられます。タイムアウト後に**同じキー**を再送すると、二重書き込みではなく元の結果が返ります。

| ツール | 同一キー再送 |
|---|---|
| `apply_form_blueprint` / `apply_builtin_form_template` | 同じ 201 本文 |
| `create_entry` | 同じ entry `id` |
| `save_revision` | 同じ revision 行 |
| `create_contact_form` | 同じ `id` |
| `publish_revision` | 既存の `already_published` + outbox 重複排除 |

`error.retryable` が `false` のときは、入力を変えてから再実行します。

## 監査可能性

エージェントの操作は、人間と同じ**運用トレイル**に残ります。

- Agent Activity / 監査ログはエージェントキーに帰属する
- レビュー、承認、却下は Console で見える
- 独立した SIEM 製品ではありません

## 次の一手

| 目的 | ページ |
|---|---|
| セットアップとツール | [AI エージェント向けガイド](/ja/api/ai-agents) |
| ホームの軸 | [ドキュメントホーム](/ja/#agent-backend) |
| 製品セキュリティ | [luno.rest Security](https://luno.rest/ja/security) |
