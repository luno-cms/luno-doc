---
title: Webhook
description: luno の Webhook 設定、イベント種別、ペイロード形式、HMAC-SHA256 署名検証（Node.js・Python・Go）、リトライ動作を説明します。
---

# Webhook

luno はエントリのライフサイクルイベントを任意の URL に HTTP POST で通知します。フロントエンドの ISR キャッシュのパージ・Slack 通知・外部 CRM への同期など、コンテンツ更新をトリガーとした自動化に使用できます。

::: warning プラン制限
Webhook は **Standard プラン以上**で利用可能です。
:::

## 設定

管理画面の **「設定」→「Webhook」→「新規作成」** から設定します。

| 項目 | 説明 |
|---|---|
| **名前** | Webhook の識別名（例: `Vercel Revalidate`） |
| **URL** | 通知先の HTTPS URL（HTTP は拒否） |
| **説明** | メモ（任意） |
| **イベント** | 受け取るイベントの種類（複数選択可） |
| **有効** | 有効 / 無効の切り替え |

設定後、自動生成された **シークレット**（署名検証用）が表示されます。

::: warning シークレットは一度限り
シークレットは設定時に一度だけ表示されます。必ず安全な場所（環境変数など）に保存してください。紛失した場合は Webhook を再作成してください。
:::

## イベント種別

| イベント | 説明 | タイミング |
|---|---|---|
| `entry.published` | エントリが公開されたとき | `scheduled` → `published` または即時公開時 |
| `entry.updated` | 公開済みエントリが更新されたとき | 既存の公開エントリに新リビジョンが公開された |
| `entry.deleted` | エントリが削除されたとき | エントリ削除操作 |

## ペイロード形式

すべてのイベントで共通のペイロード構造です。

```json
{
  "event": "entry.published",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "form_set_slug": "blog",
  "entry_slug": "my-first-post",
  "entry_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "published_at": "2025-01-15T10:00:00Z",
  "data": {
    "title": "はじめての投稿",
    "body": "<h2>はじめに</h2><p>こんにちは、世界！</p>",
    "cover": "asset-uuid-here",
    "category": "blog",
    "tags": ["cloudflare", "cms"]
  }
}
```

| フィールド | 型 | 説明 |
|---|---|---|
| `event` | string | イベント種別（`entry.published` / `entry.updated` / `entry.deleted`） |
| `tenant_id` | string (UUID) | プロジェクト ID |
| `form_set_slug` | string | フォームセットの slug |
| `entry_slug` | string | エントリの slug |
| `entry_id` | string (UUID) | エントリの ID |
| `published_at` | string (ISO 8601) | 公開日時（`entry.published` / `entry.updated` のみ） |
| `data` | object | エントリのフィールド値（`entry.deleted` では `{}`） |

## 署名検証

すべてのリクエストには `X-Luno-Signature` ヘッダーが付与されます。

```
X-Luno-Signature: sha256=<HMAC-SHA256 of raw body with secret>
```

::: warning raw body で検証してください
JSON パース後の文字列ではなく、**受信した raw bytes（生バイト列）** でシグネチャを計算してください。文字エンコードや改行コードの違いで検証が失敗します。
:::

### Node.js（Express）

```typescript
import express from 'express'
import crypto from 'crypto'

const app = express()

function verifyLunoWebhook(
  rawBody: Buffer | string,
  signature: string,
  secret: string
): boolean {
  const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8')
  const expected =
    'sha256=' +
    crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex')

  // タイミング攻撃を防ぐために timingSafeEqual を使用
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  } catch {
    return false
  }
}

// raw body を取得するために express.raw() を使用
app.post(
  '/webhook/luno',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['x-luno-signature'] as string

    if (!verifyLunoWebhook(req.body, sig, process.env.LUNO_WEBHOOK_SECRET!)) {
      console.warn('Invalid webhook signature')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const payload = JSON.parse(req.body.toString('utf8'))
    console.log('Received event:', payload.event, payload.entry_slug)

    // イベントに応じた処理
    switch (payload.event) {
      case 'entry.published':
        // キャッシュをパージ、インデックスを更新など
        break
      case 'entry.updated':
        // 更新処理
        break
      case 'entry.deleted':
        // 削除処理
        break
    }

    res.sendStatus(200)
  }
)
```

