<script setup lang="ts">
const props = defineProps<{
  locale?: "ja" | "en";
}>();

const copy = {
  ja: {
    internet: "インターネット",
    clients: "ブラウザ・API",
    admins: "管理者",
    edge: "Cloudflare エッジ",
    workersTitle: "Workers API",
    workersMeta: "Hono",
    pagesTitle: "Pages",
    pagesMeta: "Admin SPA",
    hyperTitle: "Hyperdrive",
    hyperMeta: "DB 接続プール",
    r2Title: "R2",
    r2Meta: "メディア",
    pgTitle: "PostgreSQL",
    pgMeta: "Neon / Supabase / Railway / 自前",
  },
  en: {
    internet: "Internet",
    clients: "Browsers · APIs",
    admins: "Admins",
    edge: "Cloudflare Edge",
    workersTitle: "Workers API",
    workersMeta: "Hono",
    pagesTitle: "Pages",
    pagesMeta: "Admin SPA",
    hyperTitle: "Hyperdrive",
    hyperMeta: "Connection pool",
    r2Title: "R2",
    r2Meta: "Media",
    pgTitle: "PostgreSQL",
    pgMeta: "Neon / Supabase / Railway / self-hosted",
  },
} as const;

const t = copy[props.locale === "en" ? "en" : "ja"];
</script>

<template>
  <div class="arch" role="img" :aria-label="t.edge">
    <div class="arch__actors">
      <div class="arch__actor">
        <span class="arch__actor-label">{{ t.internet }}</span>
        <span class="arch__actor-name">{{ t.clients }}</span>
        <span class="arch__arrow" aria-hidden="true" />
      </div>
      <div class="arch__actor">
        <span class="arch__actor-name">{{ t.admins }}</span>
        <span class="arch__arrow" aria-hidden="true" />
      </div>
    </div>

    <div class="arch__edge">
      <header class="arch__edge-head">
        <span class="arch__edge-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M4 12c4-7 12-7 16 0-4 7-12 7-16 0Z"
              stroke="currentColor"
              stroke-width="1.6"
            />
            <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          </svg>
        </span>
        <span>{{ t.edge }}</span>
      </header>

      <div class="arch__grid">
        <div class="arch__node arch__node--accent">
          <span class="arch__node-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <rect
                x="4"
                y="5"
                width="16"
                height="14"
                rx="2"
                stroke="currentColor"
                stroke-width="1.55"
              />
              <path
                d="M8 10h8M8 14h5"
                stroke="currentColor"
                stroke-width="1.55"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <span class="arch__node-title">{{ t.workersTitle }}</span>
          <span class="arch__node-meta">{{ t.workersMeta }}</span>
        </div>

        <div class="arch__node">
          <span class="arch__node-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5v-9Z"
                stroke="currentColor"
                stroke-width="1.55"
                stroke-linejoin="round"
              />
              <path
                d="M12 12v8M5 7.5 12 12l7-4.5"
                stroke="currentColor"
                stroke-width="1.55"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="arch__node-title">{{ t.pagesTitle }}</span>
          <span class="arch__node-meta">{{ t.pagesMeta }}</span>
        </div>

        <div class="arch__node arch__node--linked">
          <span class="arch__link-up" aria-hidden="true" />
          <span class="arch__node-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <circle
                cx="8"
                cy="12"
                r="2.4"
                stroke="currentColor"
                stroke-width="1.55"
              />
              <circle
                cx="16"
                cy="7.5"
                r="2.4"
                stroke="currentColor"
                stroke-width="1.55"
              />
              <circle
                cx="16"
                cy="16.5"
                r="2.4"
                stroke="currentColor"
                stroke-width="1.55"
              />
              <path
                d="M10.2 11.2 13.8 8.6M10.2 12.8 13.8 15.4"
                stroke="currentColor"
                stroke-width="1.55"
              />
            </svg>
          </span>
          <span class="arch__node-title">{{ t.hyperTitle }}</span>
          <span class="arch__node-meta">{{ t.hyperMeta }}</span>
        </div>

        <div class="arch__node">
          <span class="arch__node-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M5 8.5A3.5 3.5 0 0 1 8.5 5h7A3.5 3.5 0 0 1 19 8.5v7a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 5 15.5v-7Z"
                stroke="currentColor"
                stroke-width="1.55"
              />
              <path
                d="M9 12h6M12 9v6"
                stroke="currentColor"
                stroke-width="1.55"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <span class="arch__node-title">{{ t.r2Title }}</span>
          <span class="arch__node-meta">{{ t.r2Meta }}</span>
        </div>
      </div>
    </div>

    <div class="arch__trunk" aria-hidden="true" />

    <div class="arch__db">
      <span class="arch__node-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <ellipse
            cx="12"
            cy="6.5"
            rx="7"
            ry="2.5"
            stroke="currentColor"
            stroke-width="1.55"
          />
          <path
            d="M5 6.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11"
            stroke="currentColor"
            stroke-width="1.55"
          />
          <path
            d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"
            stroke="currentColor"
            stroke-width="1.55"
          />
        </svg>
      </span>
      <div class="arch__db-text">
        <span class="arch__node-title">{{ t.pgTitle }}</span>
        <span class="arch__node-meta">{{ t.pgMeta }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.arch {
  --arch-ink: var(--vp-c-text-1);
  --arch-muted: var(--vp-c-text-2);
  --arch-line: var(--vp-c-divider);
  --arch-surface: color-mix(in srgb, var(--vp-c-bg-soft) 72%, var(--vp-c-bg));
  --arch-edge: color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-bg-soft));
  --arch-accent: var(--vp-c-brand-1);

  margin: 1.25rem 0 1.75rem;
  padding: 1.25rem 1.1rem 1.35rem;
  border: 1px solid var(--arch-line);
  border-radius: 14px;
  background:
    radial-gradient(
      120% 80% at 10% 0%,
      color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent),
      transparent 55%
    ),
    var(--arch-surface);
  color: var(--arch-ink);
  overflow-x: clip;
}

