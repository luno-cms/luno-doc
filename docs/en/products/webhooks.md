---
title: Webhooks
description: LUNO Webhooks — publish events, HMAC signatures, manual redelivery. Done-state checklist and do-now steps.
prev:
  text: AI Agents
  link: /en/products/agents
next:
  text: Masters
  link: /en/products/masters
---

# Webhooks

Notify HTTPS endpoints about entry and master publish lifecycle events with **HMAC signatures**. Use them for ISR or external sync (Standard plan+).

## What you have (done state)

| Item | State |
|---|---|
| Endpoint | HTTPS receiver URL is ready |
| Webhook | Created in Console; events subscribed |
| Verify | `X-Luno-Signature` verified over the raw body |
| Follow-up | Body fetched via Public API; revalidate (etc.) runs |

## When to use

- Cache revalidation for Next.js and similar stacks
- Notify Slack or your own workers
- Update search indexes or CDN on publish

## Checklist

- [ ] Registered URL + events under Console **Settings → Webhooks**
- [ ] Stored the secret in env (shown only once)
- [ ] Test publish shows a successful delivery
- [ ] After verify, you can refetch the body from Public API

## Do this now

1. Prepare a receiver URL (e.g. `/api/webhook/luno`)
2. Create a webhook in Console; subscribe to `entry.published` (etc.)
3. Publish an entry and confirm delivery history
4. Refetch the body after delivery (payload has no `data`)

::: code-group

```bash [curl]
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/blog/entries/my-first-post?include_snapshot=true"
```

```ts [JS]
const { project_id, form_set_slug, entry_slug } = payload
const res = await fetch(
  `https://api.luno.rest/public/p/${project_id}/v1/form-sets/${form_set_slug}/entries/${entry_slug}?include_snapshot=true`
)
```

```bash [MCP]
# "Write a signed entry.published handler that revalidates /blog"
```

:::

5. Signature code: [Webhooks reference](/en/api/webhooks)

## Next

| Goal | Page |
|---|---|
| Payload, signatures, examples | [Webhooks reference](/en/api/webhooks) |
| Scheduled publishing | [Scheduled publishing](/en/guide/schedule) |
| Read-only path C | [API only done state](/en/guide/paths/api) |
