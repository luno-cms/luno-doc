---
title: Environment Variables
description: Complete reference for all luno HCMS environment variables — required, recommended, and optional — with a full wrangler.toml example and secret management guide.
---

# Environment Variables

Set variables in the `[vars]` section of `apps/api/wrangler.toml`, or as encrypted secrets using `wrangler secret put`. Never put sensitive values (secrets, API keys) in plaintext in `wrangler.toml`.

## Required

| Variable | Description | How to set |
|---|---|---|
| `JWT_SECRET` | HS256 signing key for JWT tokens. **Must be 32+ characters.** | `wrangler secret put JWT_SECRET` |
| `DEFAULT_TENANT_ID` | Default project UUID for host-based tenant resolution | `[vars]` in `wrangler.toml` |

```bash
# Generate a secure JWT secret
openssl rand -hex 32
# → a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0

# Store it as an encrypted secret (never put it in wrangler.toml)
echo "a3f8b2c1d4e5f6a7b8c9d0..." | wrangler secret put JWT_SECRET
```

## Database

| Variable | Description |
|---|---|
| `HYPERDRIVE` | Cloudflare Hyperdrive binding. Configured in `[[hyperdrive]]` in `wrangler.toml`. |

### Hyperdrive (recommended for production)

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id      = "your-hyperdrive-id"
```

```bash
# Create a Hyperdrive instance pointing to your PostgreSQL
wrangler hyperdrive create luno-hyperdrive \
  --connection-string "postgres://user:password@your-db-host:5432/luno"
```

### Local development

Locally, Postgres is connected via `localConnectionString` on the `[[hyperdrive]]` binding (the app uses `HYPERDRIVE`; there is no `DATABASE_URL` var).

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "00000000-0000-4000-8000-000000000001"
localConnectionString = "postgres://luno:luno@127.0.0.1:5432/luno"
```

## Authentication

| Variable | Default | Description |
|---|---|---|
| `LUNO_PRODUCTION` | `false` | When `true`, disables dev-token endpoints (**must be true in production**) |
| `DEV_AUTH_ENABLED` | (local `.dev.vars`) | Enables `POST /admin/v1/auth/dev-token` — **never enable in production** |
| `REGISTRATION_ENABLED` | `false` | Allows public self-registration. Set to `false` for invite-only. |
| `GOOGLE_OAUTH_ENABLED` | `false` | Enables Google OAuth login |
| `ADMIN_CORS_ORIGIN` | — | Admin SPA origin (e.g. `https://console.luno.rest`) |
| `AUTH_SUCCESS_REDIRECT` | — | Redirect after successful login |

::: danger Production auth
Set `LUNO_PRODUCTION=true` and do not enable `DEV_AUTH_ENABLED`. An open dev-token endpoint lets anyone mint JWTs.
:::

### Google OAuth

When `GOOGLE_OAUTH_ENABLED=true`, also configure these as **secrets** (not plaintext vars):

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret |
| `GOOGLE_OAUTH_REDIRECT_URI` | Callback URL (must match Google Console exactly) |

**Google Cloud Console steps:**

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create OAuth Client ID
3. Application type: **Web application**
4. Authorized redirect URI: `https://your-domain.com/admin/v1/auth/oauth/google/callback`
5. Copy the credentials

```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

## Email

| Variable | Description | Example |
|---|---|---|
| `RESEND_API_KEY` | Resend API key for sending notification emails. Without this, emails are logged. | `re_123abc456def` |
| `MAIL_FROM` | From address (verified domain) | `LUNO <noreply@luno.rest>` |
| `APP_BASE_URL` | Base URL for email links / admin SPA | `https://console.luno.rest` |
| `PUB_ORIGIN` | Origin for pub.luno.rest hosting | `https://pub.luno.rest` |
| `CONTACT_ORIGIN` | Origin for contact.luno.rest hosting | `https://contact.luno.rest` |
| `TURNSTILE_SITE_KEY` | Turnstile site key (secret: `TURNSTILE_SECRET_KEY`) | |

