---
title: 経路 A · Agents（MCP）— 完成形
description: スタート経路 A · Agents（MCP）。約 5 分後の完成形、確認チェックリスト、今すぐやる手順。
prev:
  text: クイックスタート
  link: /ja/guide/getting-started
next:
  text: 完成形 B · Console
  link: /ja/guide/paths/console
---

# 経路 A · Agents（MCP）— 完成形

約 5 分後、**サイトリポジトリからエージェントで LUNO を操作できる**状態になります。

## できていること

| 項目 | 状態 |
|---|---|
| MCP 設定 | Cursor / Claude Code / Codex のいずれかに接続済み |
| キー | `.agents/luno/{dev,stg,prod}.env` に分離 |
| スコープ | 推奨は `full`（または `content` / `schema`） |
| 操作 | チャットからエントリ一覧・作成・公開、スキーマ確認ができる |

## 確認チェックリスト

- [ ] `npx @luno-cms/mcp setup` が完了している
- [ ] エージェントキー（`sk-agent-…`）を `env set-key` で入れた
- [ ] 「blog の公開エントリを一覧して」で応答が返る
- [ ] （任意）`llms.txt` で公開構造を読める

## 今すぐやる

順番どおり進めれば完成形に到達します。

1. サイトリポジトリのルートでセットアップする

```bash
cd my-existing-site
npx @luno-cms/mcp setup
# → 1) Claude Code  2) Cursor  3) Codex
```

2. Console の **設定 → エージェント API キー** でキーを発行し、入れる

```bash
npx @luno-cms/mcp env set-key stg 'sk-agent-…'
npx @luno-cms/mcp env switch stg
npx @luno-cms/mcp env status
```

3. エージェントに確認する  
   「blog フォームセットの公開エントリを一覧して」
4. 詰まったら [AI エージェント向けガイド](/ja/api/ai-agents) のセットアップ節へ

## 次の一手

| 目的 | ページ |
|---|---|
| セットアップ詳細 | [AI エージェント向けガイド](/ja/api/ai-agents) |
| 製品概要 | [AI Agents](/ja/products/agents) |
| 経路 B · Console | [完成形](/ja/guide/paths/console) |
| 経路 C · API only | [完成形](/ja/guide/paths/api) |
