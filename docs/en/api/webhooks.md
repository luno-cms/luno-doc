---
title: Webhooks
description: luno Webhook setup, event types, payload format, and HMAC-SHA256 signature verification in Node.js, Python, and Go.
---

# Webhooks

luno sends HTTP POST notifications to a URL of your choice when entry lifecycle events occur — publish, update, or delete. Use webhooks to invalidate CDN caches, send Slack alerts, sync content to external systems, or trigger CI/CD pipelines.

::: warning Plan requirement
Webhooks require a **Standard plan or above**.
:::

## Setup

Go to **Settings → Webhooks → New Webhook** in the admin panel.

| Field | Description |
|---|---|
| **Name** | A label to identify this webhook (e.g., `Vercel Revalidate`) |
| **URL** | The HTTPS URL to send events to |
| **Description** | Optional memo |
| **Events** | Event types to subscribe to (multi-select) |
| **Enabled** | Toggle active/inactive |

After saving, copy the **signing secret** — it's only shown once.

::: warning Save the signing secret
The secret is only displayed at creation time. Store it securely (e.g., as an environment variable). If you lose it, you'll need to recreate the webhook.
:::

## Event Types

| Event | Trigger |
|---|---|
| `entry.published` | An entry goes live (immediate publish or scheduled publish fires) |
| `entry.updated` | A published entry's content is replaced by a new revision |
| `entry.deleted` | An entry is deleted |
| `master.published` | A master entity is published |

## Payload Format

### Entry events

Field values (`data`) are **not included**. Fetch content from the Public API if needed.

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

| Field | Type | Description |
|---|---|---|
| `event` | string | `entry.published` / `entry.updated` / `entry.deleted` |
| `project_id` | string (UUID) | Project ID |
| `form_set_slug` | string | Form set slug |
| `entry_slug` | string | Entry slug |
| `entry_id` | string (UUID) | Entry ID |
| `revision_id` | string (UUID) | Published revision ID (when present) |
| `timestamp` | string (ISO 8601) | Delivery time |

### Master events (`master.published`)

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

## Typical flow after delivery

Payloads do not include field bodies — refetch from the Public API when needed.

::: code-group

```bash [curl]
# After entry.published, fetch the body
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries/my-first-post?include_snapshot=true"
```

```ts [JS]
// After signature verification (see below)
const { project_id, form_set_slug, entry_slug } = payload
const res = await fetch(
  `https://api.luno.rest/public/p/${project_id}/v1/form-sets/${form_set_slug}/entries/${entry_slug}?include_snapshot=true`
)
const entry = await res.json()
// → ISR revalidate / search index update, etc.
```

```bash [MCP]
# Agent prompt example:
# "Write a handler that on entry.published fetches the body and revalidates /blog"
```

:::

## Signature Verification

Every webhook request includes an `X-Luno-Signature` header:

```
X-Luno-Signature: sha256=<HMAC-SHA256 hex digest of raw request body>
```

::: warning Use the raw body
Compute the HMAC over the **raw request bytes** — not a re-serialized JSON string. Any difference in whitespace, key ordering, or character encoding will cause verification to fail.
:::

### Node.js (Express)

```typescript
import express from 'express'
import crypto from 'crypto'

const app = express()

function verifySignature(
  rawBody: Buffer | string,
  signature: string,
  secret: string
): boolean {
  const body = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : rawBody
  const expected =
    'sha256=' +
    crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

// Use express.raw() to preserve the raw body
app.post(
  '/webhook/luno',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['x-luno-signature'] as string

    if (!verifySignature(req.body, sig, process.env.LUNO_WEBHOOK_SECRET!)) {
      console.warn('Invalid webhook signature')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const payload = JSON.parse(req.body.toString('utf8'))
    console.log('Event:', payload.event, '| Entry:', payload.entry_slug)

    switch (payload.event) {
      case 'entry.published':
        // Invalidate CDN cache, update search index, etc.
        break
      case 'entry.updated':
        // Re-fetch and update cached content
        break
      case 'entry.deleted':
        // Remove from cache and search index
        break
    }

    res.sendStatus(200)
  }
)
```

### Next.js (App Router)

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

  if (payload.event === 'entry.published' || payload.event === 'entry.updated') {
    // Revalidate the Next.js cache for this entry's page
    const path = `/${payload.form_set_slug}/${payload.entry_slug}`
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=${path}`, {
      method: 'POST',
      headers: { 'x-revalidate-token': process.env.REVALIDATE_TOKEN! },
    })
  }

  return NextResponse.json({ ok: true })
}
```

### Python (FastAPI)

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

    if payload["event"] == "entry.published":
        print(f"Published: {payload['entry_slug']}")
        # trigger cache invalidation, etc.

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
)

const webhookSecret = "your-webhook-secret"

func verifySignature(body []byte, signature, secret string) bool {
    mac := hmac.New(sha256.New, []byte(secret))
    mac.Write(body)
    expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(signature), []byte(expected))
}

func handleWebhook(w http.ResponseWriter, r *http.Request) {
    body, _ := io.ReadAll(r.Body)
    sig := r.Header.Get("X-Luno-Signature")

    if !verifySignature(body, sig, webhookSecret) {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }

    var payload map[string]interface{}
    json.Unmarshal(body, &payload)
    fmt.Printf("Event: %s, Slug: %s\n", payload["event"], payload["entry_slug"])
    w.WriteHeader(http.StatusOK)
}
```

## Failures and Redelivery

Failed deliveries (5xx, timeout, etc.) are **recorded in Delivery History**. There is no automatic scheduled retry. Use **Redeliver** from Delivery History in the admin console.

::: tip Make your handler idempotent
Manual redelivery (or duplicate deliveries) can send the same event more than once. Make handlers idempotent — e.g. dedupe on `entry_id` + `event` + `timestamp`.
:::

## Test Delivery

Click **Send Test** in the webhook settings page to send a dummy payload to your endpoint. Use this to verify your endpoint is reachable and signature verification is working before receiving real events.

## Delivery History

Go to **Settings → Webhooks → Delivery History** to inspect every delivery attempt and redeliver failures:

- Timestamp
- HTTP status code received
- Sent payload
- Response body
- Error details for failed attempts
- Manual redeliver for failures

## Reference

| Property | Value |
|---|---|
| Protocol | **HTTPS only** (HTTP is rejected) |
| Timeout | **10 seconds** |
| Success codes | HTTP **200–299** |
| Signature header | `X-Luno-Signature` |
| Body format | Verify against **raw bytes**, not re-serialized JSON |
| Event ordering | Not guaranteed |

## Next Steps

- [Content Management](/en/guide/content-management) — Entry lifecycle that triggers events
- [Scheduled Publishing](/en/guide/schedule) — How schedule-triggered publishes fire Webhook events
- [API Overview](/en/api/overview) — Authentication and error codes
