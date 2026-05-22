---
title: 環境変数リファレンス
description: luno HCMS の全環境変数の説明、必須・推奨・オプションの区別、wrangler.toml の完全な設定例を記載します。
---

# 環境変数リファレンス

`apps/api/wrangler.toml` の `[vars]` セクション、または Cloudflare Dashboard の Workers 環境変数として設定します。機密情報（シークレット）は `wrangler secret put` コマンドで安全に登録してください。

## 必須

| 変数名 | 説明 | 設定例 |
|---|---|---|
| `JWT_SECRET` | JWT 署名に使う秘密鍵（HS256）。**最低 32 文字以上**のランダムな文字列 | `openssl rand -hex 32` で生成 |
| `DEFAULT_TENANT_ID` | ホストベースのテナント解決で使うデフォルトプロジェクト ID（UUID） | `00000000-0000-0000-0000-000000000001` |

```bash
# JWT_SECRET の生成例
openssl rand -hex 32
# → a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0

# シークレットとして登録（Cloudflare の暗号化ストレージに保存）
wrangler secret put JWT_SECRET
```

## データベース

| 変数名 | 説明 |
|---|---|
| `HYPERDRIVE` | Cloudflare Hyperdrive バインディング。`wrangler.toml` の `[[hyperdrive]]` セクションで設定 |

### Hyperdrive の設定（推奨）

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "your-hyperdrive-id"  # wrangler hyperdrive create で取得
```

```bash
# Hyperdrive の作成
wrangler hyperdrive create luno-hyperdrive \
  --connection-string "postgres://user:password@your-db-host:5432/luno"
```

### ローカル開発（Hyperdrive なし）

```toml
[vars]
# ローカル PostgreSQL への接続文字列
DATABASE_URL = "postgres://luno:luno@127.0.0.1:5432/luno"
```

## 認証

| 変数名 | デフォルト | 説明 |
|---|---|---|
| `DEV_AUTH_ENABLED` | `false` | `true` にすると `/admin/v1/auth/dev-token` でパスワードなしでトークン取得可（**本番では必ず false**） |
| `REGISTRATION_ENABLED` | `false` | `true` にするとユーザーの自己登録が可能 |
| `GOOGLE_OAUTH_ENABLED` | `false` | `true` にすると Google OAuth ログインを有効化 |

::: danger 本番環境の必須設定
`DEV_AUTH_ENABLED=false` を忘れると、誰でもパスワードなしでトークンを取得できます。**本番環境では絶対に `false` を設定**してください。
:::

### Google OAuth の追加設定

`GOOGLE_OAUTH_ENABLED=true` の場合、以下も必須です：

| 変数名 | 説明 |
|---|---|
| `GOOGLE_OAUTH_CLIENT_ID` | Google Cloud Console の OAuth クライアント ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth クライアントシークレット |

**Google Cloud Console での設定手順：**

1. [Google Cloud Console](https://console.cloud.google.com) で新しいプロジェクトを作成
2. 「API とサービス」→「認証情報」→「OAuth クライアント ID を作成」
3. アプリケーションの種類: 「ウェブアプリケーション」
4. 承認済みリダイレクト URI: `https://your-domain.com/admin/v1/auth/oauth/google/callback`
5. クライアント ID とシークレットを環境変数に設定

## メール

| 変数名 | 説明 | 例 |
|---|---|---|
| `RESEND_API_KEY` | Resend の API キー。未設定の場合はコンソールにログ出力 | `re_123abc456def` |
| `APP_BASE_URL` | メール内リンク・コールバック URL のベース | `https://admin.your-domain.com` |

```bash
# Resend のシークレットとして登録
wrangler secret put RESEND_API_KEY
```

### ローカルでのメール確認

`RESEND_API_KEY` が未設定の場合、メール内容は Workers のログに出力されます。開発トークン経由でメールリンクを確認できます：

```bash
# メール認証リンクをログから確認（DEV_AUTH_ENABLED=true の場合）
curl "http://localhost:8787/admin/v1/auth/dev-email-token?email=user@example.com&type=verify"
```

