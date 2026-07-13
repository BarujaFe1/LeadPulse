# Portfolio Handoff — LeadPulse

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Role recommendation:** **Laboratório** (lab / selected demo — not home featured)

---

## Canonical links

| Asset | URL |
|---|---|
| Live demo (current build) | https://leadpulse-two.vercel.app |
| GitHub | https://github.com/BarujaFe1/LeadPulse |
| Homepage metadata | https://leadpulse-two.vercel.app |
| Legacy URL (stale team session) | https://leadpulse-umber.vercel.app — **do not use** |

---

## Before → After

| Before | After |
|---|---|
| Public deploy served old scaffold UI | Redeployed quality-pass + scoring honesty UI |
| Placeholder PNGs | Real panel screenshots from live demo |
| Classify copy could sound like “AI” | Explicit “Heurística (não é IA)” + methodology panel |
| Dual engines unpinned | KPI parity pinned in Vitest (12 / 7 / 15137 / 34.5 / 33.3) |
| Homepage pointed to umber | GitHub homepage → `leadpulse-two` |

---

## Bugs / risks closed this pass

1. **P1 — stale public demo** relative to quality-pass branch → redeployed.
2. **P1 — account/domain drift** (`umber` vs `two`) → canonicalized to `leadpulse-two`.
3. **P2 — AI overclaim risk** in classify UX → renamed + methodology card + `docs/SCORING.md`.
4. **P2 — fake screenshots** → Playwright captures of live panels.
5. **P3 — unused `lucide-react`** → removed.

## Confirmed non-issues

- TS ↔ Python KPI parity on synthetic seed.
- Lint / typecheck / vitest / ruff / pytest / build green on branch.

---

## Gates executed

```text
apps/web: lint ✅  typecheck ✅  vitest 6/6 ✅  next build ✅
apps/api: ruff ✅  pytest 6/6 ✅
```

---

## Demo evidence

Screenshots in `assets/screenshots/` (synthetic SMB names only):

- `01-followup-radar.png` — prioritized queue  
- `05-opportunity-score.png` — heuristic result score 80 / hot / 15 min  
- `03-response-dashboard.png` — KPI strip  
- plus funnel, risk leads, lost reasons, weekly report  

Interview script: `docs/DEMO_SCRIPT.md` (3–5 min).

---

## Limitations

- Lab MVP: CSV/form/manual thesis; no official WhatsApp Business API yet.
- Frontend-first Vercel demo; FastAPI is local parity.
- Fixed demo clock for stable forgotten-lead KPIs.
- Legacy `leadpulse-umber.vercel.app` may still resolve on an older Vercel team — ignore it.
- No Playwright CI E2E yet (capture script is manual/dev helper).

---

## Portfolio placement

- **featured: false**
- **lab: true**
- Card CTA → https://leadpulse-two.vercel.app  
- Pair narratively with OpsLedger / ReconcileIQ as “ops product family”, not overlapping DataFlow.

## Next steps (optional)

1. Merge `chore/portfolio-quality-pass` → `main`.
2. Add GitHub Actions Playwright smoke against `LEADPULSE_URL`.
3. Upload `assets/social-preview.png` in GitHub repo Settings → Social Preview.
4. Keep out of home featured until a second real customer-shaped case study exists.
