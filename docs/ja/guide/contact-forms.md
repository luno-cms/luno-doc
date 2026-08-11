---
title: コンタクトフォーム
description: luno のコンタクトフォーム機能のセットアップ、公開 API からの送信、メール通知、フロントエンド実装例を説明します。
prev:
  text: Contact Form
  link: /ja/products/contact
next:
  text: 埋め込み実装
  link: /ja/guide/embed
---

# コンタクトフォーム

luno のコンタクトフォーム機能を使うと、問い合わせフォームの送信データを管理画面で受け取り、メール通知を自動送信できます。フロントエンドからは公開 API の 1 エンドポイントを POST するだけで完結します。

## フォームの作成

管理画面の **「コンタクトフォーム」→「新規作成」** からフォームを設定します。

### 基本設定

| 項目 | 説明 | 例 |
|---|---|---|
| **名前** | 管理画面での表示名 | `お問い合わせフォーム` |
| **Slug** | API で使う識別子（URL セーフ） | `contact` |
| **通知先メールアドレス** | 送信時に通知するメールアドレス（複数設定可） | `info@example.com` |
| **返信先フィールド** | 送信者への返信先として使うフィールドキー | `email` |
| **スパム対策** | Honeypot フィールドの有効化 | 推奨: 有効 |

### フィールドの定義

フォームが受け付けるフィールドを定義します。フロントエンド側の `<form>` が送信する `name` 属性と、ここで設定するフィールドの **キー** を一致させてください。

**典型的なフィールド構成例：**

| キー | タイプ | 説明 |
|---|---|---|
| `name` | text | 氏名（必須） |
| `email` | text | メールアドレス（必須） |
| `company` | text | 会社名（任意） |
| `message` | textarea | お問い合わせ内容（必須） |
| `inquiry_type` | select | 問い合わせ種別（任意） |

## 公開 API からの送信

```
POST /public/v1/contact-forms/{slug}/submit
Content-Type: application/json
```

### リクエスト例

::: code-group

```bash [curl]
curl -X POST "https://api.luno.rest/public/p/{projectId}/v1/contact-forms/contact/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "山田 太郎",
    "email": "yamada@example.com",
    "company": "株式会社サンプル",
    "message": "製品について詳しくお聞きしたいです。",
    "inquiry_type": "product"
  }'
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'

await fetch(`${BASE}/contact-forms/contact/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '山田 太郎',
    email: 'yamada@example.com',
    company: '株式会社サンプル',
    message: '製品について詳しくお聞きしたいです。',
    inquiry_type: 'product',
  }),
})
```

```bash [MCP]
npx @luno-cms/mcp setup
# エージェント例: 「contact フォームにテスト送信して受信を確認して」
```

:::

### 成功レスポンス（HTTP 200）

```json
{
  "ok": true,
  "submissionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

### バリデーションエラー（HTTP 400）

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email is required"
  }
}
```

### スパム判定（HTTP 200、データは保存されない）

Honeypot フィールドが埋まっている場合、`ok: true` を返しますが実際にはデータを保存しません。ボットに処理成功と誤解させることで再送を防ぎます。

## フロントエンド実装例

### バニラ JavaScript

```html
<form id="contact-form" novalidate>
  <div>
    <label for="name">お名前 *</label>
    <input id="name" name="name" type="text" required autocomplete="name" />
  </div>
  <div>
    <label for="email">メールアドレス *</label>
    <input id="email" name="email" type="email" required autocomplete="email" />
  </div>
  <div>
    <label for="company">会社名</label>
    <input id="company" name="company" type="text" autocomplete="organization" />
  </div>
  <div>
    <label for="message">お問い合わせ内容 *</label>
    <textarea id="message" name="message" required rows="5"></textarea>
  </div>
  <!-- Honeypot: 人間のユーザーには見えないフィールド -->
  <input name="website" type="text" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">送信する</button>
  <p id="status" role="status" aria-live="polite"></p>
</form>

<script>
const form = document.getElementById('contact-form')
const status = document.getElementById('status')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const btn = form.querySelector('button[type="submit"]')
  btn.disabled = true
  status.textContent = '送信中...'

  try {
    const data = Object.fromEntries(new FormData(form))
    const res = await fetch(
      'https://your-domain.com/public/v1/contact-forms/contact/submit',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    const json = await res.json()

    if (json.ok) {
      status.textContent = '送信が完了しました。担当者より折り返しご連絡します。'
      form.reset()
    } else {
      status.textContent = `エラーが発生しました: ${json.error.message}`
    }
  } catch (err) {
    status.textContent = '通信エラーが発生しました。しばらくしてから再試行してください。'
  } finally {
    btn.disabled = false
  }
})
</script>
```

### React + TypeScript

```tsx
import { useState, FormEvent } from 'react'

