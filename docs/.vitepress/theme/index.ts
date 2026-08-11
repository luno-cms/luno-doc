import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import ProductHub from "./components/ProductHub.vue";
import ArchitectureDiagram from "./components/ArchitectureDiagram.vue";
import "./custom.css";
import "./hub.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ProductHub", ProductHub);
    app.component("ArchitectureDiagram", ArchitectureDiagram);
  },
} satisfies Theme;
