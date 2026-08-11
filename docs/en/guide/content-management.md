---
title: Content Management
description: How to manage entries and revisions in luno HCMS — the full approval workflow, scheduled publishing, preview links, localization, and slug redirects.
prev:
  text: Plans
  link: /en/products/plans
next:
  text: Form builder
  link: /en/guide/form-builder
---

# Content Management

luno organizes content around **Entries** and **Revisions**. This page explains the full lifecycle from draft creation through publishing, and the features available at each stage.

::: tip Do this now (3 lines)
1. Check the done state on [Headless CMS overview](/en/products/content)  
2. In Console, move draft → (review) → **Published**  
3. Confirm the Public API list returns with `include_snapshot=true`  
:::

## Entries and Revisions

```
Form Set (content type)
  └── Entry  (individual content item, identified by slug)
        └── Revision  (a version of the entry, owns the approval workflow)
              └── Snapshot  (the field values at that revision)
```

- An **Entry** is a single piece of content — an article, page, product, etc. It is identified by a URL-safe `slug`.
- A **Revision** represents the content at a specific point in time. Every save creates or updates a revision.
- The **public API** only returns `published` revisions. All other statuses are invisible to the public.

## Revision Statuses

| Status | Description | Visible via public API |
|---|---|:---:|
| `draft` | Work in progress | — |
| `pending_review` | Submitted for approval, awaiting a reviewer | — |
| `scheduled` | Approved, will auto-publish at the specified time | — |
| `published` | Live and returned by the public API | ✓ |
| `rejected` | Returned for rework | — |
| `superseded` | Replaced by a newer published revision | — |

## Approval Workflow

```
draft
  │
  ├─[submit_for_review]──→ pending_review
  │                              │
  │                    ┌─────────┴──────────┐
  │           [approve, now]    [approve, with date]
  │                    │                    │
  │                published           scheduled
  │                                         │
  │                               [Cron, ~every 5 minutes]
  │                                         │
  │                                     published
  │
  └─[reject]──→ rejected ──[reopen]──→ draft
```

### Rejection flow

When content needs rework:

1. Reviewer clicks **Reject** → status becomes `rejected`
2. Editor clicks **Reopen** → status returns to `draft`
3. Editor revises and submits again

### Withdrawal

An editor can cancel a pending review by clicking **Withdraw** (`pending_review` → `draft`), without going through the rejected state.

## Roles and Permissions

| Role | What they can do |
|---|---|
| `tenant_admin` | All operations, including approve, publish, and settings |
| `tenant_user` | Create, edit, and submit for review |

::: tip Legacy roles
The `editor` and `reviewer` aliases exist for backward compatibility, but both map to `tenant_user` permissions. Approval and publishing require `tenant_admin`.
:::

## Working with Entries

### Creating an entry

1. Click a form set in the sidebar
2. Click **New Entry**
3. Set the `slug` (auto-generated but customizable)
4. Fill in the fields and click **Save**

::: warning Slug naming
The slug appears in the public API URL: `/public/v1/form-sets/blog/entries/your-slug`. Use only lowercase letters, numbers, and hyphens. Avoid changing slugs after publishing — while luno creates automatic 301 redirects, it's better to get the slug right the first time.
:::

### Editing and auto-save

Changes in the editor are auto-saved to the current `draft` revision. Editing a published entry does not affect the live content — it creates a new `draft` alongside the existing `published` revision.

### Duplicating an entry

Duplicate creates a new `draft` with all field values copied. The slug is set to `{original-slug}-copy`. Useful for templating similar entries.

### Deleting an entry

Deleting an entry removes all its revisions and snapshots. A previously published entry will return `404` from the public API after deletion.

## Scheduled Publishing

Set a future date and time when approving an entry to use scheduled publishing.

```
Approve → scheduled (publish_at = 2025-02-01T00:00:00Z)
              ↓  Cron job (~every 5 minutes)
          published (once publish_at passes)
```

### Timezone handling

The admin panel shows and accepts times in your browser's local timezone. Internally, times are stored as UTC.

### Cron precision

The Cron job runs **about every 5 minutes**, so the actual publish time may lag by up to about 5 minutes. For second-level precision, scheduled publishing is not suitable.

### Canceling a schedule

A `scheduled` revision can be canceled by:
- **Reject** → moves to `rejected`
- **Withdraw** → moves back to `draft`

Both options cancel the automatic publishing.

### Bulk scheduling

Select multiple entries in the entry list and use **Bulk actions → Schedule** to set the same publish time for all of them at once.

## Preview Links

Share unpublished content with stakeholders before publishing using preview links.

```
GET /public/v1/preview/revisions?token=<JWT>
```

| Property | Value |
|---|---|
| Validity | 15 minutes (JWT-signed token) |
| Scope | All statuses, including drafts |
| Auth required | Token only — no separate login needed |
| After expiry | Returns 401 |

Generate a preview link from the entry edit page by clicking **Generate Preview Link**.

```bash
curl "https://your-domain.com/public/v1/preview/revisions?token=eyJhbGci..."
```

## Slug and Automatic Redirects

When you rename an entry's slug, luno automatically creates a **301 redirect** from the old slug to the new one. This preserves search engine rankings and prevents broken links.

```
Old: GET /public/v1/form-sets/blog/entries/old-slug
→  HTTP 301 Moved Permanently
   Location: /public/v1/form-sets/blog/entries/new-slug
```

Your frontend should follow redirects (the default behavior of `fetch` with `redirect: 'follow'`).

## Localization

For the overview, plan limits, and AI translation, see [Localization](/en/products/localization).

With site locales enabled, `text` / `textarea` / `tiptap` fields are per-locale (use `locale_shared` when a value should be shared). Requests with `?locale=` receive the resolved value.

```bash
# Get content in Japanese
curl "https://your-domain.com/public/v1/form-sets/blog/entries/my-post?locale=ja"

# Get content in English
curl "https://your-domain.com/public/v1/form-sets/blog/entries/my-post?locale=en"
```

If the requested locale doesn't have a value, the default locale's value is returned.

### Editing localized content

In the admin panel, localizable fields show language tabs. Each tab holds an independent value for that locale.

## Assignee (Business plan+)

On Business plans and above, assign entries to specific team members. The assigned user receives notifications when the entry's status changes.

## Duplicate and CSV Export

- **Duplicate**: Create a new draft from an existing entry (all fields copied)
- **CSV Export**: Download the full entry list including field values as a CSV file

## Next Steps

- [Form Builder](/en/guide/form-builder) — Design content types with typed fields
- [Scheduled Publishing](/en/guide/schedule) — Detailed scheduling guide
- [Public API Reference](/en/api/public-api) — API endpoint specifications
