---
title: Webhooks
description: Overview of LUNO webhooks — publish events, signature verification, and manual redelivery.
prev:
  text: AI Agents
  link: /en/products/agents
next:
  text: Content management
  link: /en/guide/content-management
---

# Webhooks

Notify HTTPS endpoints about entry and master publish lifecycle events with **HMAC signatures**. Use them to trigger ISR rebuilds or external sync.

## Capabilities

- Events: `entry.published` / `entry.updated` / `entry.deleted` / `master.published`
- Payload carries IDs, slug, and `timestamp` (no field body `data`)
- Verify with `X-Luno-Signature: sha256=…`
- Delivery history and **manual redelivery** (no automatic scheduled retries)
- Standard plan and above

## When to use

- Cache revalidation for Next.js and similar stacks
- Notify Slack or your own workers
- Update search indexes or CDN on publish

## Next steps

| Goal | Page |
|---|---|
| Payload, signatures, examples | [Webhooks reference](/en/api/webhooks) |
| Relation to scheduled publish | [Scheduled publishing](/en/guide/schedule) |
| Fetch body after publish | [Public API](/en/api/public-api) |
