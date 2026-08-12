/** Footer copy/links aligned with sattela3/products/lp SiteFooter. */

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };

export type FooterDict = {
  brandName: string;
  blurb: string;
  columns: FooterColumn[];
  legalLinks: FooterLink[];
  nav: {
    language: string;
    languageAuto: string;
    toSystem: string;
    toLight: string;
    toDark: string;
  };
};

export const LP_ORIGIN = "https://luno.rest";

export const footerByLocale: Record<"ja" | "en", FooterDict> = {
  ja: {
    brandName: "LUNO",
    blurb: "LUNO is Backend Platform for the AI Era.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "料金", href: "/pricing" },
          { label: "比較", href: "/compare" },
          { label: "セキュリティ", href: "/security" },
          { label: "エンタープライズ", href: "/enterprise" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "ドキュメント", href: "https://doc.luno.rest/ja/" },
          {
            label: "クイックスタート",
            href: "https://doc.luno.rest/ja/guide/getting-started.html",
          },
          { label: "MCP / CLI", href: "/#ai-surfaces" },
          { label: "Capabilities", href: "/#capabilities" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "お問い合わせ", href: "/contact" },
          { label: "営業に相談", href: "/contact" },
        ],
      },
    ],
    legalLinks: [
      { label: "プライバシー", href: "https://sattela3.com/ja/privacy" },
      { label: "利用規約", href: "https://sattela3.com/ja/terms" },
      { label: "特定商取引法", href: "https://sattela3.com/ja/tokusho" },
    ],
    nav: {
      language: "言語",
      languageAuto: "自動判定",
      toSystem: "システム設定に合わせる",
      toLight: "ライト配色に切り替え",
      toDark: "ダーク配色に切り替え",
    },
  },
  en: {
    brandName: "LUNO",
    blurb: "LUNO is Backend Platform for the AI Era.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Pricing", href: "/pricing" },
          { label: "Compare", href: "/compare" },
          { label: "Security", href: "/security" },
          { label: "Enterprise", href: "/enterprise" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Docs", href: "https://doc.luno.rest/en/" },
          {
            label: "Quickstart",
            href: "https://doc.luno.rest/en/guide/getting-started.html",
          },
          { label: "MCP / CLI", href: "/#ai-surfaces" },
          { label: "Capabilities", href: "/#capabilities" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Contact", href: "/contact" },
          { label: "Talk to sales", href: "/contact" },
        ],
      },
    ],
    legalLinks: [
      { label: "Privacy", href: "https://sattela3.com/en/privacy" },
      { label: "Terms", href: "https://sattela3.com/en/terms" },
      { label: "Cookie", href: "https://sattela3.com/en/cookie" },
    ],
    nav: {
      language: "Language",
      languageAuto: "Auto",
      toSystem: "Match system setting",
      toLight: "Switch to light",
      toDark: "Switch to dark",
    },
  },
};

export function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  );
}

export function resolveFooterHref(locale: "ja" | "en", href: string): string {
  if (isExternalHref(href)) {
    try {
      const url = new URL(href);
      if (url.hostname === "doc.luno.rest") {
        return `${url.pathname.replace(/\.html$/, "")}${url.hash}` || "/";
      }
    } catch {
      /* keep */
    }
    return href;
  }
  if (href.startsWith("#")) return `${LP_ORIGIN}/${locale}${href}`;
  if (href.startsWith("/#")) return `${LP_ORIGIN}/${locale}${href.slice(1)}`;
  if (!href || href === "/") return `${LP_ORIGIN}/${locale}`;
  return `${LP_ORIGIN}/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

export function switchDocsLocalePath(
  path: string,
  next: "ja" | "en",
): string {
  const replaced = path.replace(/^\/(ja|en)(\/|$)/, `/${next}$2`);
  if (replaced !== path) return replaced;
  return `/${next}/`;
}
