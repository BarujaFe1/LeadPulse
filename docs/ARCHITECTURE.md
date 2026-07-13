# Architecture

## Overview

LeadPulse is a **monorepo lab** for WhatsApp-first SMB follow-up analytics:

- **`apps/web`** — Next.js 15 public demo (Vercel). Runs a **frontend-first** analytics engine so recruiters can open the lab without a Python runtime.
- **`apps/api`** — FastAPI parity layer for local full-stack / future integrations.
- **`data/seed`** — Synthetic CSV mirrored in TypeScript (`demo-leads.ts`).

```text
CSV / Form / Manual (MVP thesis)
        │
        ▼
 Stage mapping + response-time rules
        │
        ├── forgotten-lead detection (no first reply / 24h+ silence)
        ├── opportunity heuristic score
        └── follow-up priority queue
        │
        ▼
 Cockpit KPIs + weekly highlights
```

## Frontend-first decision

Public Vercel deploys **do not** require FastAPI.  
`apps/web/lib/api.ts` prefers `NEXT_PUBLIC_API_URL` when set; otherwise it uses `lib/engine.ts`.

This keeps the live demo stable and honest: **lab snapshot ≠ production WhatsApp API**.

## Domain modules

| Module | Responsibility |
|---|---|
| `lib/demo-leads.ts` / `demo_data.py` | Synthetic seed |
| `lib/engine.ts` / `services/analytics.py` | KPIs, forgotten rules, classify, highlights |
| `components/*` | Presentational cockpit panels |
| `api/*` routers | HTTP surface for local API |

## Non-goals (MVP)

- Full CRM
- Unofficial WhatsApp Web scraping
- Mass messaging
- Automated decisions about individuals
