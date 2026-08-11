---
title: AI Agents
description: LUNO の AI エージェント連携 — MCP、エージェント API キー、llms.txt の概要。
prev:
  text: Embed & Pub
  link: /ja/products/embed
next:
  text: Webhooks
  link: /ja/products/webhooks
---

# AI Agents

Cursor / Claude Code / Codex などのエージェントから、LUNO のコンテンツとスキーマを操作します。正本パッケージは [`@luno-cms/mcp`](https://www.npmjs.com/package/@luno-cms/mcp) です。

## できること

- **`npx @luno-cms/mcp setup`** — 既存サイトリポジトリへのワンコマンド接続
- キーを `.agents/luno/{dev,stg,prod}.env` に分離
- スコープ **`full` / `content` / `schema`**
- エントリ CRUD・公開、Blueprint / テンプレ適用、メディア upload など
- サイトごとの **`llms.txt`** で公開コンテンツを発見

## いつ使うか

- 記事作成・更新をエージェントに任せたい
- Form Set / Contact の初期セットアップをチャットで済ませたい
- ローカル / staging / production を環境ごとに切り替えたい

## 次のステップ

| 目的 | ページ |
|---|---|
| セットアップ手順（詳細） | [AI エージェント向けガイド](/ja/api/ai-agents) |
| 公開コンテンツを読むだけ | [公開 API](/ja/api/public-api) |
| Console で人間が運用 | [クイックスタート](/ja/guide/getting-started#console) |

```bash
npx @luno-cms/mcp setup
```
