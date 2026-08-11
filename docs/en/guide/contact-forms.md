---
title: Contact Forms
description: Set up contact forms in luno HCMS, submit them from the public API, handle email notifications, and integrate with your frontend in vanilla JS, React, or Next.js.
---

# Contact Forms

luno's contact form feature lets you receive form submissions in the admin panel with automatic email notifications. From your frontend, a single `POST` request is all you need.

## Creating a Form

Go to **Contact Forms → New Form** in the admin panel.

### Basic settings

| Setting | Description | Example |
|---|---|---|
| **Name** | Display name in the admin panel | `Contact Form` |
| **Slug** | API identifier (URL-safe) | `contact` |
| **Notification email(s)** | Recipients when a submission arrives | `info@example.com` |
| **Reply-to field** | Field key to use as the Reply-To address | `email` |
| **Spam protection** | Enable honeypot field | Recommended: enabled |

### Defining fields

Define the fields your form accepts. The field **key** must match the `name` attribute of the corresponding `<input>` in your HTML form.

**Common field setup:**

| Key | Type | Notes |
|---|---|---|
| `name` | text | Full name (required) |
| `email` | text | Email address (required) |
| `company` | text | Company name (optional) |
| `message` | textarea | Inquiry content (required) |
| `inquiry_type` | select | Type of inquiry (optional) |

## Submitting via the Public API

```
POST /public/v1/contact-forms/{slug}/submit
Content-Type: application/json
```

### Request example

::: code-group

```bash [curl]
curl -X POST "https://api.luno.rest/public/p/{projectId}/v1/contact-forms/contact/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "company": "Acme Corp",
    "message": "I would like to learn more about your pricing.",
    "inquiry_type": "pricing"
  }'
```

```ts [JS]
const BASE = 'https://api.luno.rest/public/p/{projectId}/v1'

await fetch(`${BASE}/contact-forms/contact/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane@example.com',
    company: 'Acme Corp',
    message: 'I would like to learn more about your pricing.',
    inquiry_type: 'pricing',
  }),
})
```

```bash [MCP]
npx @luno-cms/mcp setup
# Agent prompt example: "Submit a test contact form and confirm it arrived"
```

:::

### Success response (HTTP 200)

```json
{
  "ok": true,
  "submissionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

### Validation error (HTTP 400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email is required"
  }
}
```

### Spam detection (HTTP 200, silently discarded)

If the honeypot field is filled in, luno returns `ok: true` but does not save the submission or send any notification. Bots believe the request succeeded and don't retry.

## Frontend Implementation

### Vanilla JavaScript

```html
<form id="contact-form" novalidate>
  <div>
    <label for="name">Full Name *</label>
    <input id="name" name="name" type="text" required autocomplete="name" />
  </div>
  <div>
    <label for="email">Email Address *</label>
    <input id="email" name="email" type="email" required autocomplete="email" />
  </div>
  <div>
    <label for="company">Company</label>
    <input id="company" name="company" type="text" autocomplete="organization" />
  </div>
  <div>
    <label for="message">Message *</label>
    <textarea id="message" name="message" required rows="5"></textarea>
  </div>
  <!-- Honeypot: hidden from real users, catches bots -->
  <input name="website" type="text" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Send Message</button>
  <p id="status" role="status" aria-live="polite"></p>
</form>

<script>
const form = document.getElementById('contact-form')
const status = document.getElementById('status')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const btn = form.querySelector('button[type="submit"]')
  btn.disabled = true
  status.textContent = 'Sending...'

  try {
    const data = Object.fromEntries(new FormData(form))
    const res = await fetch(
      'https://your-domain.com/public/v1/contact-forms/contact/submit',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    const json = await res.json()

    if (json.ok) {
      status.textContent = 'Message sent! We\'ll be in touch soon.'
      form.reset()
    } else {
      status.textContent = `Error: ${json.error.message}`
    }
  } catch {
    status.textContent = 'Network error. Please try again later.'
  } finally {
    btn.disabled = false
  }
})
</script>
```

### React + TypeScript

```tsx
import { useState, FormEvent } from 'react'

const ENDPOINT = 'https://your-domain.com/public/v1/contact-forms/contact/submit'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      company: fd.get('company') as string,
      message: fd.get('message') as string,
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (json.ok) {
        setStatus('success')
      } else {
        setErrorMsg(json.error.message)
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p>Thank you! We'll be in touch shortly.</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Full Name *
        <input name="name" type="text" required />
      </label>
      <label>
        Email Address *
        <input name="email" type="email" required />
      </label>
      <label>
        Company
        <input name="company" type="text" />
      </label>
      <label>
        Message *
        <textarea name="message" required rows={5} />
      </label>
      {status === 'error' && <p role="alert">{errorMsg}</p>}
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

### Next.js (Server Actions)

```typescript
// app/contact/actions.ts
'use server'

export async function submitContact(formData: FormData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  }

  const res = await fetch(
    `${process.env.LUNO_BASE_URL}/public/v1/contact-forms/contact/submit`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )

  const json = await res.json()
  if (!json.ok) throw new Error(json.error.message)
  return { success: true }
}
```

## Email Notifications

When a form is submitted, luno sends the submission content to the configured notification email address(es) using **Resend**.

### Required configuration

```toml
# wrangler.toml
[vars]
RESEND_API_KEY = "re_your_resend_api_key"
APP_BASE_URL   = "https://console.luno.rest"
MAIL_FROM      = "LUNO <noreply@luno.rest>"
```

::: tip About Resend
Resend is a developer-focused email API. The free tier supports up to 3,000 emails per month. Sign up at [resend.com](https://resend.com).
:::

When `RESEND_API_KEY` is not set, luno logs the email content to the console — convenient for local development.

### Email contents

Each notification email includes:
- All submitted field values
- Submission timestamp
- A direct link to the submission in the admin panel

## Autoreply (thank-you email)

Enable **autoreply** on the form to send an HTML thank-you email to the submitter.

| Setting | Description |
|---|---|
| `autoreply_enabled` | On/off |
| `autoreply_to_field` | Field key that holds the submitter email |
| `autoreply_subject` / `autoreply_body` | Subject and body (i18n-capable) |
| `email_signature` | Optional signature |

## Notifications and integrations

From form settings you can notify or sync on submit (availability depends on plan/config):

- **Chat:** Slack / Microsoft Teams / Discord / Chatwork / LINE Notify
- **CRM:** HubSpot / kintone
- **Spam protection:** Honeypot; Cloudflare Turnstile on hosted contact pages

## Hosted forms (contact.luno.rest)

Enable **Publish on contact.luno.rest** in site settings for a LUNO-hosted contact page / iframe embed.

- Example URL: `https://contact.luno.rest/{projectSlug}/{formSlug}`
- Widget / iframe snippets are available in the admin publish panel
- Hosted iframes use Turnstile

For a custom frontend, keep using `POST /public/v1/contact-forms/{slug}/submit` (or `/public/p/{projectId}/v1/...`).

## Viewing Submissions

All received submissions appear under **Contact Forms → Submissions** in the admin panel:

- Submission date and time
- All field values
- Read/unread status tracking
- Ability to add internal notes

## CORS

The public API accepts requests from all origins (`Access-Control-Allow-Origin: *`). You can call the endpoint directly with `fetch()` from any browser without a proxy.

## Next Steps

- [API Overview](/en/api/overview) — Error codes and CORS details
- [Webhooks](/en/api/webhooks) — Forward submissions to external services
- [Environment Variables](/en/self-hosting/env-vars) — Resend API key configuration
