---
title: 経路 A · Agents — 完成形
description: MCP で約 5 分後にできている状態と、確認チェックリスト。
prev:
  text: クイックスタート
  link: /ja/guide/getting-started
next:
  text: AI Agents 概要
  link: /ja/products/agents
---

# 経路 A · Agents — 完成形

約 5 分後、**サイトリポジトリからエージェントで LUNO を操作できる**状態になります。

## できていること

| 項目 | 状態 |
|---|---|
| MCP 設定 | Cursor / Claude Code / Codex のいずれかに接続済み |
| キー | `.agents/luno/{dev,stg,prod}.env` に分離 |
| スコープ | 推奨は `full`（または用途に応じて `content` / `schema`） |
| 操作 | チャットからエントリ一覧・作成・公開、スキーマ確認ができる |

## 確認チェックリスト

1. `npx @luno-cms/mcp setup` が完了している
2. エージェントキー（`sk-agent-…`）を `env set-key` で入れた
3. エージェントに「blog の公開エントリを一覧して」と頼み、応答が返る
4. （任意）`llms.txt` で公開構造を読める

```bash
npx @luno-cms/mcp setup
npx @luno-cms/mcp env status
```

## 次の一手

| 目的 | ページ |
|---|---|
| セットアップ詳細 | [AI エージェント向けガイド](/ja/api/ai-agents) |
| 製品概要 | [AI Agents](/ja/products/agents) |
| 人間が Console でも触る | [経路 B · Console](/ja/guide/paths/console) |
| 公開読み取りだけ | [経路 C · API only](/ja/guide/paths/api) |
