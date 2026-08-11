import { defineConfig } from "vitepress";

const jaSidebar = [
  {
    text: "スタート",
    items: [
      { text: "製品ハブ", link: "/ja/" },
      { text: "クイックスタート", link: "/ja/guide/getting-started" },
      { text: "AI エージェント", link: "/ja/api/ai-agents" },
    ],
  },
  {
    text: "プロダクト",
    items: [
      { text: "コンテンツ管理", link: "/ja/guide/content-management" },
      { text: "フォームビルダー", link: "/ja/guide/form-builder" },
      { text: "メディア", link: "/ja/guide/media" },
      { text: "コンタクトフォーム", link: "/ja/guide/contact-forms" },
      { text: "埋め込み & Pub", link: "/ja/guide/embed" },
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
      { text: "Quick start", link: "/en/guide/getting-started" },
      { text: "AI agents", link: "/en/api/ai-agents" },
    ],
  },
  {
    text: "Products",
    items: [
      { text: "Content management", link: "/en/guide/content-management" },
      { text: "Form builder", link: "/en/guide/form-builder" },
      { text: "Media", link: "/en/guide/media" },
      { text: "Contact forms", link: "/en/guide/contact-forms" },
      { text: "Embed & Pub", link: "/en/guide/embed" },
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

  sitemap: {
    hostname: "https://doc.luno.rest",
  },

  locales: {
    ja: {
      label: "日本語",
      lang: "ja",
      link: "/ja/",
      themeConfig: {
        nav: [
          { text: "スタート", link: "/ja/guide/getting-started" },
          {
            text: "プロダクト",
            items: [
              { text: "コンテンツ", link: "/ja/guide/content-management" },
              { text: "コンタクト", link: "/ja/guide/contact-forms" },
              { text: "埋め込み", link: "/ja/guide/embed" },
              { text: "AI エージェント", link: "/ja/api/ai-agents" },
              { text: "Webhook", link: "/ja/api/webhooks" },
            ],
          },
          { text: "API", link: "/ja/api/overview" },
          { text: "運用", link: "/ja/self-hosting/" },
          {
            text: "Console",
            link: "https://console.luno.rest",
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
        nav: [
          { text: "Start", link: "/en/guide/getting-started" },
          {
            text: "Products",
            items: [
              { text: "Content", link: "/en/guide/content-management" },
              { text: "Contact", link: "/en/guide/contact-forms" },
              { text: "Embed", link: "/en/guide/embed" },
              { text: "AI agents", link: "/en/api/ai-agents" },
              { text: "Webhooks", link: "/en/api/webhooks" },
            ],
          },
          { text: "API", link: "/en/api/overview" },
          { text: "Ops", link: "/en/self-hosting/" },
          {
            text: "Console",
            link: "https://console.luno.rest",
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
