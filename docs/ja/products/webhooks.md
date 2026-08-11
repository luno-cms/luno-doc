---
title: Webhooks
description: LUNO の Webhook — 公開イベント通知、署名検証、手動再送の概要。
---

# Webhooks

エントリやマスタの公開ライフサイクルを、HTTPS エンドポイントへ **HMAC 署名付き**で通知します。ISR 再生成や外部同期のトリガーに使います。

## できること

- イベント: `entry.published` / `entry.updated` / `entry.deleted` / `master.published`
- ペイロードは ID・slug・`timestamp`（フィールド本文 `data` は含まない）
- `X-Luno-Signature: sha256=…` による検証
- 配信履歴と**手動再送**（自動スケジュール再送はなし）
- Standard プラン以上

## いつ使うか

- Next.js などのキャッシュ再検証
- Slack / 自前ワーカーへの通知
- 公開と同時に検索インデックスや CDN を更新したいとき

## 次のステップ

| 目的 | ページ |
|---|---|
| ペイロード・署名・実装例 | [Webhook リファレンス](/ja/api/webhooks) |
| スケジュール公開との関係 | [スケジュール公開](/ja/guide/schedule) |
| 公開後に本文を取る | [公開 API](/ja/api/public-api) |
