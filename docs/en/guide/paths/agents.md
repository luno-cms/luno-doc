---
title: Path A · Agents — Done state
description: What you have after ~5 minutes with MCP, plus a checklist.
prev:
  text: Quick start
  link: /en/guide/getting-started
next:
  text: AI Agents overview
  link: /en/products/agents
---

# Path A · Agents — Done state

In about 5 minutes you can **operate LUNO from your site repo via an agent**.

## What you have

| Item | State |
|---|---|
| MCP | Connected in Cursor / Claude Code / Codex |
| Keys | Split across `.agents/luno/{dev,stg,prod}.env` |
| Scope | Prefer `full` (or `content` / `schema` as needed) |
| Ops | List / create / publish entries and inspect schema from chat |

## Checklist

1. `npx @luno-cms/mcp setup` completed
2. Agent key (`sk-agent-…`) set via `env set-key`
3. Ask the agent “List published blog entries” and get a real response
4. (Optional) Read public structure via `llms.txt`

```bash
npx @luno-cms/mcp setup
npx @luno-cms/mcp env status
```

## Next

| Goal | Page |
|---|---|
| Full setup | [AI agents guide](/en/api/ai-agents) |
| Product overview | [AI Agents](/en/products/agents) |
| Also use Console | [Path B · Console](/en/guide/paths/console) |
| Read-only public | [Path C · API only](/en/guide/paths/api) |
