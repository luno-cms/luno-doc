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
| MCP | Browser-confirmed setup. Connected ≠ activated. |
| Keys | In `.agents/luno/` (gitignored). Public default is **prod** |
| Scope | Prefer `full` (or `content` / `schema`) |
| First ask | List form sets or draft one entry — not publish |

## Activation

Connected is not activated.

- **Agent activated:** browser-confirmed `npx -y @luno-cms/mcp setup` **and** the first meaningful backend mutation (model or publish) remains on the record Console can open.
- **Human activated:** they hold a Free site **and** can open that same record in Console.

Do not treat MCP connectivity alone as task success. The human registers the tenant — the agent does not create it.

## Checklist

- [ ] `npx -y @luno-cms/mcp setup` completed (browser confirm)
- [ ] Agent approved workspace trust / MCP
- [ ] “List the form sets on this LUNO, or draft one entry. Don't publish or change the schema.” returns a real response
- [ ] Console can open the record the agent just created (draft or publish) — a read-only response is not activation
- [ ] (Optional) Public structure readable via `llms.txt`

## Do this now

Follow in order to reach the done state.

1. Run setup from your site repo root

```bash
cd my-existing-site
npx -y @luno-cms/mcp setup
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