```bash
wrangler secret put RESEND_API_KEY
```

### Local email testing

When `RESEND_API_KEY` is not set, all email content is printed to the Workers log. With `DEV_AUTH_ENABLED=true`, you can also fetch verification links directly:

```bash
# Retrieve a magic link from the API (dev only)
curl "http://localhost:8787/admin/v1/auth/dev-email-token?email=user@example.com&type=verify"
```

## Media Storage

| Variable | Description |
|---|---|
| `MEDIA_BUCKET` | Cloudflare R2 binding. Configured in `[[r2_buckets]]`. |

```toml
[[r2_buckets]]
binding     = "MEDIA_BUCKET"
bucket_name = "luno-media-production"
```

```bash
wrangler r2 bucket create luno-media-production
```

## Image Variant Processing (Workers Queue)

| Binding | Description |
|---|---|
| `IMAGE_VARIANT_QUEUE` | Workers Queue for asynchronous image resizing |

```toml
[[queues.producers]]
binding = "IMAGE_VARIANT_QUEUE"
queue   = "luno-image-variants"

[[queues.consumers]]
queue             = "luno-image-variants"
max_batch_size    = 10
max_batch_timeout = 30
```

## Billing (Optional)

For Stripe-based subscription billing:

| Variable | Description |
|---|---|
| `LUNO_BILLING_ENABLED` | Set to `true` to enable Stripe billing |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |

## Complete wrangler.toml Example

```toml
name                 = "luno-api"
main                 = "src/index.ts"
compatibility_date   = "2025-03-01"
compatibility_flags  = ["nodejs_compat"]

# ── Core settings ────────────────────────────────────────────
[vars]
DEFAULT_TENANT_ID    = "00000000-0000-0000-0000-000000000001"
REGISTRATION_ENABLED = "false"
DEV_AUTH_ENABLED     = "false"
GOOGLE_OAUTH_ENABLED = "false"
APP_BASE_URL         = "https://console.your-domain.com"
LUNO_PRODUCTION      = "true"
ADMIN_CORS_ORIGIN    = "https://console.your-domain.com"
LUNO_BILLING_ENABLED = "false"

# ── Hyperdrive (PostgreSQL connection pooling) ───────────────
[[hyperdrive]]
binding = "HYPERDRIVE"
id      = "your-hyperdrive-id"

# ── R2 (media storage) ───────────────────────────────────────
[[r2_buckets]]
binding     = "MEDIA_BUCKET"
bucket_name = "luno-media-production"

# ── Workers Queue (async image variant generation) ───────────
[[queues.producers]]
binding = "IMAGE_VARIANT_QUEUE"
queue   = "luno-image-variants"

[[queues.consumers]]
queue             = "luno-image-variants"
max_batch_size    = 10
max_batch_timeout = 30

# ── Cron Triggers (billing daily + scheduled publish ~5 min) ─
[triggers]
crons = ["0 2 * * *", "*/5 * * * *", "2-59/5 * * * *"]
```

::: warning JWT_SECRET is a secret
Do not put `JWT_SECRET` in `[vars]` — that would expose it in your source code. Always use `wrangler secret put JWT_SECRET` to store it encrypted.
:::

## Managing Secrets

```bash
# Register secrets interactively (prompts for value)
wrangler secret put JWT_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put STRIPE_SECRET_KEY            # Billing

# List registered secret names (values are never shown)
wrangler secret list

# Delete a secret
wrangler secret delete OLD_SECRET_NAME
```

Secrets are stored in Cloudflare's encrypted storage and are available as environment variables at runtime.

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
- name: Deploy API
  run: pnpm --filter @luno/api deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Secrets registered with `wrangler secret put` are automatically available to your deployed Worker — no additional configuration needed in the GitHub Actions workflow.

## Next Steps

- [Deployment Guide](/en/self-hosting/deployment) — Step-by-step production deployment
- [Self-Hosting Overview](/en/self-hosting/) — Architecture and component roles
