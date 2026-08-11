---
title: Plans
description: LUNO plan boundaries — quick matrix for Standard / Business features (webhooks, search, AI translation, and more).
prev:
  text: Localization
  link: /en/products/localization
next:
  text: Content management
  link: /en/guide/content-management
---

# Plans

Features unlock by plan. Check **Settings → Plan** in Console and upgrade only what you need. Pricing details: [luno.rest](https://luno.rest).

## Done state

| Item | State |
|---|---|
| Current plan | Know Free / Solo / Standard / Business (or Enterprise / Agency Workspace) |
| Required features | Know the minimum plan for each capability you need |
| Errors | Can map `PLAN_REQUIRED` to the table below |

## Quick matrix (code gates)

### Standard+

| Feature | Notes |
|---|---|
| Webhooks | Create + deliver |
| Agent API keys | `sk-agent-…` / MCP |
| AI locale translation | ~1 AI ticket per run when billing is on |
| Scheduled publishing | Approve + schedule |
| Unpublished preview | Preview JWT, etc. |
| Audit logs | Activity history |
| Shared login branding | Login screen branding |

### Business+

| Feature | Notes |
|---|---|
| Public API full-text `?q=` | Entry lists |
| `entry_ref` fields | Form Sets |
| Assignees | Entry ops |
| Console login IP allowlist | Console |
| Whitelabel | Hide Powered by, etc. |

### All plans

| Feature | Notes |
|---|---|
| Public API read / Embed / Pub | `/public/...` |
| Public API key issue | `luno_pub_…` |
| Content locales | Locale count differs (Free: 2 / others: 3) |
| MCP package usage (keys need Standard+) | Package is public |

::: warning Solo and Webhooks
Webhooks require **Standard+** (not available on Solo).
:::

## Checklist

- [ ] Checked current plan under **Settings → Plan**
- [ ] Considered Standard+ for ISR / outbound notify
- [ ] Considered Business+ for Public API `q` search or `entry_ref`
- [ ] Know Agents (MCP) need Standard+ to issue agent keys

## Do this now

1. Open Console → **Settings → Plan**
2. Match only the features you need (no need to buy everything)
3. Upgrade if required, then return to the matching guide

| Goal | Minimum | Next page |
|---|---|---|
| Rebuild on publish | Standard | [Webhooks](/en/products/webhooks) |
| MCP / agents | Standard | [AI Agents](/en/products/agents) |
| AI locale translation | Standard | [Localization](/en/products/localization) |
| `?q=` search | Business | [Public API](/en/api/public-api) |
| `entry_ref` | Business | [Form builder](/en/guide/form-builder) |

## Next

| Goal | Page |
|---|---|
| Public read (path C) | [API only done state](/en/guide/paths/api) |
| Product map | [Product hub](/en/) |
| Pricing details | [luno.rest](https://luno.rest) |
