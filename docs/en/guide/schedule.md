---
title: Scheduled Publishing
description: How scheduled publishing works in luno HCMS — setting a publish date, the Cron mechanism, canceling schedules, bulk scheduling, and Webhook integration.
---

# Scheduled Publishing

Scheduled publishing lets you approve content in advance and have it go live automatically at a specific date and time. Use it for press releases, campaign pages, time-sensitive announcements, or any content that needs to be published at a precise moment.

## How It Works

```
draft
  ↓ submit_for_review
pending_review
  ↓ approve (with a publish date)
scheduled  ←  publish_at = 2025-02-01T00:00:00Z (UTC)
  ↓  Cron job runs every minute
published  ←  once publish_at has passed
```

1. An editor submits the entry for review as usual
2. A `tenant_admin` approves and sets a **Publish Date**
3. The revision status becomes `scheduled`
4. A Cron job runs **every minute** and moves any revision past its `publish_at` to `published`
5. The entry becomes available via the public API

::: tip Cron precision
The Cron job runs every minute, so the actual publish time may lag by up to **60 seconds**. If you need second-level precision, scheduled publishing is not the right tool.
:::

## Setting Up a Schedule

### Step 1: Create and submit the entry

Create your entry and fill in the fields as normal, then click **Submit for Review**.

### Step 2: Approve with a publish date

As a `tenant_admin`:

1. Click **Approve** on the entry
2. Enable **Schedule Publishing**
3. Enter the desired publish date and time

```
Example input: February 1, 2025 at 9:00 AM  (in your local timezone)
Stored as:     2025-02-01T00:00:00Z           (UTC)
```

The admin panel always shows times in your browser's local timezone while storing them in UTC.

### Step 3: Confirm the schedule

In the entry list, the status column shows **scheduled**. Hovering over the status displays the exact scheduled publish time.

## Canceling a Schedule

A `scheduled` revision can be canceled in two ways:

### Reject

Moves the revision from `scheduled` → `rejected`. The entry is returned to the editor with a note.

```
scheduled → [reject] → rejected → [reopen] → draft
```

### Withdraw

Moves the revision from `scheduled` → `draft` directly, skipping the `rejected` state. Use this when you simply want to postpone or re-edit without a formal rejection.

Both options cancel the automatic publishing.

## Bulk Scheduling

To set the same publish time for multiple entries at once:

1. In the entry list, check the boxes next to the target entries (status must be `pending_review`)
2. Click **Bulk Actions → Schedule Publishing**
3. Enter the publish date and time
4. Confirm

::: warning Prerequisite
Bulk scheduling only works on entries already in `pending_review` status. Entries in `draft` must be submitted for review first.
:::

## Replacing Published Content at a Future Time

To swap the content of an already-published entry on a specific date:

1. Open the published entry and click **Edit (new revision)**
2. Make the desired changes
3. Submit for review and approve with a schedule date

Until the scheduled time, visitors see the currently published content. After the schedule time, the new revision goes live automatically. The old revision's status becomes `superseded`.

## Webhook on Scheduled Publish

When a `scheduled` revision auto-publishes, luno fires an `entry.published` Webhook event just like an immediate publish:

```json
{
  "event": "entry.published",
  "tenant_id": "project-uuid",
  "form_set_slug": "blog",
  "entry_slug": "my-scheduled-post",
  "entry_id": "entry-uuid",
  "published_at": "2025-02-01T00:00:00Z",
  "data": { ... }
}
```

Use this to trigger cache invalidation, send notifications, or sync content to external systems automatically at publish time. See [Webhooks](/en/api/webhooks) for setup details.

## Common Use Cases

| Use Case | Tips |
|---|---|
| **Press release** | Schedule for the exact embargo time. Approve days in advance. |
| **Campaign launch** | Bulk-schedule all campaign pages for the same datetime. |
| **Regular content** | Pre-approve weekly or monthly updates and schedule them months ahead. |
| **Global simultaneous publish** | Use UTC to ensure content goes live at the same moment worldwide. |

## Cron Setup (Self-hosting)

In a self-hosted environment, add the following Cron trigger to `apps/api/wrangler.toml`:

```toml
[triggers]
crons = ["* * * * *"]  # Run every minute
```

This registers a Cloudflare Workers Cron Trigger. The scheduled-to-published promotion runs as part of the Worker's `scheduled` handler.

See the [Deployment Guide](/en/self-hosting/deployment) for the full `wrangler.toml` configuration.

## Next Steps

- [Content Management](/en/guide/content-management) — Approval workflow and revision statuses
- [Webhooks](/en/api/webhooks) — Triggering actions at publish time
- [Deployment Guide](/en/self-hosting/deployment) — Configuring Cron in self-hosted environments
