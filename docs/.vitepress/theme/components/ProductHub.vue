<script setup lang="ts">
import { ref } from "vue";
import HubIcon from "./HubIcon.vue";

const props = defineProps<{
  locale: "ja" | "en";
}>();

const copiedKey = ref<string | null>(null);

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for restricted clipboard permissions
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

async function copyCommand(command: string, key: string) {
  const ok = await writeClipboard(command);
  if (!ok) return;
  copiedKey.value = key;
  window.setTimeout(() => {
    if (copiedKey.value === key) copiedKey.value = null;
  }, 1600);
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
        icon: "agents",
        badge: "A · Agents · ~5 min",
        title: "MCP で始める",
        body: "サイトリポジトリで setup。Cursor / Claude Code / Codex から操作。",
        href: "/ja/guide/paths/agents",
        cta: "完成形を見る",
        command: "npx @luno-cms/mcp setup",
      },
      {
        key: "console",
        icon: "console",
        badge: "B · Console · ~10 min",
        title: "管理画面で始める",
        body: "ログインから最初の公開まで。承認とスケジュール公開の入口。",
        href: "/ja/guide/paths/console",
        cta: "完成形を見る",
        command: null,
      },
      {
        key: "api",
        icon: "api",
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
        icon: "content",
        tone: "accent",
        title: "Content",
        body: "15 種フィールド、リビジョン、レビュー、スケジュール公開。",
        href: "/ja/products/content",
      },
      {
        icon: "contact",
        tone: "accent",
        title: "Contact",
        body: "受信・自動返信・チャット通知。contact.luno.rest ホスト。",
        href: "/ja/products/contact",
      },
      {
        icon: "embed",
        tone: "accent",
        title: "Embed & Pub",
        body: "widget / iframe と pub.luno.rest でそのまま配信。",
        href: "/ja/products/embed",
      },
      {
        icon: "agents",
        tone: "accent",
        title: "AI Agents",
        body: "MCP、エージェントキー、サイトごとの llms.txt。",
        href: "/ja/products/agents",
      },
      {
        icon: "webhooks",
        tone: "accent",
        title: "Webhooks",
        body: "HMAC 署名付き公開イベント。ISR・外部連携向け。",
        href: "/ja/products/webhooks",
      },
      {
        icon: "masters",
        tone: "accent",
        title: "Masters",
        body: "共通選択肢をサイト公開し、公開 API から読む。",
        href: "/ja/products/masters",
      },
      {
        icon: "keys",
        tone: "muted",
        title: "公開 API キー",
        body: "luno_pub_…。Embed / Host 解決。エージェントキーとは別。",
        href: "/ja/products/public-api-keys",
      },
      {
        icon: "localization",
        tone: "muted",
        title: "多言語",
        body: "サイトロケール、?locale=、AI 翻訳（Standard+）。",
        href: "/ja/products/localization",
      },
      {
        icon: "plans",
        tone: "muted",
        title: "プラン",
        body: "Standard / Business の機能境界早見表。",
        href: "/ja/products/plans",
      },
      {
        icon: "media",
        tone: "muted",
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
        body: "Framework recipe",
        href: "/ja/guide/frameworks/nextjs",
        logo: "/connect/nextjs.svg",
      },
      {
        key: "astro",
        title: "Astro",
        body: "Framework recipe",
        href: "/ja/guide/frameworks/astro",
        logo: "/connect/astro.svg",
      },
      {
        key: "nuxt",
        title: "Nuxt",
        body: "Framework recipe",
        href: "/ja/guide/frameworks/nuxt",
        logo: "/connect/nuxt.svg",
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
      { title: "フレームワーク", href: "/ja/guide/frameworks/" },
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
        icon: "agents",
        badge: "A · Agents · ~5 min",
        title: "Start with MCP",
        body: "Run setup in your site repo. Operate from Cursor / Claude Code / Codex.",
        href: "/en/guide/paths/agents",
        cta: "See done state",
        command: "npx @luno-cms/mcp setup",
      },
      {
        key: "console",
        icon: "console",
        badge: "B · Console · ~10 min",
        title: "Start in Console",
        body: "From sign-in to first publish—approvals and scheduled publishing.",
        href: "/en/guide/paths/console",
        cta: "See done state",
        command: null,
      },
      {
        key: "api",
        icon: "api",
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
        icon: "content",
        tone: "accent",
        title: "Content",
        body: "15 field types, revisions, review, scheduled publishing.",
        href: "/en/products/content",
      },
      {
        icon: "contact",
        tone: "accent",
        title: "Contact",
        body: "Inbox, autoreply, chat notify. Host on contact.luno.rest.",
        href: "/en/products/contact",
      },
      {
        icon: "embed",
        tone: "accent",
        title: "Embed & Pub",
        body: "widget / iframe and pub.luno.rest for drop-in delivery.",
        href: "/en/products/embed",
      },
      {
        icon: "agents",
        tone: "accent",
        title: "AI Agents",
        body: "MCP, agent keys, and per-site llms.txt.",
        href: "/en/products/agents",
      },
      {
        icon: "webhooks",
        tone: "accent",
        title: "Webhooks",
        body: "HMAC-signed publish events for ISR and integrations.",
        href: "/en/products/webhooks",
      },
      {
        icon: "masters",
        tone: "accent",
        title: "Masters",
        body: "Shared options published to site and Public API.",
        href: "/en/products/masters",
      },
      {
        icon: "keys",
        tone: "muted",
        title: "Public API keys",
        body: "luno_pub_… for Embed / Host. Not agent keys.",
        href: "/en/products/public-api-keys",
      },
      {
        icon: "localization",
        tone: "muted",
        title: "Localization",
        body: "Site locales, ?locale=, AI translation (Standard+).",
        href: "/en/products/localization",
      },
      {
        icon: "plans",
        tone: "muted",
        title: "Plans",
        body: "Standard / Business feature gate matrix.",
        href: "/en/products/plans",
      },
      {
        icon: "media",
        tone: "muted",
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
        body: "Framework recipe",
        href: "/en/guide/frameworks/nextjs",
        logo: "/connect/nextjs.svg",
      },
      {
        key: "astro",
        title: "Astro",
        body: "Framework recipe",
        href: "/en/guide/frameworks/astro",
        logo: "/connect/astro.svg",
      },
      {
        key: "nuxt",
        title: "Nuxt",
        body: "Framework recipe",
        href: "/en/guide/frameworks/nuxt",
        logo: "/connect/nuxt.svg",
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
      { title: "Frameworks", href: "/en/guide/frameworks/" },
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
        <div
          v-for="item in copy[locale].start"
          :key="item.key"
          class="hub-card hub-card--start"
        >
          <a class="hub-card__main" :href="item.href">
            <div class="hub-card__topline">
              <span class="hub-icon-wrap hub-icon-wrap--start" aria-hidden="true">
                <HubIcon :name="item.icon" />
              </span>
              <span class="hub-badge">{{ item.badge }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </a>
          <div v-if="item.command" class="hub-cmd">
            <code>{{ item.command }}</code>
            <button
              type="button"
              class="hub-cmd__btn"
              :aria-label="copy[locale].copyLabel"
              @click="copyCommand(item.command!, item.key)"
            >
              {{
                copiedKey === item.key
                  ? copy[locale].copiedLabel
                  : copy[locale].copyLabel
              }}
            </button>
          </div>
          <a class="hub-card__cta" :href="item.href">{{ item.cta }} →</a>
        </div>
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
          class="hub-card hub-card--product"
          :class="
            item.tone === 'accent'
              ? 'hub-card--tone-accent'
              : 'hub-card--tone-muted'
          "
          :href="item.href"
        >
          <span
            class="hub-icon-wrap"
            :class="
              item.tone === 'accent'
                ? 'hub-icon-wrap--accent'
                : 'hub-icon-wrap--muted'
            "
            aria-hidden="true"
          >
            <HubIcon :name="item.icon" />
          </span>
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
