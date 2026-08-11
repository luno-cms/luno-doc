---
title: Contact
description: LUNO Contact — intake, autoreply, notifications, contact.luno.rest. Done-state checklist and do-now steps.
prev:
  text: Content
  link: /en/products/content
next:
  text: Embed & Pub
  link: /en/products/embed
---

# Contact

Handle contact **intake, notifications, and auto-replies**. POST from your frontend to the public API, or host on `contact.luno.rest`.

## What you have (done state)

| Item | State |
|---|---|
| Form | At least one contact form with a slug |
| Submit | `POST …/contact-forms/{slug}/submit` returns 200 |
| Inbox | Submission visible in Console |
| (Optional) | Autoreply, chat notify, or hosted page works |

## When to use

- Site contact or lead forms
- Chat or CRM notifications on submit
- When you do not want to build the form UI yourself

## Checklist

- [ ] Created a contact form in Console and chose a slug
- [ ] Test submit returns `ok: true` and `submissionId`
- [ ] Submission appears in the Console inbox
- [ ] (Optional) Autoreply or Slack (etc.) notification arrives

## Do this now

1. Console → **Contact forms → New** (fields + notify addresses)
2. Send a test submit

::: code-group

```bash [curl]
curl -X POST "https://api.luno.rest/public/p/{projectId}/v1/contact-forms/contact/submit" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"hello"}'
```

```ts [JS]
await fetch(
  'https://api.luno.rest/public/p/{projectId}/v1/contact-forms/contact/submit',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test',
      email: 'test@example.com',
      message: 'hello',
    }),
  }
)
```

```bash [MCP]
# "Submit a test contact form and confirm it arrived"
```

:::

3. Implementation details: [Contact forms](/en/guide/contact-forms)

## Next

| Goal | Page |
|---|---|
| Submit API & frontend examples | [Contact forms](/en/guide/contact-forms) |
| Public API | [Public API · API only](/en/api/public-api#api-only) |
| Build via MCP (path A) | [Agents done state](/en/guide/paths/agents) |
