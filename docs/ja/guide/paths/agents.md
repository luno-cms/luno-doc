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
| MCP 設定 | Cursor / Claude Code / Codex のいずれかに接続済み（**Verified**） |
| キー | `.agents/luno/` に保存（gitignore）。公開デフォルトは **prod** |
| スコープ | 推奨は `full`（または `content` / `schema`） |
| 最初の依頼 | フォーム一覧か下書き 1 件。公開はしない |

## 確認チェックリスト

- [ ] `npx @luno-cms/mcp setup` が完了している（ブラウザで確認）
- [ ] エージェントでワークスペース信頼 / MCP を許可した
- [ ] 「この LUNO のフォーム一覧を出して。または下書きを1件。公開やスキーマ変更はしないで。」で応答が返る
- [ ] （任意）`llms.txt` で公開構造を読める

## 今すぐやる

順番どおり進めれば完成形に到達します。

1. サイトリポジトリのルートでセットアップする

```bash
cd my-existing-site
npx @luno-cms/mcp setup
# → ブラウザで確認 → production へ healthcheck
```

エージェントのチャットにキーを貼らないでください。

2. 選んだエージェントでプロジェクトを開き、信頼 / MCP を求められたら許可する

3. 聞く:

```
この LUNO のフォーム一覧を出して。または下書きを1件。公開やスキーマ変更はしないで。
```

あとから: チームは `npx @luno-cms/mcp login`。`--env stg` はアクセスがある人だけ。

4. 詰まったら [AI エージェント向けガイド](/ja/api/ai-agents) のセットアップ節へ

## 次の一手

| 目的 | ページ |
|---|---|
| セットアップ詳細 | [AI エージェント向けガイド](/ja/api/ai-agents) |
| 製品概要 | [AI Agents](/ja/products/agents) |
| 経路 B · Console | [完成形](/ja/guide/paths/console) |
| 経路 C · API only | [完成形](/ja/guide/paths/api) |
