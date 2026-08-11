---
title: Webhooks
description: LUNO Webhooks — 公開イベント・HMAC 署名・手動再送。完成形チェックと今すぐやる手順。
prev:
  text: AI Agents
  link: /ja/products/agents
next:
  text: コンテンツ管理
  link: /ja/guide/content-management
---

# Webhooks

エントリやマスタの公開ライフサイクルを、HTTPS エンドポイントへ **HMAC 署名付き**で通知します。ISR や外部同期のトリガーに使います（Standard 以上）。

## できていること（完成形）

| 項目 | 状態 |
|---|---|
| エンドポイント | HTTPS の受信 URL が用意されている |
| Webhook | Console で作成し、対象イベントを購読している |
| 検証 | `X-Luno-Signature` を raw body で検証できる |
| 後続処理 | 公開 API で本文を取り、revalidate 等を実行できる |

## いつ使うか

- Next.js などのキャッシュ再検証
- Slack / 自前ワーカーへの通知
- 公開と同時に検索インデックスや CDN を更新したいとき

## 確認チェックリスト

- [ ] Console → **設定 → Webhook** で URL とイベントを登録した
- [ ] シークレットを環境変数に保存した（再表示なし）
- [ ] テスト公開で配送履歴に成功がある
- [ ] 署名検証後に公開 API で本文を取れる

## 今すぐやる

1. 受信 URL を用意する（例: `/api/webhook/luno`）
2. Console で Webhook を作成し、`entry.published` 等を購読する
3. エントリを公開して配送を確認する
4. 受信後に本文を取り直す（ペイロードに `data` は無い）

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries/my-first-post?include_snapshot=true"
```

```ts [JS]
const { project_id, form_set_slug, entry_slug } = payload
const res = await fetch(
  `https://api.luno.rest/public/p/${project_id}/v1/form-sets/${form_set_slug}/entries/${entry_slug}?include_snapshot=true`
)
```

```bash [MCP]
# 「entry.published 用の署名検証＋revalidate ハンドラを書いて」
```

:::

5. 署名検証のコードは [Webhook リファレンス](/ja/api/webhooks) へ

## 次の一手

| 目的 | ページ |
|---|---|
| ペイロード・署名・実装例 | [Webhook リファレンス](/ja/api/webhooks) |
| スケジュール公開 | [スケジュール公開](/ja/guide/schedule) |
| 公開読み取り（経路 C） | [API only 完成形](/ja/guide/paths/api) |
