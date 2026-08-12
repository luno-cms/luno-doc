---
layout: false
title: LUNO Docs · Backend, MCP, Headless CMS, free, secure
description: LUNO is a free AI-era backend platform (Headless CMS + secure APIs) operable via MCP on Cloudflare Workers. English and Japanese docs.
---

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vitepress";

const router = useRouter();
onMounted(() => {
  const lang = navigator.language?.startsWith("ja") ? "/ja/" : "/en/";
  router.go(lang);
});
</script>

<main style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1.25rem; line-height: 1.5">
  <h1>LUNO Docs</h1>
  <p>
    Free <strong>AI-era backend platform</strong>
    (<strong>Headless CMS</strong> + forms + <strong>secure</strong> APIs)
    operable via <strong>MCP</strong> on <strong>Cloudflare Workers</strong>.
  </p>
  <p>
    <a href="/en/">English documentation</a>
    ·
    <a href="/ja/">日本語ドキュメント</a>
  </p>
</main>
