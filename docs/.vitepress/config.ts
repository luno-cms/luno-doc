import { defineConfig } from "vitepress";

export default defineConfig({
  title: "LUNO",
  description: "Headless CMS powered by Cloudflare Workers",
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
          { text: "ガイド", link: "/ja/guide/getting-started" },
          { text: "公開 API", link: "/ja/api/overview" },
          { text: "AI エージェント", link: "/ja/api/ai-agents" },
          { text: "セルフホスト", link: "/ja/self-hosting/" },
        ],
        sidebar: {
          "/ja/guide/": [
            {
              text: "はじめに",
              items: [
                { text: "クイックスタート", link: "/ja/guide/getting-started" },
                { text: "コンテンツ管理", link: "/ja/guide/content-management" },
                { text: "フォームビルダー", link: "/ja/guide/form-builder" },
                { text: "メディア管理", link: "/ja/guide/media" },
                { text: "コンタクトフォーム", link: "/ja/guide/contact-forms" },
                { text: "ウィジェット埋め込み", link: "/ja/guide/widgets" },
                { text: "SEO・サイトマップ", link: "/ja/guide/seo" },
                { text: "AI アシスト", link: "/ja/guide/ai-assist" },
                { text: "スケジュール公開", link: "/ja/guide/schedule" },
              ],
            },
          ],
          "/ja/api/": [
            {
              text: "API リファレンス",
              items: [
                { text: "概要", link: "/ja/api/overview" },
                { text: "公開 API", link: "/ja/api/public-api" },
                { text: "Webhook", link: "/ja/api/webhooks" },
                { text: "AI エージェント向け", link: "/ja/api/ai-agents" },
              ],
            },
          ],
          "/ja/self-hosting/": [
            {
              text: "セルフホスト",
              items: [
                { text: "概要", link: "/ja/self-hosting/" },
                { text: "環境変数", link: "/ja/self-hosting/env-vars" },
                { text: "デプロイ", link: "/ja/self-hosting/deployment" },
              ],
            },
          ],
        },
      },
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/en/guide/getting-started" },
          { text: "Public API", link: "/en/api/overview" },
          { text: "AI Agents", link: "/en/api/ai-agents" },
          { text: "Self-Hosting", link: "/en/self-hosting/" },
        ],
        sidebar: {
          "/en/guide/": [
            {
              text: "Getting Started",
              items: [
                { text: "Quick Start", link: "/en/guide/getting-started" },
                { text: "Content Management", link: "/en/guide/content-management" },
                { text: "Form Builder", link: "/en/guide/form-builder" },
                { text: "Media Management", link: "/en/guide/media" },
                { text: "Contact Forms", link: "/en/guide/contact-forms" },
                { text: "Widget Embedding", link: "/en/guide/widgets" },
                { text: "SEO & Sitemaps", link: "/en/guide/seo" },
                { text: "AI Assist", link: "/en/guide/ai-assist" },
                { text: "Scheduled Publishing", link: "/en/guide/schedule" },
              ],
            },
          ],
          "/en/api/": [
            {
              text: "API Reference",
              items: [
                { text: "Overview", link: "/en/api/overview" },
                { text: "Public API", link: "/en/api/public-api" },
                { text: "Webhooks", link: "/en/api/webhooks" },
                { text: "AI Agents", link: "/en/api/ai-agents" },
              ],
            },
          ],
          "/en/self-hosting/": [
            {
              text: "Self-Hosting",
              items: [
                { text: "Overview", link: "/en/self-hosting/" },
                { text: "Environment Variables", link: "/en/self-hosting/env-vars" },
                { text: "Deployment", link: "/en/self-hosting/deployment" },
              ],
            },
          ],
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
      { icon: "github", link: "https://github.com/lunocms/luno" },
    ],
  },
});