.arch__actors {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-bottom: 0.85rem;
}

.arch__actor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 28px;
  align-items: center;
  gap: 0.65rem;
  max-width: 280px;
}

.arch__actor-label {
  grid-column: 1 / -1;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--arch-muted);
}

.arch__actor-name {
  font-size: 0.92rem;
  font-weight: 600;
}

.arch__arrow {
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--arch-accent) 15%, transparent),
    var(--arch-accent)
  );
  position: relative;
}

.arch__arrow::after {
  content: "";
  position: absolute;
  right: -1px;
  top: 50%;
  width: 7px;
  height: 7px;
  border-right: 2px solid var(--arch-accent);
  border-top: 2px solid var(--arch-accent);
  transform: translateY(-50%) rotate(45deg);
}

.arch__edge {
  border: 1px solid color-mix(in srgb, var(--arch-accent) 28%, var(--arch-line));
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 70%, transparent);
  padding: 0.9rem 0.9rem 1rem;
  box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 6%, transparent);
}

.arch__edge-head {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.85rem;
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--arch-accent);
}

.arch__edge-mark {
  display: inline-flex;
  color: var(--arch-accent);
}

.arch__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.arch__node {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  padding: 0.85rem 0.8rem 0.8rem;
  border-radius: 10px;
  border: 1px solid var(--arch-line);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 55%, var(--vp-c-bg));
}

.arch__node--accent {
  border-color: color-mix(in srgb, var(--arch-accent) 40%, var(--arch-line));
  background: color-mix(in srgb, var(--arch-accent) 8%, var(--vp-c-bg));
}

.arch__node-icon {
  display: inline-flex;
  margin-bottom: 0.35rem;
  color: var(--arch-accent);
}

.arch__node:not(.arch__node--accent) .arch__node-icon {
  color: var(--arch-muted);
}

.arch__node-title {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.arch__node-meta {
  font-size: 0.78rem;
  color: var(--arch-muted);
  line-height: 1.35;
}

.arch__link-up {
  position: absolute;
  top: -0.7rem;
  left: 1.35rem;
  width: 2px;
  height: 0.7rem;
  background: color-mix(in srgb, var(--arch-accent) 55%, var(--arch-line));
}

.arch__trunk {
  width: 2px;
  height: 1.1rem;
  margin: 0 auto;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--arch-accent) 55%, var(--arch-line)),
    var(--arch-line)
  );
}

.arch__db {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 420px;
  margin: 0 auto;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--arch-line);
  background: color-mix(in srgb, var(--vp-c-bg) 65%, var(--vp-c-bg-soft));
}

.arch__db .arch__node-icon {
  color: var(--arch-muted);
  flex-shrink: 0;
}

.arch__db-text {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
}

@media (max-width: 560px) {
  .arch {
    padding: 1rem 0.85rem 1.15rem;
  }

  .arch__grid {
    grid-template-columns: 1fr;
  }

  .arch__link-up {
    display: none;
  }

  .arch__actor {
    max-width: none;
  }
}
</style>