### Next.js（App Router）

```typescript
// app/api/webhook/luno/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const SECRET = process.env.LUNO_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-luno-signature') ?? ''

  const expected =
    'sha256=' +
    crypto.createHmac('sha256', SECRET).update(rawBody, 'utf8').digest('hex')

  let valid = false
  try {
    valid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  } catch {
    valid = false
  }

  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)

  if (payload.event === 'entry.published') {
    // Next.js のキャッシュを再検証
    const path = `/blog/${payload.entry_slug}`
    await fetch(`${process.env.VERCEL_URL}/api/revalidate?path=${path}`, {
      method: 'POST',
    })
  }

  return NextResponse.json({ ok: true })
}
```

### Python（FastAPI）

```python
import hashlib
import hmac
import json
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()
WEBHOOK_SECRET = "your-webhook-secret"

def verify_signature(raw_body: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode("utf-8"),
        raw_body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)

@app.post("/webhook/luno")
async def luno_webhook(request: Request):
    raw_body = await request.body()
    signature = request.headers.get("x-luno-signature", "")

    if not verify_signature(raw_body, signature, WEBHOOK_SECRET):
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = json.loads(raw_body)
    event = payload["event"]

    if event == "entry.published":
        print(f"Published: {payload['entry_slug']}")
        # キャッシュのパージ処理など

    return {"ok": True}
```

### Go

```go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "strings"
)

const webhookSecret = "your-webhook-secret"

func verifySignature(body []byte, signature, secret string) bool {
    mac := hmac.New(sha256.New, []byte(secret))
    mac.Write(body)
    expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(signature), []byte(expected))
}

func handleWebhook(w http.ResponseWriter, r *http.Request) {
    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        return
    }

    sig := r.Header.Get("X-Luno-Signature")
    if !verifySignature(body, sig, webhookSecret) {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }

    var payload map[string]interface{}
    if err := json.Unmarshal(body, &payload); err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        return
    }

    fmt.Printf("Event: %s, Entry: %s\n", payload["event"], payload["entry_slug"])
    w.WriteHeader(http.StatusOK)
}
```

## リトライ動作

Webhook の配信に失敗した場合（5xx エラー・タイムアウト）、luno は自動的に再送します。

| 試行 | 待機時間 |
|---|---|
| 1 回目（初回） | 即時 |
| 2 回目 | 1 分後 |
| 3 回目 | 5 分後 |
| 4 回目（最終） | 30 分後 |

::: tip 冪等性の確保
リトライにより同じイベントが複数回配信される可能性があります。処理が冪等になるよう実装してください（例: `entry_id` + `event` の組み合わせで重複チェック）。
:::

## テスト配信

管理画面の Webhook 設定画面から **「テスト送信」** ボタンをクリックすると、ダミーペイロードを指定 URL に送信できます。エンドポイントの動作確認に使用してください。

## 配信履歴

管理画面の **「設定」→「Webhook」→「配信履歴」** から、各イベントの配信状況を確認できます：

- 配信日時
- ステータスコード
- 送信ペイロード
- レスポンスボディ
- 配信に失敗した場合のエラー詳細

## よくある注意事項

| 項目 | 仕様 |
|---|---|
| プロトコル | **HTTPS 必須**（HTTP は拒否） |
| タイムアウト | **10 秒**（これを超えると失敗扱い） |
| 成功判定 | HTTP **200〜299** が返された場合 |
| 署名検証 | raw body（バイト列のまま）で検証すること |
| 順序保証 | イベントの順序は保証されません |

## 次のステップ

- [コンテンツ管理](/ja/guide/content-management) — エントリライフサイクルの詳細
- [API 概要](/ja/api/overview) — 認証方式とエラーコード
- [スケジュール公開](/ja/guide/schedule) — スケジュール公開時の Webhook 動作
