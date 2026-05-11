# TrustShyft™

**Behavioural Governance Operating System for AI-assisted work.**

This repository contains the Phase 1 monorepo scaffold for TrustShyft.

## Phase 1 scope

Phase 1 implements only the core governance loop:

- **Decision Points** — definitions of moments where human oversight is expected.
- **Oversight Records** — append-only records that a checkpoint was met, escalated, or had its required fields skipped.
- **Evidence Trail / Evidence Exports** — read-only views over oversight records, plus signed, hashed export bundles.
- **Coverage analytics** — completed oversight records divided by expected checkpoints, and escalation rate.

The following product areas are intentionally **out of scope** for Phase 1 and must not be exposed in UI, API, or nav:

- JRI scoring
- Drift detection
- Audit Log surface
- Assurance Reports / Governance Assurance Report
- OpenAI-assisted summaries or scoring

The OpenAI API key may exist in deployment environments for future phases, but Phase 1 code does not call OpenAI.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui style primitives.
- **Backend:** Express + Node.js + TypeScript + Drizzle ORM + PostgreSQL.
- **Auth:** Clerk (server middleware placeholder).
- **Deploy:** Railway (`infra/railway.toml`).
- **Monorepo:** pnpm workspaces + Turborepo.

## Layout

```
apps/
  web/     React + Vite frontend
  api/     Express + Drizzle backend
packages/
  shared/  Shared types, zod schemas, constants
infra/     Dockerfiles + Railway config
```

## Getting started

```bash
# 1. Install
pnpm install

# 2. Configure environment
cp .env.example .env
# fill in DATABASE_URL and Clerk keys

# 3. Typecheck the whole workspace
pnpm typecheck

# 4. Build
pnpm build

# 5. Dev (web + api together)
pnpm dev
```

## Database

PostgreSQL with two schemas:

- `app` — mutable application state: organisations, users, decision points, evidence exports.
- `audit` — append-only governance state: oversight records.

`audit.oversight_records` is protected by a SQL trigger that rejects `UPDATE` and `DELETE`. `recorded_at` and `integrity_hash` are generated server-side.

Decision Points are soft-disabled (no hard delete).

Record **status is derived, not stored**:

- `escalated = true` → `Escalated`
- required fields missing → `Incomplete`
- otherwise → `Covered`

## API surface (`/api/v1`)

**Decision Points**

- `GET    /decision-points`
- `GET    /decision-points/:id`
- `POST   /decision-points`
- `PATCH  /decision-points/:id`
- `DELETE /decision-points/:id` (soft-disable)

**Oversight Records** (append-only)

- `POST /oversight-records`
- `GET  /oversight-records`
- `GET  /oversight-records/:id`

**Evidence Exports**

- `POST /evidence-exports`
- `GET  /evidence-exports`
- `GET  /evidence-exports/:id/download`

**Analytics**

- `GET /analytics/coverage`
- `GET /analytics/escalation-rate`

## Frontend routes

Only Phase 1 nav is wired:

- `/dashboard`
- `/decision-points` (`/new`, `/:id`)
- `/oversight-records` (`/new`, `/:id`)
- `/evidence-trail`
- `/evidence-exports` (`/:id`)
