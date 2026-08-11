---
title: Changelog
description: LUNO ドキュメントと公開仕様の主な更新履歴。
---

# Changelog

ドキュメントと公開仕様の更新を新しい順に記録します。製品の稼働状況は [Status](https://status.luno.rest) を参照してください。

## 2026-08-11

- プロダクトを「運用面 / プラットフォーム」の2階層に分類（ハブ・サイドバー）
- サイドバー見出しに細いアウトラインアイコン、スタートカードに三角バッジ（Neon 型）を追加
- カバレッジ補完: Masters / 公開 API キー / 多言語 / プランの overview を追加
- フレームワーク別レシピ（Next.js / Astro / Nuxt）を追加し、Connect・サイドバー・llms.txt に接続
- AI アシストに「今すぐやる」3 行を追加
- ハブのコピーボタンをカードリンクから分離し、コピー成功表示を安定化
- GitHub Actions を checkout/setup-node/pnpm-action の現行 major に更新（Node 20 警告対策）
- メディア / SEO / スケジュール公開に「今すぐやる」3 行を追加
- ハブのモバイル横スクロール（長いコピーコマンド）を修正
- `packageManager`（pnpm@10）を package.json に固定し、CI と揃えた
- コンテンツ管理・フォームビルダー冒頭に「今すぐやる」3 行を追加
- Prev/Next をスタート → 完成形 A/B/C → プロダクト概要 → 深層ガイドの旅順に再配線
- Changelog 運用ルールを README に明記
- Content / Embed 概要を完成形同型に揃え、サイドバーの完成形を折りたたみグループ化
- `llms.txt` に経路 A/B/C と Products 一覧を追加（検索・エージェント向けキーワード同期）
- 完成形ページに「今すぐやる」手順とチェックリストを追加
- Contact / Webhooks 概要を完成形同型（できていること・今すぐやる・次の一手）に揃えた
- 検索向けに title / description を経路名（Agents / Console / API only）で整備
- 経路別の完成形ページ（Agents / Console / API only）を追加
- Contact / Embed / Webhooks にも curl・JS・MCP（または HTML）タブを追加
- 製品ハブの日英文言・カード密度・CTA を揃え、スタートを完成形へ誘導
- Connect ロゴグリッドとスタート経路 A/B/C、Products overview を追加
- 公開 API・クイックスタートのコード例を curl / JS / MCP タブに整理
- Webhook ペイロードとエージェントスコープを製品実装に同期
- 公開 API の推奨ベースを `/public/p/{projectId}/v1` に明示

## それ以前

- 公開 API・セルフホスト・埋め込み・コンタクトのガイドを整備
- `llms.txt` / ドキュメントサイトの `llms-full.txt` を公開
