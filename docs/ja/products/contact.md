---
title: Contact Form
description: LUNO Contact Form — 受信・自動返信・通知・contact.luno.rest。完成形チェックと今すぐやる手順。
prev:
  text: Headless CMS
  link: /ja/products/content
next:
  text: Embed & Pub
  link: /ja/products/embed
---

# Contact Form

お問い合わせの**受付・通知・自動返信**を管理します。自前フロントから公開 API に POST するか、`contact.luno.rest` でホスト公開できます。

## できていること（完成形）

| 項目 | 状態 |
|---|---|
| フォーム | slug 付きコンタクトフォームが 1 つ以上ある |
| 送信 | `POST …/contact-forms/{slug}/submit` が 200 を返す |
| 受信 | Console の受信一覧に submission が見える |
| （任意） | 自動返信・チャット通知・ホスト公開のいずれかが動く |

## いつ使うか

- サイトのお問い合わせ・資料請求
- 通知をチャットや CRM に流したいとき
- フォーム UI を自前実装したくないとき（ホスト公開）

## 確認チェックリスト

- [ ] Console でコンタクトフォームを作成し slug を決めた
- [ ] テスト送信で `ok: true` と `submissionId` が返る
- [ ] 管理画面の受信一覧に表示される
- [ ] （任意）自動返信または Slack 等の通知が届く

## 今すぐやる

1. Console → **コンタクトフォーム → 新規作成**（フィールドと通知先を設定）
2. テスト送信する

::: code-group

```bash [curl]
curl -X POST "https://api.luno.rest/public/p/{projectId}/v1/contact-forms/contact/submit" \
  -H "Content-Type: application/json" \
  -d '{"name":"テスト","email":"test@example.com","message":"hello"}'
```

```ts [JS]
await fetch(
  'https://api.luno.rest/public/p/{projectId}/v1/contact-forms/contact/submit',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'テスト',
      email: 'test@example.com',
      message: 'hello',
    }),
  }
)
```

```bash [MCP]
# 「contact フォームにテスト送信して受信を確認して」
```

:::

3. 実装の詳細は [コンタクトフォーム](/ja/guide/contact-forms) へ

## 次の一手

| 目的 | ページ |
|---|---|
| 送信 API・フロント例 | [コンタクトフォーム](/ja/guide/contact-forms) |
| 公開 API 全体 | [公開 API · API only](/ja/api/public-api#api-only) |
| MCP で作る（経路 A） | [Agents 完成形](/ja/guide/paths/agents) |
