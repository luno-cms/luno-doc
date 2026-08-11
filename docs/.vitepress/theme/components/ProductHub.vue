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
    productsLead:
      "名前のついた製品面と、その下のプラットフォーム能力。",
    frameworksTitle: "フレームワークをつなぐ",
    frameworksLead:
      "フレームワーク別レシピで、公開 API・埋め込み・再検証までの接続を確認。",
    agentsTitle: "AI ツールとエージェント",
    agentsLead:
      "LUNO は MCP で AI コーディングツールと連携します。エディタを選んでセットアップへ。",
    refTitle: "リファレンス",
    refLead: "認証・エンドポイント・運用設定。",
    copyLabel: "コピー",
    copiedLabel: "コピー済み",
    start: [
      {
        key: "mcp",
        badgeLabel: "AGENTS",
        badgeTime: "~5 MIN",
        marker: "hot",
        title: "MCP で始める",
        body: "サイトリポジトリで setup。Cursor / Claude Code / Codex から操作。",
        href: "/ja/guide/paths/agents",
        cta: "完成形を見る",
        command: "npx @luno-cms/mcp setup",
      },
      {
        key: "console",
        badgeLabel: "CONSOLE",
        badgeTime: "~10 MIN",
        marker: "hot",
        title: "管理画面で始める",
        body: "ログインから最初の公開まで。承認とスケジュール公開の入口。",
        href: "/ja/guide/paths/console",
        cta: "完成形を見る",
        command: null,
      },
      {
        key: "api",
        badgeLabel: "API",
        badgeTime: "~3 MIN",
        marker: "cool",
        title: "公開 API で読む",
        body: "認証不要（または公開キー）でエントリ・マスタ・メディアを取得。",
        href: "/ja/guide/paths/api",
        cta: "完成形を見る",
        command: "curl https://api.luno.rest/public/p/{projectId}/v1/llms.txt",
      },
    ],
    productGroups: [
      {
        key: "products",
        title: "プロダクト",
        lead: "名前のついた製品面（Console のメイン作業に対応）。",
        tone: "accent",
        items: [
          {
            icon: "content",
            title: "Content",
            body: "15 種フィールド、リビジョン、レビュー、スケジュール公開。",
            href: "/ja/products/content",
          },
          {
            icon: "contact",
            title: "Contact",
            body: "受信・自動返信・チャット通知。contact.luno.rest ホスト。",
            href: "/ja/products/contact",
          },
          {
            icon: "embed",
            title: "Embed & Pub",
            body: "widget / iframe と pub.luno.rest でそのまま配信。",
            href: "/ja/products/embed",
          },
          {
            icon: "agents",
            title: "AI Agents",
            body: "MCP、エージェントキー、サイトごとの llms.txt。",
            href: "/ja/products/agents",
          },
          {
            icon: "masters",
            title: "Masters",
            body: "共通選択肢をサイト公開し、公開 API から読む。",
            href: "/ja/products/masters",
          },
        ],
      },
      {
        key: "platform",
        title: "プラットフォーム",
        lead: "横断の連携・配信基盤・サイト設定。",
        tone: "muted",
        items: [
          {
            icon: "webhooks",
            title: "Webhooks",
            body: "HMAC 署名付き公開イベント。ISR・外部連携向け。",
            href: "/ja/products/webhooks",
          },
          {
            icon: "keys",
            title: "公開 API キー",
            body: "luno_pub_…。Embed / Host 解決。エージェントキーとは別。",
            href: "/ja/products/public-api-keys",
          },
          {
            icon: "localization",
            title: "多言語",
            body: "サイトロケール、?locale=、AI 翻訳（Standard+）。",
            href: "/ja/products/localization",
          },
          {
            icon: "media",
            title: "Media & SEO",
            body: "アセット配信、サイトマップ、OGP、構造化データ。",
            href: "/ja/guide/media",
          },
          {
            icon: "plans",
            title: "プラン",
            body: "Standard / Business の機能境界早見表。",
            href: "/ja/products/plans",
          },
        ],
      },
    ],
    frameworks: [
      {
        key: "nextjs",
        title: "Next.js",
        href: "/ja/guide/frameworks/nextjs",
        logo: "/connect/nextjs.svg",
      },
      {
        key: "astro",
        title: "Astro",
        href: "/ja/guide/frameworks/astro",
        logo: "/connect/astro.svg",
      },
      {
        key: "nuxt",
        title: "Nuxt",
        href: "/ja/guide/frameworks/nuxt",
        logo: "/connect/nuxt.svg",
      },
    ],
    agents: [
      {
        key: "cursor",
        title: "Cursor",
        body: "Cursor に LUNO を接続",
        href: "/ja/products/agents",
        logo: "/connect/cursor.svg",
      },
      {
        key: "claude-code",
        title: "Claude Code",
        body: "Claude Code に LUNO を接続",
        href: "/ja/products/agents",
        logo: "/connect/claude-code.svg",
      },
      {
        key: "claude",
        title: "Claude",
        body: "Claude に LUNO を接続",
        href: "/ja/products/agents",
        logo: "/connect/claude.svg",
      },
      {
        key: "codex",
        title: "Codex",
        body: "Codex に LUNO を接続",
        href: "/ja/products/agents",
        logo: "/connect/codex.svg",
      },
      {
        key: "copilot",
        title: "GitHub Copilot",
        body: "Copilot に LUNO を接続",
        href: "/ja/products/agents",
        logo: "/connect/copilot.svg",
      },
      {
        key: "github",
        title: "GitHub",
        body: "GitHub からエージェント連携",
        href: "/ja/products/agents",
        logo: "/connect/github.svg",
      },
      {
        key: "openai",
        title: "OpenAI",
        body: "OpenAI ツールから接続",
        href: "/ja/products/agents",
        logo: "/connect/openai.svg",
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
    productsLead:
      "Named product surfaces for content ops—plus platform capabilities underneath.",
    frameworksTitle: "Connect your framework",
    frameworksLead:
      "Browse framework recipes for Public API, embed, and revalidation.",
    agentsTitle: "AI tools and agents",
    agentsLead:
      "LUNO integrates with AI coding tools through MCP. Pick your editor for setup.",
    refTitle: "Reference",
    refLead: "Auth, endpoints, and ops configuration.",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    start: [
      {
        key: "mcp",
        badgeLabel: "AGENTS",
        badgeTime: "~5 MIN",
        marker: "hot",
        title: "Start with MCP",
        body: "Run setup in your site repo. Operate from Cursor / Claude Code / Codex.",
        href: "/en/guide/paths/agents",
        cta: "See done state",
        command: "npx @luno-cms/mcp setup",
      },
      {
        key: "console",
        badgeLabel: "CONSOLE",
        badgeTime: "~10 MIN",
        marker: "hot",
        title: "Start in Console",
        body: "From sign-in to first publish—approvals and scheduled publishing.",
        href: "/en/guide/paths/console",
        cta: "See done state",
        command: null,
      },
      {
        key: "api",
        badgeLabel: "API",
        badgeTime: "~3 MIN",
        marker: "cool",
        title: "Read via Public API",
        body: "Fetch entries, masters, and media with no auth (or a public key).",
        href: "/en/guide/paths/api",
        cta: "See done state",
        command: "curl https://api.luno.rest/public/p/{projectId}/v1/llms.txt",
      },
    ],
    productGroups: [
      {
        key: "products",
        title: "Products",
        lead: "Named product surfaces that map to day-to-day Console work.",
        tone: "accent",
        items: [
          {
            icon: "content",
            title: "Content",
            body: "15 field types, revisions, review, scheduled publishing.",
            href: "/en/products/content",
          },
          {
            icon: "contact",
            title: "Contact",
            body: "Inbox, autoreply, chat notify. Host on contact.luno.rest.",
            href: "/en/products/contact",
          },
          {
            icon: "embed",
            title: "Embed & Pub",
            body: "widget / iframe and pub.luno.rest for drop-in delivery.",
            href: "/en/products/embed",
          },
          {
            icon: "agents",
            title: "AI Agents",
            body: "MCP, agent keys, and per-site llms.txt.",
            href: "/en/products/agents",
          },
          {
            icon: "masters",
            title: "Masters",
            body: "Shared options published to site and Public API.",
            href: "/en/products/masters",
          },
        ],
      },
      {
        key: "platform",
        title: "Platform",
        lead: "Cross-cutting delivery, keys, locales, and plan gates.",
        tone: "muted",
        items: [
          {
            icon: "webhooks",
            title: "Webhooks",
            body: "HMAC-signed publish events for ISR and integrations.",
            href: "/en/products/webhooks",
          },
          {
            icon: "keys",
            title: "Public API keys",
            body: "luno_pub_… for Embed / Host. Not agent keys.",
            href: "/en/products/public-api-keys",
          },
          {
            icon: "localization",
            title: "Localization",
            body: "Site locales, ?locale=, AI translation (Standard+).",
            href: "/en/products/localization",
          },
          {
            icon: "media",
            title: "Media & SEO",
            body: "Asset delivery, sitemaps, OGP, structured data.",
            href: "/en/guide/media",
          },
          {
            icon: "plans",
            title: "Plans",
            body: "Standard / Business feature gate matrix.",
            href: "/en/products/plans",
          },
        ],
      },
    ],
    frameworks: [
      {
        key: "nextjs",
        title: "Next.js",
        href: "/en/guide/frameworks/nextjs",
        logo: "/connect/nextjs.svg",
      },
      {
        key: "astro",
        title: "Astro",
        href: "/en/guide/frameworks/astro",
        logo: "/connect/astro.svg",
      },
      {
        key: "nuxt",
        title: "Nuxt",
        href: "/en/guide/frameworks/nuxt",
        logo: "/connect/nuxt.svg",
      },
    ],
    agents: [
      {
        key: "cursor",
        title: "Cursor",
        body: "Connect LUNO to Cursor",
        href: "/en/products/agents",
        logo: "/connect/cursor.svg",
      },
      {
        key: "claude-code",
        title: "Claude Code",
        body: "Connect LUNO to Claude Code",
        href: "/en/products/agents",
        logo: "/connect/claude-code.svg",
      },
      {
        key: "claude",
        title: "Claude",
        body: "Connect LUNO to Claude",
        href: "/en/products/agents",
        logo: "/connect/claude.svg",
      },
      {
        key: "codex",
        title: "Codex",
        body: "Connect LUNO to Codex",
        href: "/en/products/agents",
        logo: "/connect/codex.svg",
      },
      {
        key: "copilot",
        title: "GitHub Copilot",
        body: "Connect LUNO to Copilot",
        href: "/en/products/agents",
        logo: "/connect/copilot.svg",
      },
      {
        key: "github",
        title: "GitHub",
        body: "Agent workflows from GitHub",
        href: "/en/products/agents",
        logo: "/connect/github.svg",
      },
      {
        key: "openai",
        title: "OpenAI",
        body: "Connect from OpenAI tools",
        href: "/en/products/agents",
        logo: "/connect/openai.svg",
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
            <span
              class="hub-badge"
              :class="
                item.marker === 'cool' ? 'hub-badge--cool' : 'hub-badge--hot'
              "
            >
              <span class="hub-badge__mark" aria-hidden="true" />
              <span class="hub-badge__label">{{ item.badgeLabel }}</span>
              <span class="hub-badge__time">{{ item.badgeTime }}</span>
            </span>
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
      <div
        v-for="group in copy[locale].productGroups"
        :key="group.key"
        class="hub-product-group"
        :data-tone="group.tone"
      >
        <header class="hub-product-group__head">
          <h3>{{ group.title }}</h3>
          <p>{{ group.lead }}</p>
        </header>
        <div class="hub-grid hub-grid--products">
          <a
            v-for="item in group.items"
            :key="item.href"
            class="hub-card hub-card--product"
            :class="
              group.tone === 'accent'
                ? 'hub-card--tone-accent'
                : 'hub-card--tone-muted'
            "
            :href="item.href"
          >
            <span
              class="hub-icon-wrap"
              :class="
                group.tone === 'accent'
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
      </div>
    </section>

    <section class="hub-section">
      <header class="hub-section__head">
        <h2>{{ copy[locale].frameworksTitle }}</h2>
        <p>{{ copy[locale].frameworksLead }}</p>
      </header>
      <div class="hub-link-grid hub-link-grid--frameworks">
        <a
          v-for="item in copy[locale].frameworks"
          :key="item.key"
          class="hub-link-item"
          :href="item.href"
        >
          <img
            class="hub-link-item__icon"
            :src="item.logo"
            alt=""
            width="28"
            height="28"
          />
          <span class="hub-link-item__name">{{ item.title }}</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <header class="hub-section__head">
        <h2>{{ copy[locale].agentsTitle }}</h2>
        <p>{{ copy[locale].agentsLead }}</p>
      </header>
      <div class="hub-link-grid hub-link-grid--agents">
        <a
          v-for="item in copy[locale].agents"
          :key="item.key"
          class="hub-link-item hub-link-item--agent"
          :href="item.href"
        >
          <span class="hub-link-item__mark" aria-hidden="true">
            <img :src="item.logo" alt="" width="28" height="28" />
          </span>
          <span class="hub-link-item__text">
            <span class="hub-link-item__name">{{ item.title }}</span>
            <span class="hub-link-item__meta">{{ item.body }}</span>
          </span>
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
