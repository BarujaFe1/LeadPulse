# LeadPulse

**WhatsApp-first follow-up radar for SMB sales teams** — response-time KPIs, forgotten leads, opportunity scoring and weekly commercial highlights.

<p align="center">
  <a href="https://leadpulse-two.vercel.app"><strong>🌐 Live Demo</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/BarujaFe1/LeadPulse"><strong>GitHub</strong></a>
</p>

<p align="center">
  <img src="./assets/hero-cover.png" alt="LeadPulse cockpit preview" width="100%" />
</p>

> **Lab notice:** the public demo uses **12 synthetic leads**. KPIs are from the seed snapshot — **not** production WhatsApp metrics. No unofficial WhatsApp Web scraping.

---

## Problem

Local businesses already pay for leads on WhatsApp/Instagram. Conversations go cold because nobody measures first-response time, stages stay in chat chaos, and follow-ups depend on memory. Lost lead = lost CAC.

## Solution

LeadPulse is a **light ops cockpit**, not a heavy CRM:

1. Ingest CSV / form / manual records (MVP thesis)
2. Map stages and compute response KPIs
3. Flag forgotten opportunities and at-risk revenue
4. Prioritize follow-up tasks
5. Score opportunity with an explainable heuristic
6. Ship a weekly owner/agency style highlight list

---

## Core features

- **Follow-up radar** — critical/high/medium/low queue
- **Response dashboard** — median / p90 first response, unanswered, at-risk revenue
- **Simple funnel** — new → contacted → qualified → proposal → won/lost
- **Opportunity classify** — intent + channel + silence with rationale (**heuristic, not AI/LLM**)
- **Lost reasons** — process feedback, not “blame the lead”
- **Weekly report** — computed from the same snapshot (no invented metrics)
- **Scoring methodology panel** — transparent rule card in the UI

Methodology details: [docs/SCORING.md](./docs/SCORING.md) · Interview demo: [docs/DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md)

---

## Architecture

```text
apps/web  → Next.js lab (Vercel frontend-first engine)
apps/api  → FastAPI parity for local/API workflows
data/seed → synthetic WhatsApp-first CSV
```

Details: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)

---

## Stack

- Next.js 15 / React 19 / TypeScript / Recharts
- FastAPI / Pydantic / Pytest / Ruff
- Vitest + ESLint + GitHub Actions CI
- Vercel deploy for the public lab

---

## Quick start

### Live demo
https://leadpulse-two.vercel.app

### Frontend only (same mode as Vercel)

```bash
cd apps/web
npm install
npm run dev
```

### Full local stack (Windows)

```bash
start.bat
```

### Full local stack (manual)

```bash
# API
cd apps/api
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Web (optional API)
cd apps/web
# set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm install
npm run dev
```

---

## Environment

See [`.env.example`](./.env.example).

| Variable | Default | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | unset | If unset, web uses client engine |
| `CORS_ORIGINS` | localhost:3000 | API only |

---

## Tests & quality

```bash
# Web
cd apps/web && npm run lint && npm run typecheck && npm test && npm run build

# API
cd apps/api && ruff check app tests && pytest -q
```

More: [docs/TESTING.md](./docs/TESTING.md) · [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## Trade-offs

| Choice | Benefit | Cost |
|---|---|---|
| Frontend-first demo | One-click Vercel lab | Dual TS/Python logic |
| Heuristic score | Explainable | Not calibrated ML |
| Fixed demo clock | Stable KPIs | Not live wall-clock SLA |
| No WhatsApp scraping | Safe / compliant | Phase-2 official API later |

---

## Roadmap

- **MVP (now):** CSV/form/manual thesis, cockpit, classify, weekly highlights, billing positioning
- **Phase 2:** WhatsApp Business Platform provider, Instagram forms, agency multi-client
- **Phase 3:** consented conversation analytics, light automation, attendant benchmarking

---

## Status

**Public lab demo — portfolio quality pass in progress on branch `chore/portfolio-quality-pass`.**  
Production CRM / official WhatsApp integration: out of scope.

---

## What this project demonstrates

- SMB B2B product sense (pain → KPI → next action)
- Analytics engineering on operational chat workflows
- Full-stack delivery (Next.js + FastAPI) with honest demo mode
- Explainable heuristics instead of black-box scoring
- Portfolio hygiene: tests, CI, docs, no fake production metrics

---

## How I’d present this in an interview

1. Start with the demo: forgotten leads + at-risk revenue  
2. Show follow-up radar prioritization  
3. Classify a hot WhatsApp message and read the rationale  
4. Explain frontend-first vs FastAPI parity  
5. Close with scope discipline: no scraping, no fake CRM claims  

Pitch notes: [docs/portfolio_pitch.md](./docs/portfolio_pitch.md)

---

## Author

**Felipe Alirio Baruja**  
Portfolio: [barujafe.vercel.app](https://barujafe.vercel.app/) · GitHub: [@BarujaFe1](https://github.com/BarujaFe1)

## License

MIT — see [LICENSE](./LICENSE).
