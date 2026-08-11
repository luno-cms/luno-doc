---
title: Public API keys
description: LUNO public API keys (luno_pub_…) — issue, headers, and how they differ from agent keys. Done-state checklist and do-now steps.
prev:
  text: Masters
  link: /en/products/masters
next:
  text: Localization
  link: /en/products/localization
---

# Public API keys

Keys for reading published content and Embed. Prefix: **`luno_pub_…`**. They are not agent keys (`sk-agent-…`).

## Done state

| Item | State |
|---|---|
| Key | Issued `luno_pub_…` and stored safely (shown once) |
| Call | Can call with header or Bearer |
| Separation | Not confusing Embed/Host keys with Agents `sk-agent-…` |

## vs agent keys

| | Public API key | Agent API key |
|---|---|---|
| Prefix | `luno_pub_…` | `sk-agent-…` |
| Use | Public read / Embed / Host tenant resolve | Admin API / MCP |
| Base | `/public/...` | `/admin/v1` |
| Issue | Settings → **Public API keys** | Settings → **Agent API keys** |
| Plan | All plans | **Standard+** |

## When you need one

- **Embed / widgets** — required in `data-api-key`
- **Host** `/public/v1` when resolving tenant by key
- **`/public/p/{projectId}/v1`** — usually no key for reads when projectId is in the path

## Checklist

- [ ] Issued under Console → **Settings → Public API keys** (`tenant_admin`)
- [ ] Copied immediately (cannot re-display)
- [ ] Embed uses `data-api-key`; server fetches use env + header
- [ ] Not sending an agent key to Public API routes

## Do this now

1. Create a key under **Settings → Public API keys** and copy `luno_pub_…`
2. Smoke-test a call

::: code-group

```bash [curl]
curl -H "X-Luno-Public-Api-Key: luno_pub_…" \
  "https://api.luno.rest/public/v1/form-sets/blog/entries?limit=1"
# Or projectId path (usually no key)
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries?limit=1"
```

```ts [JS]
await fetch('https://api.luno.rest/public/v1/form-sets/blog/entries?limit=1', {
  headers: { 'X-Luno-Public-Api-Key': process.env.LUNO_PUBLIC_API_KEY! },
})
// Authorization: Bearer luno_pub_… also works
```

```bash [MCP]
# Public keys are not used by MCP. Agent keys: Settings → Agent API Keys
```

:::

3. For Embed see [Embed & Pub](/en/products/embed); for frameworks see [recipes](/en/guide/frameworks/)

## Next

| Goal | Page |
|---|---|
| Endpoints | [Public API](/en/api/public-api#api-only) |
| Embed | [Embed & Pub](/en/products/embed) |
| Agents (different key) | [AI Agents](/en/products/agents) |
| Plan gates | [Plans](/en/products/plans) |
