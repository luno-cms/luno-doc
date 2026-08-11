# luno-doc

LUNO 公式ドキュメント（VitePress → Cloudflare Pages）。  
本番: https://doc.luno.rest

## 開発

```bash
pnpm install
pnpm dev
pnpm build
```

`main` への push で GitHub Actions 経由の Pages デプロイが走ります。

## Changelog 運用ルール

仕様・API・導線・製品面の説明を変えたら、**同じ PR / コミットで** Changelog に 1 行以上追記する。

| ファイル | 用途 |
|---|---|
| [`docs/ja/changelog.md`](docs/ja/changelog.md) | 日本語 |
| [`docs/en/changelog.md`](docs/en/changelog.md) | English |

書き方:

- 日付見出し（`## YYYY-MM-DD`）の直下に箇条書き
- **なぜ・何が変わったか**を短く（ファイル一覧ではなく利用者への影響）
- エージェント向け索引（`docs/public/llms.txt`）に影響する場合はそちらも更新

例:

```md
## 2026-08-11

- Webhook ペイロードから `data` を削除し、手動再送のみと明記
```

文言だけの軽微な typo 修正は Changelog 不要。エンドポイント・イベント・スコープ・推奨ベース URL・スタート経路の変更は必須。
