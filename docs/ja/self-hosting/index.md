---
title: セルフホスト概要
description: luno HCMS を Cloudflare Workers + PostgreSQL + R2 でセルフホストするためのアーキテクチャ概要、コンポーネント構成、セキュリティ考慮事項を説明します。
---

# セルフホスト概要

luno は Cloudflare のエコシステムを中心に設計されたヘッドレス CMS です。すべてのコンポーネントをセルフホストでき、データの所有権を完全に維持できます。

## アーキテクチャ

<ArchitectureDiagram locale="ja" />

## コンポーネント

| コンポーネント | 役割 | 技術スタック | 必須 |
|---|---|---|:---:|
| **API** | コンテンツ管理・公開 API | Cloudflare Workers (Hono) | ✓ |
| **Database** | コンテンツデータ永続化 | PostgreSQL（互換 DB も可） | ✓ |
| **Admin SPA** | ブラウザ管理画面 | Vite 6 + React + Mantine v8 | ✓ |
| **Hyperdrive** | DB 接続プール・レイテンシ最適化 | Cloudflare Hyperdrive | 推奨 |
| **Media Storage** | 画像・ファイル保存 | Cloudflare R2 | メディア使用時 |
| **Email** | 通知メール送信 | Resend | オプション |

### Cloudflare Workers（API）

luno の API は Hono フレームワークを使用した Cloudflare Workers アプリケーションです。

- エッジで動作するため、世界中のユーザーに低レイテンシで応答
- Cold Start なし（Workers の特性）
- Cloudflare の DDoS 保護・WAF を自動で受けられる

### PostgreSQL（Database）

標準的な PostgreSQL を使用します。以下のホスティングサービスで動作確認済みです：

| サービス | 特徴 |
|---|---|
| **Neon** | サーバーレス PostgreSQL。無料枠あり |
| **Supabase** | オープンソース Firebase 代替。PostgreSQL ベース |
| **Railway** | シンプルなデプロイ。$5/月〜 |
| **Cloudflare Postgres** | Cloudflare D1（将来対応予定） |
| **自前 VPS** | 完全なコントロールが必要な場合 |

### Cloudflare Hyperdrive

Hyperdrive は Workers から PostgreSQL へのコネクションプーリングとキャッシュを提供します。Workers の性質上、リクエストごとにコネクションを確立する必要がありますが、Hyperdrive がこれを解決します。

**Hyperdrive なしでの問題点:**
- Workers → PostgreSQL へのコネクション確立に 100〜500ms かかる
- コネクションプールがないため、高負荷時にコネクション数が爆発する

**Hyperdrive ありの効果:**
- コネクション確立時間をほぼゼロに削減
- コネクションプールで接続数を管理

### Cloudflare R2

メディアファイル（画像・ドキュメント）を保存します。R2 は S3 互換のオブジェクトストレージで、Cloudflare Workers からのアクセスに最適化されています。

- S3 と異なりエグレス料金なし（Workers からのアクセスは無料）
- 画像バリアント（リサイズ版）の非同期生成に Workers Queue を使用

### Resend（メール送信）

メール通知（招待メール・パスワードリセット・コンタクトフォーム受信通知）の送信に使用します。未設定の場合はログに出力されます（ローカル開発に便利）。

## モノレポ構成

luno のソースコードは pnpm モノレポで管理されています：

```
apps/
  api/          Cloudflare Workers API（Hono）
  admin/        React 管理 SPA（Vite 6）
packages/
  db/           マイグレーション SQL ファイル
  shared/       共通型定義・エラーコード
```

## 最小構成

最小限の設定で動作させる場合の必須要件：

1. **Cloudflare Workers アカウント**（無料枠でも動作可能）
2. **PostgreSQL データベース**（Neon の無料枠など）
3. **`JWT_SECRET`** 環境変数（32 文字以上のランダムな文字列）

メディアアップロード、メール通知、Hyperdrive は後から追加できます。

## マルチテナント構成

luno はマルチテナント（複数プロジェクト）に対応しています：

```
Organization（組織）
  └── Project（プロジェクト、= テナント）
        └── Form Set（コンテンツ型）
              └── Entry（コンテンツ）
```

- **superuser**：全組織・全プロジェクトを管理
- **organization_admin**：担当組織内のプロジェクトを管理
- **tenant_admin**：プロジェクト内を管理
- **tenant_user**：コンテンツの作成・編集

## セキュリティの考慮事項

### JWT シークレット

```bash
# 安全なランダム文字列を生成（32 文字以上）
openssl rand -hex 32
```

生成した値を `JWT_SECRET` に設定します。本番環境では `wrangler secret put JWT_SECRET` で暗号化保存してください。

### 開発モードの無効化

本番環境では必ず以下を設定してください：

```toml
[vars]
DEV_AUTH_ENABLED    = "false"  # 開発用トークンを無効化
REGISTRATION_ENABLED = "false" # 自己登録を無効化（招待制を推奨）
```

### 招待制ユーザー管理

`REGISTRATION_ENABLED=false` にすることで、招待メール経由のみでユーザーを追加できます。不正なアカウント作成を防げます。

## 次のステップ

- [環境変数リファレンス](/ja/self-hosting/env-vars) — 全設定項目の詳細
- [デプロイガイド](/ja/self-hosting/deployment) — 本番環境へのデプロイ手順
