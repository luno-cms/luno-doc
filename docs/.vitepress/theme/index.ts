import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import ProductHub from "./components/ProductHub.vue";
import ArchitectureDiagram from "./components/ArchitectureDiagram.vue";
import "./custom.css";
import "./hub.css";
import "./footer.css";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = "G-S7812CRNZ2";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component("ProductHub", ProductHub);
    app.component("ArchitectureDiagram", ArchitectureDiagram);

    if (typeof window === "undefined") return;

    const trackPage = (url: string) => {
      window.gtag?.("config", GA_ID, { page_path: url });
    };

    // Initial load is handled by the head snippet; track SPA navigations.
    const previous = router.onAfterRouteChange;
    router.onAfterRouteChange = async (to) => {
      if (previous) await previous(to);
      trackPage(to);
    };
  },
} satisfies Theme;
