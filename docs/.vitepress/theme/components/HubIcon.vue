<script setup lang="ts">
/** Thin outline icons for the product hub (Neon-like). */
defineProps<{
  name: string;
}>();

const paths: Record<string, string> = {
  agents:
    "M9 8V7a3 3 0 0 1 6 0v1M7.5 8h9A1.5 1.5 0 0 1 18 9.5v6A1.5 1.5 0 0 1 16.5 17h-9A1.5 1.5 0 0 1 6 15.5v-6A1.5 1.5 0 0 1 7.5 8ZM10 12h.01M14 12h.01M9.5 17v1.5a2.5 2.5 0 0 0 5 0V17",
  console:
    "M4.5 6.5A2 2 0 0 1 6.5 4.5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11ZM8 9.5h8M8 13h5",
  api: "M8.5 7 5 12l3.5 5M15.5 7 19 12l-3.5 5M13.5 6.5l-3 11",
  content:
    "M7 4.5h7l4 4V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Zm7 0v4h4M9 13h6M9 16.5h4",
  contact:
    "M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-3.5 3v-3H6.5A1.5 1.5 0 0 1 5 13.5v-7Z",
  embed: "M9 8 5.5 12 9 16M15 8l3.5 4L15 16",
  webhooks:
    "M9.5 8.5a3.5 3.5 0 1 1 5.2 3.05H17a2.5 2.5 0 1 1 0 5h-2.15A3.5 3.5 0 1 1 9 14.2",
  masters: "M5 7h14M5 12h14M5 17h9M8 7v10M13 12v5",
  keys: "M15 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm-2.2 4.3L7 17.5l-1.8 1.8 1.8 1.7 1.7-1.7L10 18l3.5-3.5",
  localization:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.5 12h17M12 3c2.4 2.7 3.7 5.8 3.7 9s-1.3 6.3-3.7 9c-2.4-2.7-3.7-5.8-3.7-9S9.6 5.7 12 3Z",
  plans:
    "M8 5.5h9.5A1.5 1.5 0 0 1 19 7v12.5l-2.5-1.3L14 19.5l-2.5-1.3L9 19.5V7A1.5 1.5 0 0 0 7.5 5.5H6",
  media:
    "M5 7.5A1.5 1.5 0 0 1 6.5 6h11A1.5 1.5 0 0 1 19 7.5v9A1.5 1.5 0 0 1 17.5 18h-11A1.5 1.5 0 0 1 5 16.5v-9Zm3 2.5 2.8 2.2 2-1.6L16.5 14",
};
</script>

<template>
  <svg
    class="hub-icon"
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    stroke-width="1.55"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.content" />
  </svg>
</template>
