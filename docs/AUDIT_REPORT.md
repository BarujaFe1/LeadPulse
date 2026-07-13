# LeadPulse — Audit Report

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Auditor role:** senior full-stack / analytics / QA / portfolio reviewer

---

## 1. Executive summary

LeadPulse is a **WhatsApp-first SMB follow-up lab**: Next.js cockpit + optional FastAPI analytics API, seeded with **12 synthetic leads**. The public Vercel demo is frontend-first and already live. As a portfolio piece it has a clear commercial thesis, but the repo still looked like a **thin scaffold**: monolithic UI, no frontend tests, no CI, interactive `next lint` without config, Python ruff noise, one classification logic bug, and a hardcoded weekly insight.

**Current grade (pre-pass): 6.4 / 10**  
**Target after this pass: ~8.5 / 10** for a public lab MVP (not a production CRM).

---

## 2. Stack & structure (actual)

| Layer | Reality |
|---|---|
| Web | Next.js 15 App Router, React 19, TypeScript, Recharts |
| API | FastAPI + Pydantic + CSV seed (optional for local) |
| Demo mode | Client engine in `apps/web/lib/engine.ts` (no Python on Vercel) |
| Data | `data/seed/whatsapp_leads_demo.csv` + mirrored TS seed |
| Deploy | Vercel project `leadpulse` → https://leadpulse-umber.vercel.app |

```text
LeadPulse/
├── apps/web/          # Public lab (Vercel)
├── apps/api/          # Local FastAPI parity
├── data/seed/         # Synthetic CSV
├── assets/            # README visuals
├── docs/              # Methodology + portfolio docs
└── vercel.json        # Monorepo build pointing at apps/web
```

---

## 3. Main risks

1. **Recruiters may assume production WhatsApp integration** — must keep lab disclaimers loud.
2. **Logic drift** between Python `analytics.py` and TS `engine.ts` if not tested in lockstep.
3. **`next lint` without ESLint config** → CI/local lint hangs on interactive prompt.
4. **Classification overwrite:** silence ≥24h overwrote hot-intent `next_action`.
5. **Hardcoded weekly highlight** claimed top lost reason without reading aggregates.
6. **No frontend unit tests** on the demo engine (the part recruiters actually open).

---

## 4. Bugs found

| ID | Severity | Issue | Status |
|---|---|---|---|
| B1 | Medium | Hot classify `next_action` overwritten by silence rule | Fix in pass |
| B2 | Low | Weekly highlight “demora no retorno” hardcoded | Fix in pass |
| B3 | Medium | `npm run lint` interactive / no eslint config | Fix in pass |
| B4 | Low | Ruff E741 ambiguous `l` in list comprehensions | Fix in pass |
| B5 | Low | Global `error` state shared by demo load + classify | Fix in pass |
| B6 | Info | No empty-state for zero lost reasons chart | Fix in pass |

---

## 5. Quick wins

- ESLint flat config + non-interactive lint
- Vitest for engine (forgotten leads, KPIs, classify)
- CI GitHub Actions (web + api)
- Split UI into readable panels + skeleton
- Dynamic lost-reason insight
- Portfolio-grade README + architecture docs

---

## 6. Structural improvements

- Keep domain logic in `lib/engine.ts` / `services/analytics.py`
- Presentational components under `apps/web/components/`
- Document frontend-first vs FastAPI parity explicitly
- Align highlight/copy with computed KPIs only (no invented production metrics)

---

## 7. Execution plan

1. Fix classification + highlight logic; add tests  
2. Ruff cleanup; expand pytest  
3. ESLint + Vitest + CI  
4. UX pass on homepage  
5. Docs + README rewrite  
6. Handoff + commit/push branch  

---

## 8. Security notes

- No `.env` secrets committed (only `.env.example` placeholders).
- `.env.local` / `.vercel/` gitignored.
- Demo data is synthetic SMB names — not real customers.
- If a secret were found, stop and write `SECURITY_NOTES.md` without echoing values. **None found in this audit.**

---

## 9. Final checklist (acceptance)

- [x] Installs  
- [x] Typecheck / build  
- [x] Pytest  
- [x] Frontend tests  
- [x] Non-interactive lint  
- [x] CI  
- [x] Docs pack  
- [x] README portfolio rewrite  
- [x] Handoff  

**Post-pass grade (estimated): 8.5 / 10** for a public SMB ops lab MVP.