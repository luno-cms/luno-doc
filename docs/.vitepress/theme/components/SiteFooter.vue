<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useData, useRoute } from "vitepress";
import {
  footerByLocale,
  resolveFooterHref,
  switchDocsLocalePath,
  type FooterDict,
} from "../footer/footer-data";

type ThemePref = "auto" | "light" | "dark";
type LocalePref = "auto" | "ja" | "en";

const APPEARANCE_KEY = "vitepress-theme-appearance";
const LOCALE_KEY = "luno-docs-locale-pref";

const { lang, isDark } = useData();
const route = useRoute();

const locale = computed<"ja" | "en">(() =>
  lang.value.startsWith("en") ? "en" : "ja",
);

const dict = computed<FooterDict>(() => footerByLocale[locale.value]);
const year = new Date().getFullYear();

const themePref = ref<ThemePref>("dark");
const localePref = ref<LocalePref>("auto");
const ready = ref(false);

onMounted(() => {
  const stored = localStorage.getItem(APPEARANCE_KEY);
  if (stored === "light" || stored === "dark" || stored === "auto") {
    themePref.value = stored;
  }
  const loc = localStorage.getItem(LOCALE_KEY);
  if (loc === "auto" || loc === "ja" || loc === "en") {
    localePref.value = loc;
  }
  ready.value = true;
});

function hrefFor(linkHref: string) {
  return resolveFooterHref(locale.value, linkHref);
}

function openExternal(linkHref: string) {
  const resolved = hrefFor(linkHref);
  if (!resolved.startsWith("http")) return false;
  try {
    return !new URL(resolved).hostname.endsWith("luno.rest");
  } catch {
    return true;
  }
}

function applyTheme(pref: ThemePref) {
  themePref.value = pref;
  localStorage.setItem(APPEARANCE_KEY, pref);
  if (pref === "auto") {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } else {
    isDark.value = pref === "dark";
  }
}

function detectBrowserLocale(): "ja" | "en" {
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const entry of languages) {
    if (entry.toLowerCase().startsWith("ja")) return "ja";
  }
  return "en";
}

function applyLocale(pref: LocalePref) {
  localePref.value = pref;
  localStorage.setItem(LOCALE_KEY, pref);
  const target = pref === "auto" ? detectBrowserLocale() : pref;
  if (target === locale.value) return;
  const next = switchDocsLocalePath(route.path, target);
  window.location.href = next;
}
</script>

<template>
  <footer class="luno-footer" data-lp-footer>
    <div class="luno-footer__inner">
      <div class="luno-footer__brand">
        <a
          class="luno-footer__logo"
          :href="hrefFor('/')"
          :aria-label="dict.brandName"
        >
          <img src="/luno-logo.svg" alt="" height="16" width="70" />
        </a>
        <p class="luno-footer__blurb">{{ dict.blurb }}</p>

        <div class="luno-footer__controls">
          <div
            class="luno-footer__pill"
            role="group"
            :aria-label="dict.nav.toDark"
          >
            <button
              type="button"
              class="luno-footer__pill-btn"
              :class="{ 'is-active': ready && themePref === 'auto' }"
              :aria-pressed="ready && themePref === 'auto'"
              :title="dict.nav.toSystem"
              :aria-label="dict.nav.toSystem"
              @click="applyTheme('auto')"
            >
              <span class="luno-footer__icon luno-footer__icon--monitor" />
            </button>
            <button
              type="button"
              class="luno-footer__pill-btn"
              :class="{ 'is-active': ready && themePref === 'light' }"
              :aria-pressed="ready && themePref === 'light'"
              :title="dict.nav.toLight"
              :aria-label="dict.nav.toLight"
              @click="applyTheme('light')"
            >
              <span class="luno-footer__icon luno-footer__icon--sun" />
            </button>
            <button
              type="button"
              class="luno-footer__pill-btn"
              :class="{ 'is-active': ready && themePref === 'dark' }"
              :aria-pressed="ready && themePref === 'dark'"
              :title="dict.nav.toDark"
              :aria-label="dict.nav.toDark"
              @click="applyTheme('dark')"
            >
              <span class="luno-footer__icon luno-footer__icon--moon" />
            </button>
          </div>

          <div
            class="luno-footer__pill"
            role="group"
            :aria-label="dict.nav.language"
          >
            <button
              type="button"
              class="luno-footer__pill-btn luno-footer__pill-btn--text"
              :class="{ 'is-active': ready && localePref === 'auto' }"
              :aria-pressed="ready && localePref === 'auto'"
              :title="dict.nav.languageAuto"
              @click="applyLocale('auto')"
            >
              {{ locale === "ja" ? "自動" : "Auto" }}
            </button>
            <button
              type="button"
              class="luno-footer__pill-btn luno-footer__pill-btn--text"
              :class="{ 'is-active': ready && localePref === 'en' }"
              :aria-pressed="ready && localePref === 'en'"
              title="EN"
              @click="applyLocale('en')"
            >
              EN
            </button>
            <button
              type="button"
              class="luno-footer__pill-btn luno-footer__pill-btn--text"
              :class="{ 'is-active': ready && localePref === 'ja' }"
              :aria-pressed="ready && localePref === 'ja'"
              title="JA"
              @click="applyLocale('ja')"
            >
              JA
            </button>
          </div>
        </div>

        <div class="luno-footer__legal">
          <p>© {{ year }} {{ dict.brandName }}. All rights reserved.</p>
          <ul>
            <li v-for="link in dict.legalLinks" :key="link.label">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <nav class="luno-footer__columns" aria-label="Footer">
        <div
          v-for="col in dict.columns"
          :key="col.title"
          class="luno-footer__col"
        >
          <p class="luno-footer__col-title">{{ col.title }}</p>
          <ul>
            <li v-for="link in col.links" :key="`${col.title}-${link.label}`">
              <a
                :href="hrefFor(link.href)"
                :target="openExternal(link.href) ? '_blank' : undefined"
                :rel="
                  openExternal(link.href) ? 'noopener noreferrer' : undefined
                "
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </footer>
</template>
