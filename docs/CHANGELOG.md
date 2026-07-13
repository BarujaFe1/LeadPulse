# Changelog — portfolio evidence pass (2026-07-13)

## Added
- In-app scoring methodology panel (heuristic, explicitly not AI/LLM)
- `docs/SCORING.md`, `docs/DEMO_SCRIPT.md`, `docs/SCREENSHOTS.md`, `docs/PORTFOLIO_HANDOFF.md`
- Screenshot capture script (`scripts/capture_screenshots.mjs`)

## Changed
- Classify CTA copy: “Priorizar mensagem” / “Heurística de priorização (não é IA)”
- Removed unused `lucide-react` dependency
- Public Vercel redeploy so live demo matches `chore/portfolio-quality-pass`

## Evidence
- Live demo: https://leadpulse-two.vercel.app
- Gates: lint, typecheck, vitest, pytest, ruff, next build
