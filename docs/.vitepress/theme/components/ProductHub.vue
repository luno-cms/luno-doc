<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  locale: "ja" | "en";
}>();

const copiedKey = ref<string | null>(null);

async function copyCommand(command: string, key: string, event: Event) {
  event.preventDefault();
  event.stopPropagation();
  try {
    await navigator.clipboard.writeText(command);
    copiedKey.value = key;
    window.setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null;
    }, 1600);
  } catch {
    // ignore clipboard failures
  }
}

/** Keep ja/en card count, badges, and CTA density aligned. */
const copy = {
  ja: {
    pageTitle: "LUNO Documentation",
    pageLead:
      "AI ネイティブなコンテンツ運用。定義・作成・承認・公開・配信の入口です。",
    startTitle: "スタート",
    startLead: "経路を選ぶ → 完成形を確認 → 手順へ。",
    productsTitle: "プロダクト",
    productsLead: "コンテンツ運用に必要な面を、ひとつのプラットフォームで。",
    connectTitle: "つなぐ",
    connectLead: "ツールを選んで、すぐ使える入口へ。",
    refTitle: "リファレンス",
    refLead: "認証・エンドポイント・運用設定。",
    copyLabel: "コピー",
    copiedLabel: "コピー済み",
    start: [
      {
        key: "mcp",
        badge: "A · Agents · ~5 min",
        title: "MCP で始める",
        body: "サイトリポジトリで setup。Cursor / Claude Code / Codex から操作。",
        href: "/ja/guide/paths/agents",
        cta: "完成形を見る",
        command: "npx @luno-cms/mcp setup",
      },
      {
        key: "console",
        badge: "B · Console · ~10 min",
        title: "管理画面で始める",
        body: "ログインから最初の公開まで。承認とスケジュール公開の入口。",
        href: "/ja/guide/paths/console",
        cta: "完成形を見る",
        command: null,
      },
      {
        key: "api",
        badge: "C · API only · ~3 min",
        title: "公開 API で読む",
        body: "認証不要（または公開キー）でエントリ・マスタ・メディアを取得。",
        href: "/ja/guide/paths/api",
        cta: "完成形を見る",
        command: "curl https://api.luno.rest/public/p/{projectId}/v1/llms.txt",
      },
    ],
    products: [
      {
        title: "Content",
        body: "15 種フィールド、リビジョン、レビュー、スケジュール公開。",
        href: "/ja/products/content",
      },
      {
        title: "Contact",
        body: "受信・自動返信・チャット通知。contact.luno.rest ホスト。",
        href: "/ja/products/contact",
      },
      {
        title: "Embed & Pub",
        body: "widget / iframe と pub.luno.rest でそのまま配信。",
        href: "/ja/products/embed",
      },
      {
        title: "AI Agents",
        body: "MCP、エージェントキー、サイトごとの llms.txt。",
        href: "/ja/products/agents",
      },
      {
        title: "Webhooks",
        body: "HMAC 署名付き公開イベント。ISR・外部連携向け。",
        href: "/ja/products/webhooks",
      },
      {
        title: "Media & SEO",
        body: "アセット配信、サイトマップ、OGP、構造化データ。",
        href: "/ja/guide/media",
      },
    ],
    connect: [
      {
        key: "cursor",
        title: "Cursor",
        body: "MCP setup",
        href: "/ja/products/agents",
        logo: "/connect/cursor.svg",
      },
      {
        key: "claude",
        title: "Claude Code",
        body: "MCP setup",
        href: "/ja/products/agents",
        logo: "/connect/claude.svg",
      },
      {
        key: "codex",
        title: "Codex",
        body: "MCP setup",
        href: "/ja/products/agents",
        logo: "/connect/codex.svg",
      },
      {
        key: "nextjs",
        title: "Next.js",
        body: "Public API",
        href: "/ja/api/public-api#api-only",
        logo: "/connect/nextjs.svg",
      },
      {
        key: "widget",
        title: "Widget",
        body: "Embed / Pub",
        href: "/ja/products/embed",
        logo: "/connect/widget.svg",
      },
    ],
    refs: [
      { title: "API 概要", href: "/ja/api/overview" },
      { title: "公開 API", href: "/ja/api/public-api" },
      { title: "Webhook", href: "/ja/api/webhooks" },
      { title: "環境変数", href: "/ja/self-hosting/env-vars" },
      { title: "デプロイ", href: "/ja/self-hosting/deployment" },
    ],
    loginCta: "ログイン",
    loginHref: "https://console.luno.rest/login",
    signupCta: "アカウント作成",
    signupHref: "https://console.luno.rest/register",
    trust: [
      { title: "Changelog", href: "/ja/changelog", external: false },
      {
        title: "Status",
        href: "https://status.luno.rest",
        external: true,
      },
    ],
  },
  en: {
    pageTitle: "LUNO Documentation",
    pageLead:
      "AI-native content operations—entry points to define, create, review, publish, and deliver.",
    startTitle: "Get started",
    startLead: "Pick a path → see the done state → follow the steps.",
    productsTitle: "Products",
    productsLead: "Content operations surfaces in one platform.",
    connectTitle: "Connect",
    connectLead: "Pick a tool and jump to the right setup.",
    refTitle: "Reference",
    refLead: "Auth, endpoints, and ops configuration.",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    start: [
      {
        key: "mcp",
        badge: "A · Agents · ~5 min",
        title: "Start with MCP",
        body: "Run setup in your site repo. Operate from Cursor / Claude Code / Codex.",
        href: "/en/guide/paths/agents",
        cta: "See done state",
        command: "npx @luno-cms/mcp setup",
      },
      {
        key: "console",
        badge: "B · Console · ~10 min",
        title: "Start in Console",
        body: "From sign-in to first publish—approvals and scheduled publishing.",
        href: "/en/guide/paths/console",
        cta: "See done state",
        command: null,
      },
      {
        key: "api",
        badge: "C · API only · ~3 min",
        title: "Read via Public API",
        body: "Fetch entries, masters, and media with no auth (or a public key).",
        href: "/en/guide/paths/api",
        cta: "See done state",
        command: "curl https://api.luno.rest/public/p/{projectId}/v1/llms.txt",
      },
    ],
    products: [
      {
        title: "Content",
        body: "15 field types, revisions, review, scheduled publishing.",
        href: "/en/products/content",
      },
      {
        title: "Contact",
        body: "Inbox, autoreply, chat notify. Host on contact.luno.rest.",
        href: "/en/products/contact",
      },
      {
        title: "Embed & Pub",
        body: "widget / iframe and pub.luno.rest for drop-in delivery.",
        href: "/en/products/embed",
      },
      {
        title: "AI Agents",
        body: "MCP, agent keys, and per-site llms.txt.",
        href: "/en/products/agents",
      },
      {
        title: "Webhooks",
        body: "HMAC-signed publish events for ISR and integrations.",
        href: "/en/products/webhooks",
      },
      {
        title: "Media & SEO",
        body: "Asset delivery, sitemaps, OGP, structured data.",
        href: "/en/guide/media",
      },
    ],
    connect: [
      {
        key: "cursor",
        title: "Cursor",
        body: "MCP setup",
        href: "/en/products/agents",
        logo: "/connect/cursor.svg",
      },
      {
        key: "claude",
        title: "Claude Code",
        body: "MCP setup",
        href: "/en/products/agents",
        logo: "/connect/claude.svg",
      },
      {
        key: "codex",
        title: "Codex",
        body: "MCP setup",
        href: "/en/products/agents",
        logo: "/connect/codex.svg",
      },
      {
        key: "nextjs",
        title: "Next.js",
        body: "Public API",
        href: "/en/api/public-api#api-only",
        logo: "/connect/nextjs.svg",
      },
      {
        key: "widget",
        title: "Widget",
        body: "Embed / Pub",
        href: "/en/products/embed",
        logo: "/connect/widget.svg",
      },
    ],
    refs: [
      { title: "API overview", href: "/en/api/overview" },
      { title: "Public API", href: "/en/api/public-api" },
      { title: "Webhooks", href: "/en/api/webhooks" },
      { title: "Environment variables", href: "/en/self-hosting/env-vars" },
      { title: "Deployment", href: "/en/self-hosting/deployment" },
    ],
    loginCta: "Log in",
    loginHref: "https://console.luno.rest/login",
    signupCta: "Sign up",
    signupHref: "https://console.luno.rest/register",
    trust: [
      { title: "Changelog", href: "/en/changelog", external: false },
      {
        title: "Status",
        href: "https://status.luno.rest",
        external: true,
      },
    ],
  },
} as const;
</script>

