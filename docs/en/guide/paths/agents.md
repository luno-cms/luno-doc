---
title: Path A · Agents (MCP) — Done state
description: Start path A · Agents (MCP). Done state after ~5 minutes, checklist, and do-now steps.
prev:
  text: Quick start
  link: /en/guide/getting-started
next:
  text: AI Agents overview
  link: /en/products/agents
---

# Path A · Agents (MCP) — Done state

In about 5 minutes you can **operate LUNO from your site repo via an agent**.

## What you have

| Item | State |
|---|---|
| MCP | Connected in Cursor / Claude Code / Codex |
| Keys | Split across `.agents/luno/{dev,stg,prod}.env` |
| Scope | Prefer `full` (or `content` / `schema`) |
| Ops | List / create / publish entries and inspect schema from chat |

## Checklist

- [ ] `npx @luno-cms/mcp setup` completed
- [ ] Agent key (`sk-agent-…`) set via `env set-key`
- [ ] “List published blog entries” returns a real response
- [ ] (Optional) Public structure readable via `llms.txt`

## Do this now

Follow in order to reach the done state.

1. Run setup from your site repo root

```bash
cd my-existing-site
npx @luno-cms/mcp setup
# → 1) Claude Code  2) Cursor  3) Codex
```

2. Create a key in Console **Settings → Agent API keys**, then store it

```bash
npx @luno-cms/mcp env set-key stg 'sk-agent-…'
npx @luno-cms/mcp env switch stg
npx @luno-cms/mcp env status
```

3. Ask your agent: “List published entries in the blog form set”
4. If stuck, open the [AI agents guide](/en/api/ai-agents) setup section

## Next

| Goal | Page |
|---|---|
| Full setup | [AI agents guide](/en/api/ai-agents) |
| Product overview | [AI Agents](/en/products/agents) |
| Path B · Console | [Done state](/en/guide/paths/console) |
| Path C · API only | [Done state](/en/guide/paths/api) |
