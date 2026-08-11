import { defineConfig } from "vitepress";

/**
 * Sidebar order drives VitePress prev/next.
 * Journey: Start → Product overviews → Deep guides → API → Ops
 */
const jaSidebar = [
  {
    text: "スタート",
    items: [
      { text: "製品ハブ", link: "/ja/" },
      { text: "クイックスタート（3経路）", link: "/ja/guide/getting-started" },
      {
        text: "完成形",
        collapsed: true,
        items: [
          { text: "A · Agents（MCP）", link: "/ja/guide/paths/agents" },
          { text: "B · Console", link: "/ja/guide/paths/console" },
          { text: "C · API only", link: "/ja/guide/paths/api" },
        ],
      },
      { text: "Changelog", link: "/ja/changelog" },
    ],
  },
  {
    text: "プロダクト",
    items: [
      { text: "Content", link: "/ja/products/content" },
      { text: "Contact", link: "/ja/products/contact" },
      { text: "Embed & Pub", link: "/ja/products/embed" },
      { text: "AI Agents", link: "/ja/products/agents" },
      { text: "Webhooks", link: "/ja/products/webhooks" },
      { text: "Masters", link: "/ja/products/masters" },
      { text: "公開 API キー", link: "/ja/products/public-api-keys" },
      { text: "多言語", link: "/ja/products/localization" },
      { text: "プラン", link: "/ja/products/plans" },
    ],
  },
  {
    text: "フレームワーク",
    collapsed: true,
    items: [
      { text: "概要", link: "/ja/guide/frameworks/" },
      { text: "Next.js", link: "/ja/guide/frameworks/nextjs" },
      { text: "Astro", link: "/ja/guide/frameworks/astro" },
      { text: "Nuxt", link: "/ja/guide/frameworks/nuxt" },
    ],
  },
  {
    text: "ガイド",
    items: [
      { text: "コンテンツ管理", link: "/ja/guide/content-management" },
      { text: "フォームビルダー", link: "/ja/guide/form-builder" },
      { text: "メディア", link: "/ja/guide/media" },
      { text: "コンタクト実装", link: "/ja/guide/contact-forms" },
      { text: "埋め込み実装", link: "/ja/guide/embed" },
      { text: "スケジュール公開", link: "/ja/guide/schedule" },
      { text: "SEO・サイトマップ", link: "/ja/guide/seo" },
      { text: "AI アシスト", link: "/ja/guide/ai-assist" },
    ],
  },
  {
    text: "API",
    items: [
      { text: "概要", link: "/ja/api/overview" },
      { text: "公開 API", link: "/ja/api/public-api" },
      { text: "Webhook", link: "/ja/api/webhooks" },
      { text: "AI エージェント向け", link: "/ja/api/ai-agents" },
    ],
  },
  {
    text: "運用",
    items: [
      { text: "セルフホスト概要", link: "/ja/self-hosting/" },
      { text: "環境変数", link: "/ja/self-hosting/env-vars" },
      { text: "デプロイ", link: "/ja/self-hosting/deployment" },
    ],
  },
];

const enSidebar = [
  {
    text: "Start",
    items: [
      { text: "Product hub", link: "/en/" },
      { text: "Quick start (3 paths)", link: "/en/guide/getting-started" },
      {
        text: "Done states",
        collapsed: true,
        items: [
          { text: "A · Agents (MCP)", link: "/en/guide/paths/agents" },
          { text: "B · Console", link: "/en/guide/paths/console" },
          { text: "C · API only", link: "/en/guide/paths/api" },
        ],
      },
      { text: "Changelog", link: "/en/changelog" },
    ],
  },
  {
    text: "Products",
    items: [
      { text: "Content", link: "/en/products/content" },
      { text: "Contact", link: "/en/products/contact" },
      { text: "Embed & Pub", link: "/en/products/embed" },
      { text: "AI Agents", link: "/en/products/agents" },
      { text: "Webhooks", link: "/en/products/webhooks" },
      { text: "Masters", link: "/en/products/masters" },
      { text: "Public API keys", link: "/en/products/public-api-keys" },
      { text: "Localization", link: "/en/products/localization" },
      { text: "Plans", link: "/en/products/plans" },
    ],
  },
  {
    text: "Frameworks",
    collapsed: true,
    items: [
      { text: "Overview", link: "/en/guide/frameworks/" },
      { text: "Next.js", link: "/en/guide/frameworks/nextjs" },
      { text: "Astro", link: "/en/guide/frameworks/astro" },
      { text: "Nuxt", link: "/en/guide/frameworks/nuxt" },
    ],
  },
  {
    text: "Guides",
    items: [
      { text: "Content management", link: "/en/guide/content-management" },
      { text: "Form builder", link: "/en/guide/form-builder" },
      { text: "Media", link: "/en/guide/media" },
      { text: "Contact implementation", link: "/en/guide/contact-forms" },
      { text: "Embed implementation", link: "/en/guide/embed" },
      { text: "Scheduled publishing", link: "/en/guide/schedule" },
      { text: "SEO & sitemaps", link: "/en/guide/seo" },
      { text: "AI assist", link: "/en/guide/ai-assist" },
    ],
  },
  {
    text: "API",
    items: [
      { text: "Overview", link: "/en/api/overview" },
      { text: "Public API", link: "/en/api/public-api" },
      { text: "Webhooks", link: "/en/api/webhooks" },
      { text: "AI agents", link: "/en/api/ai-agents" },
    ],
  },
  {
    text: "Ops",
    items: [
      { text: "Self-hosting", link: "/en/self-hosting/" },
      { text: "Environment variables", link: "/en/self-hosting/env-vars" },
      { text: "Deployment", link: "/en/self-hosting/deployment" },
    ],
  },
];

