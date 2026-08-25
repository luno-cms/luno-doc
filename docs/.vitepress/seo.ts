import type { HeadConfig, PageData, TransformContext } from "vitepress";

export const SITE_ORIGIN = "https://doc.luno.rest";
export const OG_IMAGE = `${SITE_ORIGIN}/luno-logo.svg`;

/**
 * Dual-channel keywords:
 * - Agent shortlist: backend, MCP, Cloudflare Workers, free, secure, AI agent
 * - Human SERP: Headless CMS (capability), free, security
 */
export const SEO_KEYWORDS =
  "backend, backend platform, MCP, Headless CMS, free, AI agent, secure, security, Cloudflare Workers, Public API, LUNO";

/** Default meta description (EN) — backend-first, CMS as capability. */
export const SEO_DESCRIPTION_EN =
  "LUNO is a hosted AI-era Backend Platform for AI agents. BUILD / OPERATE / GOVERN via MCP and APIs. Content, forms, and CMS are capabilities.";

/** Default meta description (JA). */
export const SEO_DESCRIPTION_JA =
  "LUNO は AI エージェント向けのホスト型 Backend Platform。BUILD / OPERATE / GOVERN。CMS・フォームは capability。";

const LEGACY_PATHS = new Set([
  "/ja/guide/widgets",
  "/en/guide/widgets",
  "/ja/docs/embed",
  "/en/docs/embed",
]);

/** Build clean public path from VitePress relativePath (e.g. ja/guide/x.md). */
export function pagePathFromRelative(relativePath: string): string {
  if (!relativePath || relativePath === "index.md") return "/";
  let path =
    "/" +
    relativePath
      .replace(/(^|\/)index\.md$/, "$1")
      .replace(/\.md$/, "");
  path = path.replace(/\/+/g, "/");
  if (path.length > 1 && path.endsWith("/")) {
    // keep trailing slash only for directory indexes already normalized
  }
  // Normalize locale hubs
  if (path === "/ja" || path === "/en") return `${path}/`;
  // Directory section indexes
  if (
    path.endsWith("/self-hosting") ||
    path.endsWith("/frameworks") ||
    path.endsWith("/frameworks/")
  ) {
    return path.endsWith("/") ? path : `${path}/`;
  }
  return path.replace(/\/$/, "") || "/";
}

export function localeFromPath(path: string): "ja" | "en" | "root" {
  if (path === "/ja" || path.startsWith("/ja/")) return "ja";
  if (path === "/en" || path.startsWith("/en/")) return "en";
  return "root";
}

