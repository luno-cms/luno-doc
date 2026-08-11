---
title: Deployment Guide
description: Step-by-step guide to deploying luno HCMS to Cloudflare Workers (API) and Cloudflare Pages (admin SPA), including CI/CD with GitHub Actions.
---

# Deployment Guide

This guide walks you through deploying luno to Cloudflare Workers (API) and Cloudflare Pages (admin SPA).

## Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)
- Node.js 20+
- pnpm 8+
- A PostgreSQL database ([Neon](https://neon.tech) recommended — free tier available)

## Step 1: Set Up Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate with your Cloudflare account
wrangler login
```

Your browser opens to Cloudflare's authentication page.

## Step 2: Clone the Repository

```bash
git clone https://github.com/luno-cms/luno.git
cd luno
pnpm install
```

## Step 3: Set Up the Database

### Create your PostgreSQL database

[Neon](https://neon.tech) offers a free serverless PostgreSQL. Create a project and copy the connection string (`postgres://...`).

Other options: Supabase, Railway, or a self-managed server.

### Create a Hyperdrive instance

Hyperdrive maintains a persistent connection pool between Cloudflare Workers and your PostgreSQL, eliminating per-request connection latency.

```bash
wrangler hyperdrive create luno-hyperdrive \
  --connection-string "postgres://user:password@your-db-host:5432/luno"
```

Note the `id` from the output. Add it to `apps/api/wrangler.toml`:

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id      = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Run migrations

```bash
DATABASE_URL="postgres://user:password@your-db-host:5432/luno" pnpm db:migrate

# Optional: seed initial data
DATABASE_URL="postgres://user:password@your-db-host:5432/luno" pnpm db:seed
```

## Step 4: Create the R2 Bucket

```bash
wrangler r2 bucket create luno-media-production
```

Update `apps/api/wrangler.toml`:

```toml
[[r2_buckets]]
binding     = "MEDIA_BUCKET"
bucket_name = "luno-media-production"
```

## Step 5: Register Secrets

```bash
# JWT secret (32+ character random string)
echo "$(openssl rand -hex 32)" | wrangler secret put JWT_SECRET

# Resend API key (for email notifications)
wrangler secret put RESEND_API_KEY
# Enter the key at the prompt: re_xxxx...
```

Update `apps/api/wrangler.toml` with non-sensitive variables:

```toml
[vars]
DEFAULT_TENANT_ID    = "00000000-0000-0000-0000-000000000001"
REGISTRATION_ENABLED = "false"
DEV_AUTH_ENABLED     = "false"
APP_BASE_URL         = "https://admin.your-domain.com"
```

## Step 6: Deploy the API

```bash
pnpm --filter @luno/api deploy
```

The API is now live at `https://luno-api.your-account.workers.dev`.

### Set a custom domain

In Cloudflare Dashboard → Workers & Pages → `luno-api` → **Custom Domains**, add your domain (e.g., `api.your-domain.com`).

## Step 7: Build and Deploy the Admin SPA

### Build

```bash
VITE_API_BASE_URL="https://api.your-domain.com" \
  pnpm --filter @luno/admin build
```

### Deploy to Cloudflare Pages

**Option A: CLI**

```bash
wrangler pages deploy apps/admin/dist --project-name luno-admin
```

**Option B: GitHub continuous deployment (recommended)**

1. Cloudflare Dashboard → Workers & Pages → **Create application** → **Pages**
2. Connect your GitHub repository
3. Configure build settings:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `pnpm --filter @luno/admin build` |
| Build output directory | `apps/admin/dist` |
| Root directory | `/` |

4. Add environment variable: `VITE_API_BASE_URL` → `https://api.your-domain.com`

After connecting, every push to `main` triggers an automatic deployment.

## Step 8: Verify the Deployment

```bash
# API health check
curl https://api.your-domain.com/health
# Expected: { "status": "ok" }

# Database connectivity
curl https://api.your-domain.com/health/db
# Expected: { "status": "ok", "latencyMs": 5 }

# Public API (returns empty list if no content yet)
curl https://api.your-domain.com/public/v1/form-sets/blog/entries
```

Open the admin panel at `https://admin.your-domain.com` and verify you can log in.

## Updating luno

```bash
# Pull latest changes
git pull origin main
pnpm install

# Run any new migrations
DATABASE_URL="postgres://..." pnpm db:migrate

# Re-deploy API
pnpm --filter @luno/api deploy

# Rebuild and re-deploy admin
VITE_API_BASE_URL="https://api.your-domain.com" \
  pnpm --filter @luno/admin build
wrangler pages deploy apps/admin/dist --project-name luno-admin
```

## GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      # Build shared package first (required for API type checking)
      - run: pnpm --filter @luno/shared build

      # Deploy the API
      - name: Deploy API
        run: pnpm --filter @luno/api deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

      # Build the admin SPA
      - name: Build Admin
        run: pnpm --filter @luno/admin build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      # Deploy the admin SPA
      - name: Deploy Admin
        run: wrangler pages deploy apps/admin/dist --project-name luno-admin
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**Required GitHub Secrets:**

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers and Pages deploy permissions |
| `VITE_API_BASE_URL` | The Admin SPA's API URL, e.g., `https://api.your-domain.com` |

Create a Cloudflare API token at [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) using the "Edit Cloudflare Workers" template.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `wrangler deploy` fails | `wrangler.toml` misconfiguration | Run `wrangler dev` locally to surface the error |
| Database connection error | Hyperdrive ID wrong or DB unreachable | Run `wrangler hyperdrive list` to verify the ID |
| Admin SPA can't reach API | Wrong `VITE_API_BASE_URL` or CORS issue | Check the env var and rebuild |
| JWT errors on login | `JWT_SECRET` not set | Run `wrangler secret list` to verify it's registered |
| Emails not sending | `RESEND_API_KEY` not set | Check Workers logs — email content is logged as fallback |
| Schedule not auto-publishing | Cron trigger not configured | Add `crons = ["* * * * *"]` under `[triggers]` in `wrangler.toml` |

## Next Steps

- [Environment Variables](/en/self-hosting/env-vars) — Complete variable reference
- [Self-Hosting Overview](/en/self-hosting/) — Architecture and security checklist
- [Quick Start](/en/guide/getting-started) — First steps after deployment
