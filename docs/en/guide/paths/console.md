---
title: Path B · Console — Done state
description: What you have after ~10 minutes in the admin console, plus a checklist.
prev:
  text: Path A · Agents
  link: /en/guide/paths/agents
next:
  text: Quick start (steps)
  link: /en/guide/getting-started#console
---

# Path B · Console — Done state

In about 10 minutes you have **one published entry in Console and the same content readable from the Public API**.

## What you have

| Item | State |
|---|---|
| Sign-in | Logged into Console |
| Entry | At least one **Published** entry (draft → review → publish) |
| Delivery | List / single entry work on the Public API |
| Mental model | Sidebar roles (form sets, media, settings) are clear |

## Checklist

1. You can sign in at [Console](https://console.luno.rest/login)
2. An entry in a form set is **Published**
3. One of these returns JSON

```bash
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/{slug}/entries?include_snapshot=true"
```

4. (Optional) Tried scheduled publish or a preview link once

## Next

| Goal | Page |
|---|---|
| Step-by-step | [Quick start · Console](/en/guide/getting-started#console) |
| Approvals & revisions | [Content management](/en/guide/content-management) |
| Operate with agents | [Path A · Agents](/en/guide/paths/agents) |
| Frontend only | [Path C · API only](/en/guide/paths/api) |