export default defineConfig({
  title: "LUNO",
  description: "AI-native content operations platform",
  base: "/",
  // Light-first product docs; users can still toggle dark.
  appearance: true,
  head: [
    // Prefer light on first visit (Neon-like docs shell). Respect later user toggle.
    [
      "script",
      {},
      `(() => { try { const k = 'vitepress-theme-appearance'; if (!localStorage.getItem(k)) localStorage.setItem(k, 'light'); } catch (_) {} })();`,
    ],
  ],

  sitemap: {
    hostname: "https://doc.luno.rest",
  },

  locales: {
    ja: {
      label: "日本語",
      lang: "ja",
      link: "/ja/",
      themeConfig: {
        docFooter: {
          prev: "前のページ",
          next: "次のページ",
        },
        nav: [
          { text: "スタート", link: "/ja/guide/getting-started" },
          {
            text: "プロダクト",
            items: [
              { text: "Content", link: "/ja/products/content" },
              { text: "Contact", link: "/ja/products/contact" },
              { text: "Embed", link: "/ja/products/embed" },
              { text: "AI Agents", link: "/ja/products/agents" },
              { text: "Webhooks", link: "/ja/products/webhooks" },
              { text: "Masters", link: "/ja/products/masters" },
              { text: "公開 API キー", link: "/ja/products/public-api-keys" },
              { text: "多言語", link: "/ja/products/localization" },
              { text: "プラン", link: "/ja/products/plans" },
            ],
          },
          { text: "API", link: "/ja/api/overview" },
          { text: "運用", link: "/ja/self-hosting/" },
          {
            text: "ログイン",
            link: "https://console.luno.rest/login",
            target: "_blank",
            rel: "noopener",
          },
          {
            text: "アカウント作成",
            link: "https://console.luno.rest/register",
            target: "_blank",
            rel: "noopener",
          },
        ],
        sidebar: {
          "/ja/": jaSidebar,
        },
      },
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
      themeConfig: {
        docFooter: {
          prev: "Previous",
          next: "Next",
        },
        nav: [
          { text: "Start", link: "/en/guide/getting-started" },
          {
            text: "Products",
            items: [
              { text: "Content", link: "/en/products/content" },
              { text: "Contact", link: "/en/products/contact" },
              { text: "Embed", link: "/en/products/embed" },
              { text: "AI Agents", link: "/en/products/agents" },
              { text: "Webhooks", link: "/en/products/webhooks" },
              { text: "Masters", link: "/en/products/masters" },
              { text: "Public API keys", link: "/en/products/public-api-keys" },
              { text: "Localization", link: "/en/products/localization" },
              { text: "Plans", link: "/en/products/plans" },
            ],
          },
          { text: "API", link: "/en/api/overview" },
          { text: "Ops", link: "/en/self-hosting/" },
          {
            text: "Log in",
            link: "https://console.luno.rest/login",
            target: "_blank",
            rel: "noopener",
          },
          {
            text: "Sign up",
            link: "https://console.luno.rest/register",
            target: "_blank",
            rel: "noopener",
          },
        ],
        sidebar: {
          "/en/": enSidebar,
        },
      },
    },
  },

  themeConfig: {
    logo: "/luno-logo.svg",
    siteTitle: false,
    search: {
      provider: "local",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/luno-cms/luno" },
    ],
  },
});
