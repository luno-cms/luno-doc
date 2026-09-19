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
    pageLeads: [
      "人はバックエンドを REGISTER / GOVERN する。エージェントは BUILD / OPERATE する。アプリは CONSUME する。全員が同じ正本で動く。",
      "LUNO はホスト型の AI-era Backend Platform です — 人間用 CMS でもエージェント用 CMS でもない。",
      "Publish は backend state。Ship はフロントエンドのリリース。Connected ≠ activated。",
    ],
    architectureTitle: "Four operators",
    architectureLead:
      "同じバックエンド。権限は異なる。Headless CMS は下の capability として残す。",
    architecture: [
      {
        axis: "BUILD / OPERATE",
        body: "Agent — スキーマ、フォーム、エントリ、MCP で backend state を公開。",
        href: "/ja/guide/paths/agents",
      },
      {
        axis: "REGISTER / GOVERN",
        body: "Human — サイト作成、接続確認、キー、承認、監査。",
        href: "/ja/guide/paths/console",
      },
      {
        axis: "CONSUME",
        body: "Application — 公開 API / embed。公開コンテンツは認証不要。",
        href: "/ja/guide/paths/api",
      },
    ],
    startTitle: "スタート",
    startLead: "経路を選ぶ → 完成形を確認 → 手順へ。",
    spine: [
      { label: "Discover", href: "/ja/guide/getting-started" },
      { label: "Connect", href: "/ja/guide/paths/agents" },
      { label: "Build", href: "/ja/api/ai-agents#agent-lifecycle" },
      { label: "Operate", href: "/ja/api/ai-agents#agent-lifecycle" },
      { label: "Verify", href: "/ja/guide/paths/agents" },
      { label: "Govern", href: "/ja/guide/production-safety" },
    ],
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
        title: "BUILD / OPERATE",
        body: "人がテナントを REGISTER したあと、エージェントが MCP で BUILD / OPERATE する。",
        href: "/ja/guide/paths/agents",
        cta: "完成形を見る",
        command: "npx -y @luno-cms/mcp setup",
      },
      {
        key: "console",
        badgeLabel: "CONSOLE",
        badgeTime: "~10 MIN",
        marker: "hot",
        title: "REGISTER / GOVERN",
        body: "人がテナントを作成し、エージェントに何を許すかを GOVERN する。",
        href: "/ja/guide/paths/console",
        cta: "完成形を見る",
        command: null,
      },
      {
        key: "api",
        badgeLabel: "API",
        badgeTime: "~3 MIN",
        marker: "cool",
        title: "CONSUME",
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
            title: "Headless CMS",
            body: "15 種フィールド、リビジョン、レビュー、スケジュール公開。",
            href: "/ja/products/content",
          },
          {
            icon: "contact",
            title: "Contact Form",
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
        logoDark: "/connect/astro-dark.svg",
      },
      {
        key: "nuxt",
        title: "Nuxt",
        href: "/ja/guide/frameworks/nuxt",
        logo: "/connect/nuxt.svg",
        logoDark: "/connect/nuxt-white.svg",
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
        logoDark: "/connect/claude-code.svg",
      },
      {
        key: "claude",
        title: "Claude",
        body: "Claude に LUNO を接続",
        href: "/ja/products/agents",
        logo: "/connect/claude.svg",
        logoDark: "/connect/claude.svg",
      },
      {
        key: "codex",
        title: "Codex",
        body: "Codex に LUNO を接続",
        href: "/ja/products/agents",
        logo: "/connect/codex-color.png",
        logoDark: "/connect/codex-color.png",
      },
      {
        key: "copilot",
        title: "GitHub Copilot",
        body: "Copilot に LUNO を接続",
        href: "/ja/products/agents",
        logo: "/connect/copilot.svg",
        logoDark: "/connect/copilot-white.svg",
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
        logoDark: "/connect/openai-white.svg",
      },
    ],
    refs: [
      { title: "API 概要", href: "/ja/api/overview" },
      { title: "Production Safety", href: "/ja/guide/production-safety" },
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
  },
  en: {
    pageTitle: "LUNO Documentation",
    pageLeads: [
      "Humans govern the backend. Agents build and operate it. Applications consume it. Everyone works from the same system of record.",
      "LUNO is a hosted AI-era Backend Platform — not a CMS for humans and not a CMS for agents.",
      "Publish is backend state. Ship is frontend release. Connected is not activated.",
    ],
    architectureTitle: "Four operators",
    architectureLead:
      "Same backend. Different authority. Headless CMS stays below as a capability.",
    architecture: [
      {
        axis: "BUILD / OPERATE",
        body: "Agent — schema, forms, entries, publish backend state via MCP.",
        href: "/en/guide/paths/agents",
      },
      {
        axis: "REGISTER / GOVERN",
        body: "Human — create the site, confirm the connection, keys, approval, audit.",
        href: "/en/guide/paths/console",
      },
      {
        axis: "CONSUME",
        body: "Application — public API / embed. Published content needs no auth.",
        href: "/en/guide/paths/api",
      },
    ],
    startTitle: "Get started",
    startLead: "Pick a path → see the done state → follow the steps.",
    spine: [
      { label: "Discover", href: "/en/guide/getting-started" },
      { label: "Connect", href: "/en/guide/paths/agents" },
      { label: "Build", href: "/en/api/ai-agents#agent-lifecycle" },
      { label: "Operate", href: "/en/api/ai-agents#agent-lifecycle" },
      { label: "Verify", href: "/en/guide/paths/agents" },
      { label: "Govern", href: "/en/guide/production-safety" },
    ],
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
        title: "BUILD / OPERATE",
        body: "After the human registers the tenant, the agent builds and operates the backend via MCP.",
        href: "/en/guide/paths/agents",
        cta: "See done state",
        command: "npx -y @luno-cms/mcp setup",
      },
      {
        key: "console",
        badgeLabel: "CONSOLE",
        badgeTime: "~10 MIN",
        marker: "hot",
        title: "REGISTER / GOVERN",
        body: "Human creates the tenant and governs what the agent may do.",
        href: "/en/guide/paths/console",
        cta: "See done state",
        command: null,
      },
      {
        key: "api",
        badgeLabel: "API",
        badgeTime: "~3 MIN",
        marker: "cool",
        title: "CONSUME",
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
            title: "Headless CMS",
            body: "15 field types, revisions, review, scheduled publishing.",
            href: "/en/products/content",
          },
          {
            icon: "contact",
            title: "Contact Form",
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
        logoDark: "/connect/astro-dark.svg",
      },
      {
        key: "nuxt",
        title: "Nuxt",
        href: "/en/guide/frameworks/nuxt",
        logo: "/connect/nuxt.svg",
        logoDark: "/connect/nuxt-white.svg",
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
        logoDark: "/connect/claude-code.svg",
      },
      {
        key: "claude",
        title: "Claude",
        body: "Connect LUNO to Claude",
        href: "/en/products/agents",
        logo: "/connect/claude.svg",
        logoDark: "/connect/claude.svg",
      },
      {
        key: "codex",
        title: "Codex",
        body: "Connect LUNO to Codex",
        href: "/en/products/agents",
        logo: "/connect/codex-color.png",
        logoDark: "/connect/codex-color.png",
      },
      {
        key: "copilot",
        title: "GitHub Copilot",
        body: "Connect LUNO to Copilot",
        href: "/en/products/agents",
        logo: "/connect/copilot.svg",
        logoDark: "/connect/copilot-white.svg",
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
        logoDark: "/connect/openai-white.svg",
      },
    ],
    refs: [
      { title: "API overview", href: "/en/api/overview" },
      { title: "Production Safety", href: "/en/guide/production-safety" },
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
  },
} as const;
</script>