<template>
  <div class="hub" :data-locale="props.locale">
    <header class="hub-intro">
      <div class="hub-intro__top">
        <p class="hub-kicker">LUNO</p>
        <nav class="hub-trust" aria-label="Changelog and status">
          <a
            v-for="item in copy[locale].trust"
            :key="item.href"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener' : undefined"
          >
            {{ item.title
            }}<span v-if="item.external" class="hub-trust__ext">↗</span>
          </a>
        </nav>
      </div>
      <h1>{{ copy[locale].pageTitle }}</h1>
      <p class="hub-intro__lead">{{ copy[locale].pageLead }}</p>
    </header>

    <section class="hub-section">
      <header class="hub-section__head">
        <h2>{{ copy[locale].startTitle }}</h2>
        <p>{{ copy[locale].startLead }}</p>
      </header>
      <div class="hub-grid hub-grid--start">
        <a
          v-for="item in copy[locale].start"
          :key="item.key"
          class="hub-card hub-card--start"
          :href="item.href"
        >
          <span class="hub-badge">{{ item.badge }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
          <div v-if="item.command" class="hub-cmd">
            <code>{{ item.command }}</code>
            <button
              type="button"
              class="hub-cmd__btn"
              @click="copyCommand(item.command!, item.key, $event)"
            >
              {{
                copiedKey === item.key
                  ? copy[locale].copiedLabel
                  : copy[locale].copyLabel
              }}
            </button>
          </div>
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
          :key="item.key"
          class="hub-card hub-card--connect"
          :href="item.href"
        >
          <span class="hub-connect__logo" aria-hidden="true">
            <img :src="item.logo" :alt="''" width="28" height="28" />
          </span>
          <h3>{{ item.title }}</h3>
          <span class="hub-connect__meta">{{ item.body }}</span>
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
        <a class="hub-btn hub-btn--primary" :href="copy[locale].signupHref">
          {{ copy[locale].signupCta }}
        </a>
        <a class="hub-btn hub-btn--ghost" :href="copy[locale].loginHref">
          {{ copy[locale].loginCta }}
        </a>
      </div>
    </section>
  </div>
</template>
