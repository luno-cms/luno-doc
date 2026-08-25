---
title: Changelog
description: Notable updates to LUNO docs and public specifications.
---

# Changelog

Docs and public-spec updates, newest first. For platform uptime, see [Status](https://status.luno.rest).

## 2026-08-25

- Docs Home leads with hosted AI-era Backend Platform + Agent Backend (BUILD / OPERATE / GOVERN); Headless CMS stays a capability
- AI Agents Guide: agent lifecycle before integration models; MCP wording no longer says “your CMS”
- New [Production Safety for AI Agents](/en/guide/production-safety) (scopes, approval, Change Plans, dryRun, idempotency, audit)
- `llms.txt` Product Identity + Core Model; points to https://luno.rest/llms.txt for product/security
- Headless CMS product page: capability vs category + link to Docs Home

## 2026-08-11

- Replaced self-hosting ASCII architecture with a visual diagram
- Removed Plans overview from docs; pricing stays on luno.rest
- Renamed products to Headless CMS / Contact Form; synced top nav dropdowns with sidebar IA
- Split hub Connect into Framework / AI Agent lists with official icons (Neon-style, no cards)
- Rebuilt sidebar IA to match Console (Start / Content / Deliver & Contact / Connect & Automate / Site & Plans)
- Hub: Products (thin icons) + Platform, Neon-style presentation
- Added Neon-style sidebar section icons and start-card play badges
- Coverage: Masters / Public API keys / Localization / Plans overviews
- Added thin framework recipes (Next.js / Astro / Nuxt) and wired Connect, sidebar, and llms.txt
- Added 3-line do-now tips on AI Assist
- Separated hub copy buttons from card links and hardened copy feedback
- Bumped GitHub Actions majors (checkout / setup-node / pnpm-action) to clear Node 20 warnings
- Added 3-line do-now tips on Media, SEO, and Scheduled publishing
- Fixed hub mobile horizontal overflow from long copy commands
- Pinned `packageManager` (pnpm@10) in package.json to match CI
- Added 3-line do-now tips on Content management and Form builder
- Rewired Prev/Next: start → done states A/B/C → product overviews → deep guides
- Documented Changelog ops rules in README
- Aligned Content / Embed overviews to the done-state pattern; collapsed done-state group in the sidebar
- Added start paths A/B/C and Products list to `llms.txt` (search / agent keyword sync)
- Added do-now steps and checklists on path done-state pages
- Aligned Contact / Webhooks overviews to the done-state pattern
- Tuned titles/descriptions for path keywords (Agents / Console / API only)
- Added path done-state pages (Agents / Console / API only)
- Extended curl / JS / MCP (or HTML) tabs to Contact, Embed, and Webhooks
- Aligned hub JA/EN copy, card density, and CTAs; start cards link to done states
- Product hub: Connect logo grid, start paths A / B / C, and product overviews
- Grouped Public API and Quick start examples into curl / JS / MCP tabs
- Synced webhook payload and agent scopes with the product
- Documented `/public/p/{projectId}/v1` as the recommended Public API base

## Earlier

- Guides for Public API, self-hosting, embed, and contact
- Published `llms.txt` and docs-site `llms-full.txt`
