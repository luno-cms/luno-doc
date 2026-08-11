---
title: 経路 B · Console — 完成形
description: スタート経路 B · Console。約 10 分後の完成形、確認チェックリスト、今すぐやる手順。
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

- [ ] [Console](https://console.luno.rest/login) にログインできる
- [ ] フォームセットでエントリを作成し、ステータスが **公開済み**
- [ ] 公開 API で JSON が返る
- [ ] （任意）スケジュール公開やプレビューを一度試した

## 今すぐやる

1. [Console にログイン](https://console.luno.rest/login)する（招待メールまたは Google）
2. サイドバーのフォームセットを開き、**新規エントリ** → 保存（下書き）
3. ステータスを **レビュー申請 → 承認 → 公開**（管理者は即時公開可）にする
4. 公開 API で確認する

```bash
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/{slug}/entries?include_snapshot=true"
```

5. 画面操作の詳細は [クイックスタート · Console](/ja/guide/getting-started#console) へ

## 次の一手

| 目的 | ページ |
|---|---|
| 手順の詳細 | [クイックスタート · Console](/ja/guide/getting-started#console) |
| 承認・リビジョン | [コンテンツ管理](/ja/guide/content-management) |
| 経路 A · Agents | [完成形](/ja/guide/paths/agents) |
| 経路 C · API only | [完成形](/ja/guide/paths/api) |
