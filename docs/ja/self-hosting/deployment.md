---
title: デプロイガイド
description: luno HCMS を Cloudflare Workers と Cloudflare Pages に本番デプロイするためのステップバイステップガイドです。
---

# デプロイガイド

このガイドでは luno を Cloudflare Workers（API）と Cloudflare Pages（管理画面）にデプロイする手順を説明します。

## 前提条件

- [Cloudflare アカウント](https://dash.cloudflare.com/sign-up)（無料）
- Node.js 20 以上
- pnpm 8 以上
- PostgreSQL データベース（[Neon](https://neon.tech) 推奨、無料枠あり）

## ステップ 1: Wrangler CLI のセットアップ

```bash
# Wrangler CLI のインストール
npm install -g wrangler

# Cloudflare アカウントにログイン
wrangler login
```

ブラウザが開き、Cloudflare の認証ページが表示されます。

## ステップ 2: リポジトリのセットアップ

```bash
git clone https://github.com/luno-cms/luno.git
cd luno
pnpm install
```

## ステップ 3: データベースのセットアップ

### PostgreSQL データベースの準備

[Neon](https://neon.tech) で無料の PostgreSQL を作成します：

1. neon.tech でプロジェクト作成
2. 接続文字列（`postgres://...`）をコピー

または他のサービス（Supabase・Railway・自前 VPS）を使用できます。

### Hyperdrive の作成

```bash
# Cloudflare Hyperdrive を作成
wrangler hyperdrive create luno-hyperdrive \
  --connection-string "postgres://user:password@your-db-host:5432/luno"
```

出力された `id` を `apps/api/wrangler.toml` の `[[hyperdrive]]` セクションに設定します：

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id      = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # 上記コマンドの出力
```

### マイグレーションの実行

```bash
# データベースにマイグレーションを適用
DATABASE_URL="postgres://user:password@your-db-host:5432/luno" pnpm db:migrate

# 初期データを投入（任意）
DATABASE_URL="postgres://user:password@your-db-host:5432/luno" pnpm db:seed
```

## ステップ 4: R2 バケットの作成

```bash
# 本番用メディアストレージバケットを作成
wrangler r2 bucket create luno-media-production
```

`apps/api/wrangler.toml` の `[[r2_buckets]]` を更新：

```toml
[[r2_buckets]]
binding     = "MEDIA_BUCKET"
bucket_name = "luno-media-production"
```

## ステップ 5: シークレットの登録

機密情報を Cloudflare の暗号化ストレージに登録します：

```bash
# JWT シークレット（32 文字以上のランダム文字列）
echo "$(openssl rand -hex 32)" | wrangler secret put JWT_SECRET

# Resend API キー（メール通知を使う場合）
wrangler secret put RESEND_API_KEY
# → プロンプトで API キーを入力

# DEFAULT_TENANT_ID は wrangler.toml で設定
```

`apps/api/wrangler.toml` で非機密の環境変数を設定：

```toml
[vars]
DEFAULT_TENANT_ID    = "00000000-0000-0000-0000-000000000001"
REGISTRATION_ENABLED = "false"
DEV_AUTH_ENABLED     = "false"
APP_BASE_URL         = "https://admin.your-domain.com"
```

## ステップ 6: API のデプロイ

```bash
pnpm --filter @luno/api deploy
```

デプロイ完了後、API が `https://luno-api.your-account.workers.dev` で利用可能になります。

### カスタムドメインの設定

Cloudflare Dashboard → Workers & Pages → `luno-api` → 「カスタムドメイン」から設定します。

## ステップ 7: 管理画面のビルドとデプロイ

### ビルド

```bash
# API の URL を指定してビルド
VITE_API_BASE_URL="https://api.your-domain.com" \
  pnpm --filter @luno/admin build
```

### Cloudflare Pages へのデプロイ

**方法 A: CLI からデプロイ**

```bash
wrangler pages deploy apps/admin/dist --project-name luno-admin
```

**方法 B: GitHub 連携で自動デプロイ（推奨）**

1. Cloudflare Dashboard → Workers & Pages → 「新しいプロジェクトを作成」
2. 「Git に接続」→ GitHub リポジトリを選択
3. ビルド設定を入力：

| 項目 | 設定値 |
|---|---|
| フレームワーク | なし（カスタム） |
| ビルドコマンド | `pnpm --filter @luno/admin build` |
| ビルド出力ディレクトリ | `apps/admin/dist` |
| ルートディレクトリ | `/`（リポジトリルート） |

4. 環境変数を追加：`VITE_API_BASE_URL` → `https://api.your-domain.com`

## ステップ 8: 動作確認

```bash
# API のヘルスチェック
curl https://api.your-domain.com/health
# → { "status": "ok", "defaultTenantId": "..." }

# データベース接続確認
curl https://api.your-domain.com/health/db
# → { "status": "ok", "latencyMs": 5 }

# 公開 API の確認
curl https://api.your-domain.com/public/v1/form-sets/blog/entries
# → { "formSet": {...}, "total": 0, "items": [] }
```

管理画面（`https://admin.your-domain.com`）にアクセスしてログインを確認します。

## アップデート手順

```bash
# コードを最新化
git pull origin main
pnpm install

# DB マイグレーション（差分がある場合）
DATABASE_URL="postgres://..." pnpm db:migrate

# API を再デプロイ
pnpm --filter @luno/api deploy

# 管理画面を再ビルド・デプロイ
VITE_API_BASE_URL="https://api.your-domain.com" \
  pnpm --filter @luno/admin build
wrangler pages deploy apps/admin/dist --project-name luno-admin
```

## CI/CD の設定（GitHub Actions）

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      # shared パッケージをビルド（API の型解決に必要）
      - run: pnpm --filter @luno/shared build

      # API をデプロイ
      - name: Deploy API
        run: pnpm --filter @luno/api deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

      # 管理画面をビルド
      - name: Build Admin
        run: pnpm --filter @luno/admin build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      # 管理画面をデプロイ
      - name: Deploy Admin
        run: |
          wrangler pages deploy apps/admin/dist \
            --project-name luno-admin
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**GitHub Secrets に登録が必要な値：**
- `CLOUDFLARE_API_TOKEN`: Cloudflare API トークン（[作成方法](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)）
- `VITE_API_BASE_URL`: 管理画面からアクセスする API の URL

## トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| `wrangler deploy` がエラー | `wrangler.toml` の設定ミス | `wrangler dev` でローカルテストして確認 |
| DB 接続エラー | Hyperdrive の設定ミス | `wrangler hyperdrive list` で ID を確認 |
| 管理画面が API に繋がらない | CORS / `VITE_API_BASE_URL` の設定ミス | 環境変数を確認し再ビルド |
| JWT エラー | `JWT_SECRET` が未設定 | `wrangler secret list` で確認 |
| メールが届かない | `RESEND_API_KEY` が未設定 | Workers のログを確認（ログに内容が出力される） |

## 次のステップ

- [環境変数リファレンス](/ja/self-hosting/env-vars) — 全設定項目の詳細
- [セルフホスト概要](/ja/self-hosting/) — アーキテクチャの概要
- [クイックスタート](/ja/guide/getting-started) — デプロイ後の初回操作
