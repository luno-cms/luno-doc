---
layout: false
title: LUNO Docs · AI-era Backend Platform
description: LUNO is a hosted AI-era Backend Platform for AI agents. BUILD / OPERATE / GOVERN via MCP and APIs. English and Japanese docs.
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
    Hosted <strong>AI-era Backend Platform</strong> for AI agents.
    Agents <strong>build and operate</strong> backends via <strong>MCP</strong>;
    humans <strong>govern</strong> production. Content and CMS are capabilities.
  </p>
  <p>
    <a href="/en/">English documentation</a>
    ·
    <a href="/ja/">日本語ドキュメント</a>
  </p>
</main>
