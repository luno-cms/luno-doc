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
| `master.published` | マスタが公開されたとき | マスタエンティティの公開操作 |

## ペイロード形式

### エントリイベント

フィールド値（`data`）は**含まれません**。受信側で公開 API などから必要なら再取得してください。

```json
{
  "event": "entry.published",
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "form_set_slug": "blog",
  "entry_slug": "my-first-post",
  "entry_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "revision_id": "a2f3d4e5-1111-2222-3333-444455556666",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

| フィールド | 型 | 説明 |
|---|---|---|
| `event` | string | `entry.published` / `entry.updated` / `entry.deleted` |
| `project_id` | string (UUID) | プロジェクト ID |
| `form_set_slug` | string | フォームセットの slug |
| `entry_slug` | string | エントリの slug |
| `entry_id` | string (UUID) | エントリの ID |
| `revision_id` | string (UUID) | 公開リビジョン ID（ある場合のみ） |
| `timestamp` | string (ISO 8601) | 配信時刻 |

### マスタイベント（`master.published`）

```json
{
  "event": "master.published",
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "master_entity_id": "b1c2d3e4-...",
  "master_entity_key": "category",
  "record_count": 12,
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

## 受信後の典型フロー

ペイロードに本文はないので、必要なら公開 API で取り直します。

::: code-group

```bash [curl]
# entry.published 受信後に本文を取得
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries/my-first-post?include_snapshot=true"
```

```ts [JS]
// 署名検証後（下節参照）
const { project_id, form_set_slug, entry_slug } = payload
const res = await fetch(
  `https://api.luno.rest/public/p/${project_id}/v1/form-sets/${form_set_slug}/entries/${entry_slug}?include_snapshot=true`
)
const entry = await res.json()
// → ISR revalidate / 検索インデックス更新など
```

```bash [MCP]
# エージェント例:
# 「entry.published を受けたら公開 API で本文を取り、/blog を revalidate するハンドラを書いて」
```

:::

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

## 配信失敗と再送

配信に失敗した場合（5xx・タイムアウトなど）は **配信履歴に記録**されます。自動スケジュール再送は行いません。管理画面の配信履歴から **手動で再送（redeliver）** してください。

::: tip 冪等性の確保
手動再送や二重配信の可能性に備え、処理は冪等にしてください（例: `entry_id` + `event` + `timestamp` で重複チェック）。
:::

## テスト配信

管理画面の Webhook 設定画面から **「テスト送信」** ボタンをクリックすると、ダミーペイロードを指定 URL に送信できます。エンドポイントの動作確認に使用してください。

## 配信履歴

管理画面の **「設定」→「Webhook」→「配信履歴」** から、各イベントの配信状況を確認・再送できます：

- 配信日時
- ステータスコード
- 送信ペイロード
- レスポンスボディ
- 配信に失敗した場合のエラー詳細
- 失敗時の手動再送

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
