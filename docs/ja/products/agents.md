---
title: AI Agents · 経路 A（MCP）
description: LUNO を AI agent 向け free backend として MCP で操作。secure なエージェントキー、Headless CMS、Cloudflare Workers。経路 A の概要と完成形。
prev:
  text: Embed & Pub
  link: /ja/products/embed
next:
  text: Webhooks
  link: /ja/products/webhooks
---

# AI Agents

Cursor / Claude Code / Codex などのエージェントから、LUNO を **backend** として使い、Headless CMS のコンテンツとスキーマを MCP で操作します。正本パッケージは [`@luno-cms/mcp`](https://www.npmjs.com/package/@luno-cms/mcp) です。

**MCP クライアント（Verified）:** Claude Code · Cursor · Codex（Golden Path E2E）。

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
| 完成形・今すぐやる | [経路 A · Agents 完成形](/ja/guide/paths/agents) |
| セットアップ詳細 | [AI Agents（MCP）ガイド](/ja/api/ai-agents) |
| 経路 C · API only | [完成形](/ja/guide/paths/api) |
| 経路 B · Console | [完成形](/ja/guide/paths/console) |

```bash
npx @luno-cms/mcp setup
```