const ENDPOINT = 'https://your-domain.com/public/v1/contact-forms/contact/submit'

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const fd = new FormData(e.currentTarget)
    const data: ContactFormData = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      company: fd.get('company') as string | undefined,
      message: fd.get('message') as string,
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (json.ok) {
        setStatus('success')
      } else {
        setErrorMsg(json.error.message)
        setStatus('error')
      }
    } catch {
      setErrorMsg('通信エラーが発生しました。')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p>送信が完了しました。担当者より折り返しご連絡します。</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        お名前 *
        <input name="name" type="text" required />
      </label>
      <label>
        メールアドレス *
        <input name="email" type="email" required />
      </label>
      <label>
        会社名
        <input name="company" type="text" />
      </label>
      <label>
        お問い合わせ内容 *
        <textarea name="message" required rows={5} />
      </label>
      {status === 'error' && <p role="alert">{errorMsg}</p>}
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? '送信中...' : '送信する'}
      </button>
    </form>
  )
}
```

### Next.js（Server Actions）

```typescript
// app/contact/actions.ts
'use server'

export async function submitContact(formData: FormData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  }

  const res = await fetch(
    `${process.env.LUNO_BASE_URL}/public/v1/contact-forms/contact/submit`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )

  const json = await res.json()
  if (!json.ok) throw new Error(json.error.message)
  return { success: true }
}
```

## メール通知の設定

送信時に、設定した通知先メールアドレスに送信内容がメールで届きます。

### 必要な設定

メール送信には **Resend** を使用します。`wrangler.toml` または Cloudflare Workers の環境変数に以下を設定してください：

```toml
[vars]
RESEND_API_KEY = "re_your_resend_api_key"
APP_BASE_URL   = "https://console.luno.rest"
MAIL_FROM      = "LUNO <noreply@luno.rest>"
```

::: tip Resend について
Resend は開発者向けのメール送信 API サービスです。無料プランで月 3,000 通まで送信できます。[resend.com](https://resend.com) でアカウントを作成してください。
:::

`RESEND_API_KEY` が未設定の場合、メール内容はサーバーログに出力されます（ローカル開発に便利です）。

### メールの内容

通知メールには以下が含まれます：
- 送信者の入力値（全フィールド）
- 送信日時
- 管理画面への直接リンク（送信データの確認ページ）

## 自動返信（サンクスメール）

フォーム設定で **自動返信** を有効にすると、送信者のメールアドレス宛に HTML サンクスメールを送れます。

| 設定 | 説明 |
|---|---|
| `autoreply_enabled` | 自動返信の ON/OFF |
| `autoreply_to_field` | 送信者メールが入るフィールド key（email 型） |
| `autoreply_subject` / `autoreply_body` | 件名・本文（多言語可） |
| `email_signature` | 署名（任意） |

## 外部通知・連携

管理画面のフォーム設定から、受信時に次のチャネルへ通知・連携できます（プラン・設定により利用可否が異なります）。

- **チャット通知:** Slack / Microsoft Teams / Discord / Chatwork / LINE Notify
- **CRM 連携:** HubSpot / kintone
- **スパム対策:** Honeypot、ホスト型公開時は Cloudflare Turnstile

## ホスト型公開（contact.luno.rest）

サイト設定で **contact.luno.rest で公開** を有効にすると、LUNO がホストするお問い合わせページ / iframe 埋め込みを使えます。

- 公開 URL 例: `https://contact.luno.rest/{projectSlug}/{formSlug}`
- 埋め込み用の widget / iframe スニペットは管理画面の公開パネルからコピーできます
- ホスト型 iframe では Turnstile が有効になります

API だけで自前フォームを持つ場合は、従来どおり `POST /public/v1/contact-forms/{slug}/submit`（または `/public/p/{projectId}/v1/...`）を使います。

## 送信データの確認

受信した問い合わせは管理画面の **「コンタクトフォーム」→「送信一覧」** から確認できます。

- 受信日時・送信者情報・入力内容を一覧表示
- 対応済み・未対応のステータス管理
- 各送信に対してメモを追加可能

## CORS について

公開 API はすべてのオリジンからのリクエストを受け付けます（`Access-Control-Allow-Origin: *`）。ブラウザから直接 `fetch` でリクエストを送れます。

## 次のステップ

- [API 概要](/ja/api/overview) — エラーコードと CORS の詳細
- [Webhook](/ja/api/webhooks) — 送信データを外部サービスに転送する
- [セルフホスト：環境変数](/ja/self-hosting/env-vars) — Resend API キーの設定