<template>
  <div class="hub" :data-locale="props.locale">
    <header class="hub-intro">
      <h1>{{ copy[locale].pageTitle }}</h1>
      <p
        v-for="(lead, i) in copy[locale].pageLeads"
        :key="i"
        class="hub-intro__lead"
      >
        {{ lead }}
      </p>
    </header>

    <section class="hub-section">
      <header class="hub-section__head">
        <h2>{{ copy[locale].startTitle }}</h2>
        <p>{{ copy[locale].startLead }}</p>
      </header>
      <nav class="hub-spine" aria-label="Discover to Govern">
        <ol class="hub-spine__list">
          <li
            v-for="item in copy[locale].spine"
            :key="item.label"
            class="hub-spine__item"
          >
            <a class="hub-spine__step" :href="item.href">{{ item.label }}</a>
          </li>
        </ol>
      </nav>
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

    <section class="hub-section" id="agent-backend">
      <header class="hub-section__head">
        <h2>{{ copy[locale].architectureTitle }}</h2>
        <p>{{ copy[locale].architectureLead }}</p>
      </header>
      <div class="hub-arch">
        <a
          v-for="item in copy[locale].architecture"
          :key="item.axis"
          class="hub-arch__item"
          :href="item.href"
        >
          <span class="hub-arch__axis">{{ item.axis }}</span>
          <span class="hub-arch__body">{{ item.body }}</span>
        </a>
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
          <span class="hub-link-item__mark" aria-hidden="true">
            <img
              class="hub-link-item__icon hub-link-item__icon--light"
              :src="item.logo"
              alt=""
              width="28"
              height="28"
            />
            <img
              class="hub-link-item__icon hub-link-item__icon--dark"
              :class="{
                'hub-link-item__icon--native-dark': Boolean(item.logoDark),
              }"
              :src="item.logoDark || item.logo"
              alt=""
              width="28"
              height="28"
            />
          </span>
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
            <img
              class="hub-link-item__icon hub-link-item__icon--light"
              :src="item.logo"
              alt=""
              width="28"
              height="28"
            />
            <img
              class="hub-link-item__icon hub-link-item__icon--dark"
              :class="{
                'hub-link-item__icon--native-dark': Boolean(item.logoDark),
              }"
              :src="item.logoDark || item.logo"
              alt=""
              width="28"
              height="28"
            />
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

<style>
/* Spine strip — local to ProductHub; hub.css stays untouched. */
.hub-spine {
  margin-top: 16px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.hub-spine__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hub-spine__item {
  display: inline-flex;
  align-items: center;
}

.hub-spine__item:not(:last-child)::after {
  content: "·";
  margin: 0 0.55rem;
  color: var(--vp-c-text-3);
  font-weight: 700;
}

.hub-spine__step {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  color: var(--vp-c-brand-1);
}

.hub-spine__step:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}
</style>
