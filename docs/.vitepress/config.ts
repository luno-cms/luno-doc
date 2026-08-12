import { defineConfig } from "vitepress";
import {
  SEO_DESCRIPTION_EN,
  SEO_KEYWORDS,
  seoHeadForPage,
  seoTransformHead,
  transformSitemapItems,
} from "./seo";

/**
 * Sidebar + top nav share the same Console-aligned groups.
 * Hub visual: Neon Products (flat+icons) / Platform.
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
    text: "コンテンツ",
    items: [
      { text: "Headless CMS", link: "/ja/products/content" },
      { text: "Masters", link: "/ja/products/masters" },
      { text: "多言語", link: "/ja/products/localization" },
      { text: "コンテンツ管理", link: "/ja/guide/content-management" },
      { text: "フォームビルダー", link: "/ja/guide/form-builder" },
      { text: "メディア", link: "/ja/guide/media" },
      { text: "スケジュール公開", link: "/ja/guide/schedule" },
      { text: "SEO・サイトマップ", link: "/ja/guide/seo" },
      { text: "AI アシスト", link: "/ja/guide/ai-assist" },
    ],
  },
  {
    text: "配信・コンタクト",
    items: [
      { text: "Contact Form", link: "/ja/products/contact" },
      { text: "Embed & Pub", link: "/ja/products/embed" },
      { text: "コンタクト実装", link: "/ja/guide/contact-forms" },
      { text: "埋め込み実装", link: "/ja/guide/embed" },
    ],
  },
  {
    text: "連携・自動化",
    items: [
      { text: "AI Agents", link: "/ja/products/agents" },
      { text: "Webhooks", link: "/ja/products/webhooks" },
      { text: "公開 API キー", link: "/ja/products/public-api-keys" },
      {
        text: "API リファレンス",
        collapsed: true,
        items: [
          { text: "API 概要", link: "/ja/api/overview" },
          { text: "公開 API", link: "/ja/api/public-api" },
          { text: "Webhook", link: "/ja/api/webhooks" },
          { text: "AI エージェント向け", link: "/ja/api/ai-agents" },
        ],
      },
      {
        text: "フレームワーク",
        collapsed: true,
        items: [
          { text: "フレームワーク概要", link: "/ja/guide/frameworks/" },
          { text: "Next.js", link: "/ja/guide/frameworks/nextjs" },
          { text: "Astro", link: "/ja/guide/frameworks/astro" },
          { text: "Nuxt", link: "/ja/guide/frameworks/nuxt" },
        ],
      },
    ],
  },
  {
    text: "サイト",
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
    text: "Content",
    items: [
      { text: "Headless CMS", link: "/en/products/content" },
      { text: "Masters", link: "/en/products/masters" },
      { text: "Localization", link: "/en/products/localization" },
      { text: "Content management", link: "/en/guide/content-management" },
      { text: "Form builder", link: "/en/guide/form-builder" },
      { text: "Media", link: "/en/guide/media" },
      { text: "Scheduled publishing", link: "/en/guide/schedule" },
      { text: "SEO & sitemaps", link: "/en/guide/seo" },
      { text: "AI assist", link: "/en/guide/ai-assist" },
    ],
  },
  {
    text: "Deliver & Contact",
    items: [
      { text: "Contact Form", link: "/en/products/contact" },
      { text: "Embed & Pub", link: "/en/products/embed" },
      { text: "Contact implementation", link: "/en/guide/contact-forms" },
      { text: "Embed implementation", link: "/en/guide/embed" },
    ],
  },
  {
    text: "Connect & Automate",
    items: [
      { text: "AI Agents", link: "/en/products/agents" },
      { text: "Webhooks", link: "/en/products/webhooks" },
      { text: "Public API keys", link: "/en/products/public-api-keys" },
      {
        text: "API reference",
        collapsed: true,
        items: [
          { text: "API overview", link: "/en/api/overview" },
          { text: "Public API", link: "/en/api/public-api" },
          { text: "Webhooks", link: "/en/api/webhooks" },
          { text: "AI agents", link: "/en/api/ai-agents" },
        ],
      },
      {
        text: "Frameworks",
        collapsed: true,
        items: [
          { text: "Frameworks overview", link: "/en/guide/frameworks/" },
          { text: "Next.js", link: "/en/guide/frameworks/nextjs" },
          { text: "Astro", link: "/en/guide/frameworks/astro" },
          { text: "Nuxt", link: "/en/guide/frameworks/nuxt" },
        ],
      },
    ],
  },
  {
    text: "Site",
    items: [
      { text: "Self-hosting", link: "/en/self-hosting/" },
      { text: "Environment variables", link: "/en/self-hosting/env-vars" },
      { text: "Deployment", link: "/en/self-hosting/deployment" },
    ],
  },
];

/** Top nav mirrors sidebar groups (same labels / same links). */
function navFromSidebar(sidebar: typeof jaSidebar) {
  return sidebar.map((group) => ({
    text: group.text,
    items: flattenNavItems(group.items),
  }));
}

function flattenNavItems(
  items: {
    text: string;
    link?: string;
    collapsed?: boolean;
    items?: { text: string; link?: string; items?: any[] }[];
  }[],
): { text: string; link: string }[] {
  const out: { text: string; link: string }[] = [];
  for (const item of items) {
    if (item.link) out.push({ text: item.text, link: item.link });
    if (item.items) {
      for (const child of item.items) {
        if (child.link) out.push({ text: child.text, link: child.link });
      }
    }
  }
  return out;
}

export default defineConfig({
  title: "LUNO",
  description: SEO_DESCRIPTION_EN,
  base: "/",
  cleanUrls: true,
  appearance: "dark",
  head: [
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.svg" }],
    [
      "meta",
      {
        name: "keywords",
        content: SEO_KEYWORDS,
      },
    ],
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-S7812CRNZ2",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-S7812CRNZ2');`,
    ],
    [
      "script",
      {},
      `(() => { try { const k = 'vitepress-theme-appearance'; if (!localStorage.getItem(k)) localStorage.setItem(k, 'dark'); } catch (_) {} })();`,
    ],
  ],

  transformPageData(pageData) {
    const extra = seoHeadForPage(pageData);
    if (!extra.length) return;
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(...extra);
  },

  async transformHead(ctx) {
    return seoTransformHead(ctx);
  },

  sitemap: {
    hostname: "https://doc.luno.rest",
    transformItems: (items) => transformSitemapItems(items),
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
        nav: navFromSidebar(jaSidebar),
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
        nav: navFromSidebar(enSidebar),
        sidebar: {
          "/en/": enSidebar,
        },
      },
    },
  },

  themeConfig: {
    logo: "/luno-logo.svg",
    siteTitle: false,
    socialLinks: [
      { icon: "github", link: "https://github.com/luno-cms/luno" },
    ],
    search: {
      provider: "local",
    },
  },
});
