---
title: Self-Hosting Overview
description: Architecture overview for self-hosting luno HCMS on Cloudflare Workers, PostgreSQL, Hyperdrive, and R2. Component roles, minimum requirements, and security checklist.
---

# Self-Hosting Overview

luno runs entirely on Cloudflare's edge infrastructure. Every component is open-source and self-hostable — you retain full ownership of your data and code.

## Architecture

<ArchitectureDiagram locale="en" />

## Components

| Component | Role | Technology | Required |
|---|---|---|:---:|
| **API** | Content management + public API | Cloudflare Workers (Hono) | ✓ |
| **Database** | Persistent content storage | PostgreSQL | ✓ |
| **Admin SPA** | Browser admin panel | Vite 6 + React + Mantine v8 | ✓ |
| **Hyperdrive** | DB connection pooling + latency reduction | Cloudflare Hyperdrive | Recommended |
| **Media Storage** | Image and file storage | Cloudflare R2 | For media features |
| **Email** | Notification emails | Resend | Optional |

### Cloudflare Workers (API)

The luno API is a Cloudflare Workers application using the [Hono](https://hono.dev) framework.

- Runs at the Cloudflare edge — low latency worldwide with no cold starts
- Automatically protected by Cloudflare's DDoS mitigation and WAF
- Stateless: horizontal scaling happens automatically

### PostgreSQL (Database)

Standard PostgreSQL, hosted anywhere. Verified services:

| Service | Notes |
|---|---|
| **Neon** | Serverless PostgreSQL. Free tier available. Recommended for new deployments. |
| **Supabase** | Open-source Firebase alternative. Built on PostgreSQL. |
| **Railway** | Simple, developer-friendly hosting. Starts at $5/month. |
| **Self-hosted** | Full control; suitable for on-premises requirements. |

### Cloudflare Hyperdrive

Workers are stateless and create a new database connection per request. Without connection pooling, this creates latency (100–500ms per connection) and can exhaust PostgreSQL's connection limit under load.

Hyperdrive solves this by maintaining a persistent pool of connections between Cloudflare and your PostgreSQL instance, reducing connection overhead to near-zero.

### Cloudflare R2

Object storage for media files (images, documents, etc.). R2 is S3-compatible and charges no egress fees for access from Cloudflare Workers.

Image resizing variants are generated asynchronously via Workers Queue after upload.

### Resend (Email)

Used for notification emails: user invitations, password resets, contact form receipts. Without `RESEND_API_KEY` set, emails are logged to the console — convenient for local development.

## Monorepo Structure

luno is a pnpm monorepo:

```
apps/
  api/       Cloudflare Workers API (Hono)
  admin/     React admin SPA (Vite 6)
packages/
  db/        Migration SQL files
  shared/    Shared types, error codes, revision workflow
```

## Minimum Requirements

To run luno in the most minimal configuration:

1. **Cloudflare Workers account** (free tier supported)
2. **PostgreSQL database** (e.g., Neon free tier)
3. **`JWT_SECRET`** — a random string of 32+ characters

R2 and Hyperdrive can be added later. Without R2, media upload features are unavailable. Without Hyperdrive, expect higher database latency.

## Multi-Tenant Model

luno supports multiple organizations and projects within a single deployment:

```
Organization
  └── Project (= Tenant)
        └── Form Set
              └── Entry → Revision
```

- **superuser**: Manages all organizations and projects
- **organization_admin**: Manages projects within their assigned organizations
- **tenant_admin**: Manages content, members, and settings within one project
- **tenant_user**: Creates and edits content within one project

## Security Checklist

### JWT secret

```bash
# Generate a cryptographically secure random secret
openssl rand -hex 32
```

Store it using `wrangler secret put JWT_SECRET` — never in plaintext in `wrangler.toml`.

### Disable dev mode in production

```toml
[vars]
DEV_AUTH_ENABLED     = "false"  # CRITICAL: enables password-free token issuance if true
REGISTRATION_ENABLED = "false"  # Recommended: use invite-only user management
```

::: danger DEV_AUTH_ENABLED
When `DEV_AUTH_ENABLED=true`, anyone can obtain a valid JWT by calling `POST /admin/v1/auth/dev-token` with any email address. **Never deploy to production with this enabled.**
:::

### Additional hardening

- Set up Cloudflare WAF rules to restrict Admin API access by IP range if needed
- Enable 2FA (TOTP) for admin accounts via the account security settings
- Rotate `JWT_SECRET` periodically; all existing sessions will be invalidated

## Next Steps

- [Environment Variables](/en/self-hosting/env-vars) — Complete configuration reference
- [Deployment Guide](/en/self-hosting/deployment) — Step-by-step production deployment
