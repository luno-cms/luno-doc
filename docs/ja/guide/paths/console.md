---
title: 経路 B · Console — 完成形
description: 管理画面で約 10 分後にできている状態と、確認チェックリスト。
prev:
  text: 経路 A · Agents
  link: /ja/guide/paths/agents
next:
  text: クイックスタート（手順）
  link: /ja/guide/getting-started#console
---

# 経路 B · Console — 完成形

約 10 分後、**管理画面で 1 件公開し、公開 API から同じ内容が読める**状態になります。

## できていること

| 項目 | 状態 |
|---|---|
| ログイン | Console にサインイン済み |
| エントリ | 下書き →（必要ならレビュー）→ **公開済み** が 1 件以上 |
| 配信 | 公開 API で一覧 / 単体が取得できる |
| 理解 | サイドバー（フォームセット・メディア・設定）の役割が分かる |

## 確認チェックリスト

1. [Console](https://console.luno.rest/login) にログインできる
2. フォームセットでエントリを作成し、ステータスが **公開済み**
3. 次のどちらかで JSON が返る

```bash
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/{slug}/entries?include_snapshot=true"
```

4. （任意）スケジュール公開やプレビューリンクを一度試した

## 次の一手

| 目的 | ページ |
|---|---|
| 手順の詳細 | [クイックスタート · Console](/ja/guide/getting-started#console) |
| 承認・リビジョン | [コンテンツ管理](/ja/guide/content-management) |
| エージェントでも触る | [経路 A · Agents](/ja/guide/paths/agents) |
| フロントだけ繋ぐ | [経路 C · API only](/ja/guide/paths/api) |
