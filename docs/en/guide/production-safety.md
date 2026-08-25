---
title: Production Safety for AI Agents
description: How LUNO bounds agent authority on production backends—scopes, approval, destructive limits, dryRun, idempotency, and audit.
prev:
  text: AI Agents (MCP) guide
  link: /en/api/ai-agents
next:
  text: AI Agents overview
  link: /en/products/agents
---

# Production Safety for AI Agents

AI agents can operate production backends, but authority is explicitly bounded.

LUNO is not optimized for giving agents more permissions. It is optimized for making production autonomy **governable**.

This page consolidates controls that already exist in product. It does not invent a policy DSL or claim that other platforms lack permissions.

Product / security overview: [luno.rest Security](https://luno.rest/en/security). Agent setup: [AI Agents Guide](/en/api/ai-agents). Home model: [Docs Home · Agent Backend](/en/#agent-backend).

## Scoped access

Agent API keys (`sk-agent-…`) are bound to the project that issued them.

| Scope | What it can do |
|---|---|
| **`full`** (recommended) | Entries, media, Form Set / Contact / Blueprint |
| **`content`** | Entries, revisions, publish, media. Schema writes return **403** |
| **`schema`** | Compatibility alias of `full` |

No agent key can issue other keys, invite members, or change billing. Keys are rate-limited (Free: 60 req / 60s per key).

## Human approval

Production publish is a human-governed path, not an unbounded agent default.

- Entries move **draft → pending_review → published**
- `submit_entry_for_review` asks a human to approve
- **Change Plans** represent multi-step intent (for example blueprint apply + publish) as one plan: **Intent → Change Plan → Human Approval → Execute → Observe → Recover**
- Agents may **propose** plans using dry-run previews; humans **approve or reject** in Console
- Plan approval does not bypass scopes, confirm tokens, or publish separation-of-duties
- Rejection leaves production resources unchanged

## Destructive actions

Agent keys cannot silently mass-delete production structure.

- Form Sets and Contact Forms **cannot be deleted** with an agent key
- Form blocks and field definitions **cannot be deleted** with an agent key
- Destructive MCP operations require explicit confirmation (Trust Layer)

## Preview (dryRun)

Schema apply tools accept **`dryRun: true`** and return a preview without writing to the database:

- `apply_form_blueprint`
- `apply_master_blueprint`
- `apply_builtin_form_template`

Use preview before asking a human to approve a Change Plan.

## Safe retries (idempotency)

Agents may pass `idempotencyKey` (or `Idempotency-Key`) on major creates. Replaying the **same** key after a timeout returns the original result instead of a second write.

| Tool | Same-key replay |
|---|---|
| `apply_form_blueprint` / `apply_builtin_form_template` | Same 201 body |
| `create_entry` | Same entry `id` |
| `save_revision` | Same revision row |
| `create_contact_form` | Same `id` |
| `publish_revision` | Existing `already_published` + outbox dedupe |

When `error.retryable` is `false`, change input before calling again.

## Auditability

Agent actions share the **same operational trail** as humans:

- Agent Activity / audit logs attribute work to the agent key
- Review, approval, and rejection are visible in Console
- This is not a separate SIEM product

## Next

| Goal | Page |
|---|---|
| Setup and tools | [AI Agents Guide](/en/api/ai-agents) |
| Home model | [Docs Home](/en/#agent-backend) |
| Product security | [luno.rest Security](https://luno.rest/en/security) |
