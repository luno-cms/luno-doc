<script setup lang="ts">
defineProps<{
  locale: "ja" | "en";
}>();

const copy = {
  ja: {
    startTitle: "スタート",
    startLead: "最短で触る、管理画面で理解する、API でつなぐ。",
    productsTitle: "プロダクト",
    productsLead: "コンテンツ運用に必要な面を、ひとつのプラットフォームで。",
    connectTitle: "つなぐ",
    connectLead: "AI エージェントとフロントエンドからすぐ接続できます。",
    refTitle: "リファレンス",
    refLead: "認証・エンドポイント・運用設定の仕様。",
    start: [
      {
        badge: "~5 min",
        title: "MCP で始める",
        body: "既存サイトリポジトリで setup。キーを置いて Cursor / Claude Code / Codex から操作。",
        href: "/ja/api/ai-agents",
        cta: "AI エージェントガイド",
      },
      {
        badge: "Console",
        title: "管理画面クイックスタート",
        body: "ログインから最初のエントリ公開まで。承認フローとスケジュール公開の入口。",
        href: "/ja/guide/getting-started",
        cta: "クイックスタート",
      },
      {
        badge: "API",
        title: "公開 API で読む",
        body: "認証不要（または公開キー）でエントリ・マスタ・メディアを取得。",
        href: "/ja/api/public-api",
        cta: "公開 API",
      },
    ],
    products: [
      {
        title: "コンテンツ & フォーム",
        body: "15 種のフィールド、リビジョン、レビュー、スケジュール公開。",
        href: "/ja/guide/content-management",
      },
      {
        title: "コンタクト",
        body: "受信・自動返信・チャット通知。contact.luno.rest でのホスト公開。",
        href: "/ja/guide/contact-forms",
      },
      {
        title: "埋め込み & Pub",
        body: "widget / iframe と pub.luno.rest。サイトにそのまま載せられる。",
        href: "/ja/guide/embed",
      },
      {
        title: "AI エージェント",
        body: "MCP・エージェントキー・サイトごとの llms.txt。",
        href: "/ja/api/ai-agents",
      },
      {
        title: "Webhook",
        body: "公開イベントを HMAC 署名付きで配信。ISR や外部連携向け。",
        href: "/ja/api/webhooks",
      },
      {
        title: "メディア & SEO",
        body: "アセット配信、サイトマップ、OGP、構造化データ。",
        href: "/ja/guide/media",
      },
    ],
    connect: [
      {
        title: "Cursor / Claude / Codex",
        body: "npx @luno-cms/mcp setup",
        href: "/ja/api/ai-agents",
      },
      {
        title: "公開 API + projectId",
        body: "/public/p/{projectId}/v1",
        href: "/ja/api/public-api",
      },
      {
        title: "ウィジェット埋め込み",
        body: "snippet をコピーして配置",
        href: "/ja/guide/embed",
      },
    ],
    refs: [
      { title: "API 概要", href: "/ja/api/overview" },
      { title: "公開 API", href: "/ja/api/public-api" },
      { title: "Webhook", href: "/ja/api/webhooks" },
      { title: "環境変数", href: "/ja/self-hosting/env-vars" },
      { title: "デプロイ", href: "/ja/self-hosting/deployment" },
    ],
    consoleCta: "Console を開く",
    consoleHref: "https://console.luno.rest",
    signupCta: "アカウント作成",
    signupHref: "https://console.luno.rest/register",
  },
  en: {
    startTitle: "Get started",
    startLead: "Touch it fast, learn the console, then wire the API.",
    productsTitle: "Products",
    productsLead: "Content operations surfaces in one platform.",
    connectTitle: "Connect",
    connectLead: "Hook up AI agents and frontends in minutes.",
    refTitle: "Reference",
    refLead: "Auth, endpoints, and ops configuration.",
    start: [
      {
        badge: "~5 min",
        title: "Start with MCP",
        body: "Run setup in your site repo, store keys, operate from Cursor / Claude Code / Codex.",
        href: "/en/api/ai-agents",
        cta: "AI Agents guide",
      },
      {
        badge: "Console",
        title: "Admin quick start",
        body: "From sign-in to first publish—approval flow and scheduled publishing.",
        href: "/en/guide/getting-started",
        cta: "Quick start",
      },
      {
        badge: "API",
        title: "Read via Public API",
        body: "Fetch entries, masters, and media with no auth (or a public API key).",
        href: "/en/api/public-api",
        cta: "Public API",
      },
    ],
    products: [
      {
        title: "Content & forms",
        body: "15 field types, revisions, review, scheduled publishing.",
        href: "/en/guide/content-management",
      },
      {
        title: "Contact",
        body: "Inbox, autoreply, chat notify. Host on contact.luno.rest.",
        href: "/en/guide/contact-forms",
      },
      {
        title: "Embed & Pub",
        body: "widget / iframe and pub.luno.rest for drop-in publishing.",
        href: "/en/guide/embed",
      },
      {
        title: "AI agents",
        body: "MCP, agent keys, and per-site llms.txt.",
        href: "/en/api/ai-agents",
      },
      {
        title: "Webhooks",
        body: "HMAC-signed publish events for ISR and integrations.",
        href: "/en/api/webhooks",
      },
      {
        title: "Media & SEO",
        body: "Asset delivery, sitemaps, OGP, structured data.",
        href: "/en/guide/media",
      },
    ],
    connect: [
      {
        title: "Cursor / Claude / Codex",
        body: "npx @luno-cms/mcp setup",
        href: "/en/api/ai-agents",
      },
      {
        title: "Public API + projectId",
        body: "/public/p/{projectId}/v1",
        href: "/en/api/public-api",
      },
      {
        title: "Widget embed",
        body: "Copy a snippet and ship",
        href: "/en/guide/embed",
      },
    ],
    refs: [
      { title: "API overview", href: "/en/api/overview" },
      { title: "Public API", href: "/en/api/public-api" },
      { title: "Webhooks", href: "/en/api/webhooks" },
      { title: "Environment variables", href: "/en/self-hosting/env-vars" },
      { title: "Deployment", href: "/en/self-hosting/deployment" },
    ],
    consoleCta: "Open Console",
    consoleHref: "https://console.luno.rest",
    signupCta: "Create account",
    signupHref: "https://console.luno.rest/register",
  },
} as const;
</script>