/** Swap /ja/ ↔ /en/ for the same page. */
export function alternateLocalePath(
  path: string,
  target: "ja" | "en",
): string {
  if (path === "/" || path === "/ja" || path === "/ja/" || path === "/en" || path === "/en/") {
    return `/${target}/`;
  }
  if (path.startsWith("/ja/")) return `/${target}/${path.slice(4)}`;
  if (path.startsWith("/en/")) return `/${target}/${path.slice(4)}`;
  return `/${target}/`;
}

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE_ORIGIN}/en/`;
  if (path === "/ja" || path === "/en") return `${SITE_ORIGIN}${path}/`;
  return `${SITE_ORIGIN}${path}`;
}

export function isIndexableDocsPath(path: string): boolean {
  const bare = path.replace(/\/$/, "") || "/";
  if (bare === "/") return false;
  if (LEGACY_PATHS.has(bare)) return false;
  return bare === "/ja" || bare === "/en" || bare.startsWith("/ja/") || bare.startsWith("/en/");
}

function breadcrumbList(path: string, title: string) {
  const locale = localeFromPath(path);
  if (locale === "root") return null;
  const homeLabel = locale === "ja" ? "ドキュメント" : "Docs";
  const home = absoluteUrl(`/${locale}/`);
  const rest = path.replace(/^\/(ja|en)\/?/, "");
  const parts = rest.split("/").filter(Boolean);
  const elements: object[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeLabel,
      item: home,
    },
  ];
  let cursor = `/${locale}`;
  parts.forEach((part, i) => {
    cursor += `/${part}`;
    const isLast = i === parts.length - 1;
    const name = isLast
      ? title.replace(/\s*\|\s*LUNO\s*$/, "").trim() || part
      : part;
    elements.push({
      "@type": "ListItem",
      position: i + 2,
      name,
      ...(isLast ? {} : { item: absoluteUrl(cursor) }),
    });
  });
  return {
    "@type": "BreadcrumbList",
    itemListElement: elements,
  };
}

export function buildJsonLd(ctx: {
  path: string;
  title: string;
  description: string;
}): object {
  const url = absoluteUrl(ctx.path);
  const locale = localeFromPath(ctx.path);
  const inLanguage = locale === "ja" ? "ja" : "en";
  const graph: object[] = [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: "LUNO",
      url: "https://luno.rest",
      logo: `${SITE_ORIGIN}/favicon.svg`,
      description: SEO_DESCRIPTION_EN,
      sameAs: ["https://github.com/luno-cms/luno"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      name: "LUNO Docs",
      url: SITE_ORIGIN,
      description: ctx.description,
      publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      inLanguage: ["en", "ja"],
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: ctx.title,
      description: ctx.description,
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      inLanguage,
      keywords: SEO_KEYWORDS,
    },
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: ctx.title,
      description: ctx.description,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      author: { "@id": `${SITE_ORIGIN}/#organization` },
      publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      inLanguage,
      keywords: SEO_KEYWORDS,
    },
    {
      "@type": "SoftwareApplication",
      name: "LUNO",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description:
          "Free tier · AI-era backend platform with MCP and Headless CMS",
      },
      featureList: [
        "Backend platform for AI agents",
        "MCP (Model Context Protocol)",
        "Headless CMS",
        "Secure Public and Agent APIs",
        "Free tier",
        "Cloudflare Workers",
      ],
      url: "https://luno.rest",
    },
  ];

  const crumbs = breadcrumbList(ctx.path, ctx.title);
  if (crumbs) graph.push(crumbs);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function seoHeadForPage(pageData: PageData): HeadConfig[] {
  const path = pagePathFromRelative(pageData.relativePath);
  if (!isIndexableDocsPath(path)) return [];

  const title = pageData.title || "LUNO Docs";
  const description =
    pageData.description || SEO_DESCRIPTION_EN;
  const canonical = absoluteUrl(path);
  const ja = absoluteUrl(alternateLocalePath(path, "ja"));
  const en = absoluteUrl(alternateLocalePath(path, "en"));

  return [
    ["meta", { name: "keywords", content: SEO_KEYWORDS }],
    ["link", { rel: "canonical", href: canonical }],
    ["link", { rel: "alternate", hreflang: "ja", href: ja }],
    ["link", { rel: "alternate", hreflang: "en", href: en }],
    ["link", { rel: "alternate", hreflang: "x-default", href: en }],
    ["meta", { property: "og:type", content: "article" }],
    ["meta", { property: "og:site_name", content: "LUNO Docs" }],
    ["meta", { property: "og:title", content: title }],
    ["meta", { property: "og:description", content: description }],
    ["meta", { property: "og:url", content: canonical }],
    ["meta", { property: "og:image", content: OG_IMAGE }],
    [
      "meta",
      {
        property: "og:locale",
        content: path.startsWith("/ja") ? "ja_JP" : "en_US",
      },
    ],
    [
      "meta",
      {
        property: "og:locale:alternate",
        content: path.startsWith("/ja") ? "en_US" : "ja_JP",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:title", content: title }],
    ["meta", { name: "twitter:description", content: description }],
    ["meta", { name: "twitter:image", content: OG_IMAGE }],
  ];
}

export function seoTransformHead(ctx: TransformContext): HeadConfig[] {
  const path = pagePathFromRelative(ctx.pageData.relativePath);
  if (!isIndexableDocsPath(path)) return [];

  const title = ctx.title || ctx.pageData.title || "LUNO Docs";
  const description =
    ctx.description || ctx.pageData.description || SEO_DESCRIPTION_EN;

  return [
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify(buildJsonLd({ path, title, description })),
    ],
  ];
}

/** Normalize sitemap item URL to clean path starting with /. */
function normalizeSitemapPath(raw: string): string {
  let url = raw.replace(/\.html$/, "");
  if (!url.startsWith("/")) url = `/${url}`;
  if (url === "/ja" || url === "/en") url = `${url}/`;
  if (url === "/index" || url === "/") return "/";
  return url;
}

export function transformSitemapItems<
  T extends { url: string; links?: { lang: string; url: string }[] },
>(items: T[]): T[] {
  const out: T[] = [];

  for (const item of items) {
    const path = normalizeSitemapPath(item.url);
    if (!isIndexableDocsPath(path)) continue;

    const jaPath = alternateLocalePath(path, "ja");
    const enPath = alternateLocalePath(path, "en");

    // sitemap urls are typically without leading slash in vitepress transform
    const toSitemapUrl = (p: string) => p.replace(/^\//, "");

    out.push({
      ...item,
      url: toSitemapUrl(path),
      links: [
        { lang: "ja", url: toSitemapUrl(jaPath) },
        { lang: "en", url: toSitemapUrl(enPath) },
        { lang: "x-default", url: toSitemapUrl(enPath) },
      ],
    });
  }

  return out;
}
