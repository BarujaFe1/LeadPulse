# Testing

## Web (`apps/web`)

```bash
cd apps/web
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Vitest covers:
- forgotten-lead detection
- dashboard KPI shape
- classify hot+silence regression (next_action must stay urgent)

## API (`apps/api`)

```bash
cd apps/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# Unix: source .venv/bin/activate
pip install -r requirements.txt
ruff check app tests
pytest -q
```

Pytest covers health, demo dashboard, forgotten leads, classify hot intent, 404 lead, silence regression.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs web + api jobs on push/PR.
