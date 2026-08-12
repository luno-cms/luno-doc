<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { lang } = useData();

const copy = computed(() =>
  lang.value.startsWith("en")
    ? {
        login: "Log in",
        signup: "Sign up",
      }
    : {
        login: "ログイン",
        signup: "アカウント作成",
      },
);
</script>

<template>
  <div class="luno-nav-auth">
    <a
      class="luno-nav-auth__login"
      href="https://console.luno.rest/login"
      target="_blank"
      rel="noopener"
    >
      {{ copy.login }}
    </a>
    <a
      class="luno-nav-auth__signup"
      href="https://console.luno.rest/register"
      target="_blank"
      rel="noopener"
    >
      {{ copy.signup }}
    </a>
  </div>
</template>
