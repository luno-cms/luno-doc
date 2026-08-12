import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import ProductHub from "./components/ProductHub.vue";
import ArchitectureDiagram from "./components/ArchitectureDiagram.vue";
import "./custom.css";
import "./hub.css";
import "./footer.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("ProductHub", ProductHub);
    app.component("ArchitectureDiagram", ArchitectureDiagram);
  },
} satisfies Theme;
