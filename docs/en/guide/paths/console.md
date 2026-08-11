---
title: Path B · Console — Done state
description: Start path B · Console. Done state after ~10 minutes, checklist, and do-now steps.
prev:
  text: Done state A · Agents
  link: /en/guide/paths/agents
next:
  text: Done state C · API only
  link: /en/guide/paths/api
---

# Path B · Console — Done state

In about 10 minutes you have **one published entry in Console and the same content readable from the Public API**.

## What you have

| Item | State |
|---|---|
| Sign-in | Logged into Console |
| Entry | At least one **Published** entry |
| Delivery | List / single entry work on the Public API |
| Mental model | Sidebar roles (form sets, media, settings) are clear |

## Checklist

- [ ] You can sign in at [Console](https://console.luno.rest/login)
- [ ] An entry is **Published**
- [ ] Public API returns JSON for that form set
- [ ] (Optional) Tried scheduled publish or a preview link

## Do this now

1. [Sign in to Console](https://console.luno.rest/login) (invite email or Google)
2. Open a form set → **New entry** → Save (draft)
3. Move status **Submit for review → Approve → Publish** (admins can publish immediately)
4. Verify via Public API

```bash
curl "https://api.luno.rest/public/p/{projectId}/v1/form-sets/{slug}/entries?include_snapshot=true"
```

5. For UI walkthrough details, see [Quick start · Console](/en/guide/getting-started#console)

## Next

| Goal | Page |
|---|---|
| Step-by-step | [Quick start · Console](/en/guide/getting-started#console) |
| Approvals & revisions | [Content management](/en/guide/content-management) |
| Path A · Agents | [Done state](/en/guide/paths/agents) |
| Path C · API only | [Done state](/en/guide/paths/api) |