<template>
  <div class="hub" :data-locale="locale">
    <section class="hub-section">
      <header class="hub-section__head">
        <h2>{{ copy[locale].startTitle }}</h2>
        <p>{{ copy[locale].startLead }}</p>
      </header>
      <div class="hub-grid hub-grid--start">
        <a
          v-for="item in copy[locale].start"
          :key="item.href"
          class="hub-card hub-card--start"
          :href="item.href"
        >
          <span class="hub-badge">{{ item.badge }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
          <span class="hub-card__cta">{{ item.cta }} →</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <header class="hub-section__head">
        <h2>{{ copy[locale].productsTitle }}</h2>
        <p>{{ copy[locale].productsLead }}</p>
      </header>
      <div class="hub-grid hub-grid--products">
        <a
          v-for="item in copy[locale].products"
          :key="item.href"
          class="hub-card"
          :href="item.href"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <header class="hub-section__head">
        <h2>{{ copy[locale].connectTitle }}</h2>
        <p>{{ copy[locale].connectLead }}</p>
      </header>
      <div class="hub-grid hub-grid--connect">
        <a
          v-for="item in copy[locale].connect"
          :key="item.href"
          class="hub-card hub-card--connect"
          :href="item.href"
        >
          <h3>{{ item.title }}</h3>
          <code>{{ item.body }}</code>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <header class="hub-section__head">
        <h2>{{ copy[locale].refTitle }}</h2>
        <p>{{ copy[locale].refLead }}</p>
      </header>
      <ul class="hub-refs">
        <li v-for="item in copy[locale].refs" :key="item.href">
          <a :href="item.href">{{ item.title }}</a>
        </li>
      </ul>
      <div class="hub-actions">
        <a class="hub-btn hub-btn--primary" :href="copy[locale].consoleHref">
          {{ copy[locale].consoleCta }}
        </a>
        <a class="hub-btn hub-btn--ghost" :href="copy[locale].signupHref">
          {{ copy[locale].signupCta }}
        </a>
      </div>
    </section>
  </div>
</template>
