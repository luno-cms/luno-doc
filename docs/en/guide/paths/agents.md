---
title: Path A · Agents (MCP) — Done state
description: Start path A · Agents (MCP). Done state after ~5 minutes, checklist, and do-now steps.
prev:
  text: Quick start
  link: /en/guide/getting-started
next:
  text: Done state B · Console
  link: /en/guide/paths/console
---

# Path A · Agents (MCP) — Done state

In about 5 minutes you can **operate LUNO from your site repo via an agent**.

## What you have

| Item | State |
|---|---|
| MCP | Connected in Cursor / Claude Code / Codex (**Verified**) |
| Keys | In `.agents/luno/` (gitignored). Public default is **prod** |
| Scope | Prefer `full` (or `content` / `schema`) |
| First ask | List form sets or draft one entry — not publish |

## Checklist

- [ ] `npx @luno-cms/mcp setup` completed (browser confirm)
- [ ] Agent approved workspace trust / MCP
- [ ] “List the form sets on this LUNO, or draft one entry. Don't publish or change the schema.” returns a real response
- [ ] (Optional) Public structure readable via `llms.txt`

## Do this now

Follow in order to reach the done state.

1. Run setup from your site repo root

```bash
cd my-existing-site
npx @luno-cms/mcp setup
# → browser confirm → healthcheck against production
```

Do not paste a key into the agent chat.

2. Open the project in the chosen agent and approve trust / MCP if prompted

3. Ask:

```
List the form sets on this LUNO, or draft one entry. Don't publish or change the schema.
```

Later: teammates run `npx @luno-cms/mcp login`. Use `--env stg` only if you have access.

4. If stuck, open the [AI agents guide](/en/api/ai-agents) setup section

## Next

| Goal | Page |
|---|---|
| Full setup | [AI agents guide](/en/api/ai-agents) |
| Product overview | [AI Agents](/en/products/agents) |
| Path B · Console | [Done state](/en/guide/paths/console) |
| Path C · API only | [Done state](/en/guide/paths/api) |
