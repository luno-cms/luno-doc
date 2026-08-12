<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import SiteFooter from "./components/SiteFooter.vue";
import NavAuth from "./components/NavAuth.vue";

const { Layout } = DefaultTheme;

const LUNO_ORIGIN = "https://luno.rest";

function goLunoHome(event: MouseEvent | KeyboardEvent) {
  event.preventDefault();
  event.stopPropagation();
  window.location.assign(LUNO_ORIGIN);
}
</script>

<template>
  <Layout>
    <template #nav-bar-title-before>
      <!-- Hit-area over wordmark only (avoid nested <a> inside title link) -->
      <span
        class="luno-logo-link"
        role="link"
        tabindex="0"
        aria-label="LUNO"
        @click="goLunoHome"
        @keydown.enter.prevent="goLunoHome"
        @keydown.space.prevent="goLunoHome"
      />
    </template>
    <template #nav-bar-title-after>
      <span class="luno-docs-mark">Docs</span>
    </template>
    <template #nav-bar-content-after>
      <NavAuth />
    </template>
    <template #nav-screen-content-after>
      <NavAuth />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Layout>
</template>