## メディアストレージ

| 変数名 | 説明 |
|---|---|
| `MEDIA_BUCKET` | Cloudflare R2 バインディング名。`[[r2_buckets]]` セクションで設定 |

```toml
# wrangler.toml の R2 設定例
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "luno-media-production"

# ローカル開発用（miniflare でのモック）
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "luno-media-dev"
preview_bucket_name = "luno-media-dev"
```

```bash
# 本番 R2 バケットの作成
wrangler r2 bucket create luno-media-production
```

## 画像バリアント（キュー）

| バインディング名 | 説明 |
|---|---|
| `IMAGE_VARIANT_QUEUE` | 画像リサイズ処理を行う Workers Queue のバインディング |

```toml
[[queues.producers]]
binding = "IMAGE_VARIANT_QUEUE"
queue = "luno-image-variants"

[[queues.consumers]]
queue = "luno-image-variants"
max_batch_size = 10
max_batch_timeout = 30
```

## 課金（Billing、オプション）

Stripe を使った課金機能を有効化する場合：

| 変数名 | 説明 |
|---|---|
| `BILLING_ENABLED` | `true` にすると Stripe 課金機能を有効化 |
| `STRIPE_SECRET_KEY` | Stripe のシークレットキー（`sk_live_...`） |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook のシークレット（`whsec_...`） |

## wrangler.toml の完全な設定例

```toml
name = "luno-api"
main = "src/index.ts"
compatibility_date = "2024-06-01"
compatibility_flags = ["nodejs_compat"]

# ── 基本設定 ──────────────────────────────────────────────────
[vars]
DEFAULT_TENANT_ID    = "00000000-0000-0000-0000-000000000001"
REGISTRATION_ENABLED = "false"
DEV_AUTH_ENABLED     = "false"
GOOGLE_OAUTH_ENABLED = "false"
APP_BASE_URL         = "https://admin.your-domain.com"

# ── Hyperdrive（PostgreSQL 接続プール）────────────────────────
[[hyperdrive]]
binding = "HYPERDRIVE"
id      = "your-hyperdrive-id-from-wrangler-hyperdrive-create"

# ── R2（メディアストレージ）───────────────────────────────────
[[r2_buckets]]
binding     = "MEDIA_BUCKET"
bucket_name = "luno-media-production"

# ── Workers Queue（画像バリアント生成）────────────────────────
[[queues.producers]]
binding = "IMAGE_VARIANT_QUEUE"
queue   = "luno-image-variants"

[[queues.consumers]]
queue              = "luno-image-variants"
max_batch_size     = 10
max_batch_timeout  = 30

# ── Cron Triggers（スケジュール公開）─────────────────────────
[triggers]
crons = ["* * * * *"]  # 毎分実行

# ── 本番環境設定（環境名: production）─────────────────────────
[env.production]
[env.production.vars]
APP_BASE_URL = "https://admin.your-domain.com"
```

## シークレットの安全な管理

機密情報は `wrangler.toml` に平文で書かず、`wrangler secret put` コマンドで登録してください。Cloudflare の暗号化ストレージに保存され、デプロイ時に自動的に注入されます。

```bash
# 各シークレットを登録（プロンプトで値を入力）
wrangler secret put JWT_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET  # Google OAuth 使用時
wrangler secret put STRIPE_SECRET_KEY           # Stripe 使用時

# 登録済みシークレットの確認（値は表示されない）
wrangler secret list
```

### GitHub Actions での自動デプロイ

```yaml
# .github/workflows/deploy.yml
- name: Deploy API
  run: pnpm --filter @luno/api deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

GitHub Secrets に `CLOUDFLARE_API_TOKEN` を登録しておけば、`wrangler secret put` で登録したシークレットはデプロイ時に自動的に使用されます。

## 次のステップ

- [デプロイガイド](/ja/self-hosting/deployment) — ステップバイステップのデプロイ手順
- [セルフホスト概要](/ja/self-hosting/) — アーキテクチャの概要
