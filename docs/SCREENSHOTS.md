# Screenshot capture guide

## Canonical live captures (after redeploy)

Capture from https://leadpulse-two.vercel.app (synthetic data only — no PII).

| File | Viewport | Content |
|---|---|---|
| `assets/screenshots/01-followup-radar.png` | 1440×900 | Hero + KPI strip + follow-up radar |
| `assets/screenshots/02-leads-inbox.png` | 1440×900 | Risk leads panel |
| `assets/screenshots/03-response-dashboard.png` | 1440×900 | KPI cards focused |
| `assets/screenshots/04-simple-funnel.png` | 1440×900 | Funnel panel |
| `assets/screenshots/05-opportunity-score.png` | 1440×900 | Heuristic panel after “Priorizar mensagem” |
| `assets/screenshots/06-lost-reasons.png` | 1440×900 | Lost reasons chart |
| `assets/screenshots/07-return-calendar.png` | 1440×900 | Follow-up due dates |
| `assets/screenshots/08-weekly-report.png` | 1440×900 | Weekly highlights + scoring methodology |

## Automated helper

```bash
cd apps/web
npx --yes playwright install chromium
node ../../scripts/capture_screenshots.mjs
```

Requires the live URL (or `LEADPULSE_URL`) to serve the **current** build.
