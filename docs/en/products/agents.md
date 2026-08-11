---
title: AI Agents
description: Overview of LUNO AI agent integration — MCP, agent API keys, and llms.txt.
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
| Full setup guide | [AI agents guide](/en/api/ai-agents) |
| Read public content only | [Public API](/en/api/public-api) |
| Operate in Console | [Quick start](/en/guide/getting-started#console) |

```bash
npx @luno-cms/mcp setup
```
