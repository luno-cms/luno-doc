---
title: AI Agents · Path A (MCP)
description: Start path A · Agents (MCP). Overview of MCP setup, agent keys, llms.txt, and link to the done state.
prev:
  text: Embed & Pub
  link: /en/products/embed
next:
  text: Webhooks
  link: /en/products/webhooks
---

# AI Agents

Operate LUNO content and schema from agents such as Cursor, Claude Code, and Codex. The canonical package is [`@luno-cms/mcp`](https://www.npmjs.com/package/@luno-cms/mcp).

## Capabilities

- **`npx @luno-cms/mcp setup`** — one-command connect in an existing site repo
- Keys separated in `.agents/luno/{dev,stg,prod}.env`
- Scopes **`full` / `content` / `schema`**
- Entry CRUD and publish, Blueprint / template apply, media upload, and more
- Per-site **`llms.txt`** for discovering public content

## When to use

- Let agents draft and update articles
- Bootstrap Form Sets / Contact from chat
- Switch local / staging / production per environment

## Next steps

| Goal | Page |
|---|---|
| Done state · do now | [Path A · Agents done state](/en/guide/paths/agents) |
| Full setup | [AI Agents (MCP) guide](/en/api/ai-agents) |
| Path C · API only | [Done state](/en/guide/paths/api) |
| Path B · Console | [Done state](/en/guide/paths/console) |

```bash
npx @luno-cms/mcp setup
```
