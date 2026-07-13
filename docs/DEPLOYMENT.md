# Deployment

## Live demo

- **URL:** https://leadpulse-two.vercel.app  
- **GitHub homepage:** same URL  
- **Mode:** frontend-first lab (no FastAPI required)

## Vercel settings

Root `vercel.json` builds `apps/web`:

```json
{
  "framework": "nextjs",
  "installCommand": "cd apps/web && npm install",
  "buildCommand": "cd apps/web && npm run build",
  "outputDirectory": "apps/web/.next"
}
```

Preferred production link from `apps/web` with framework Next.js.

## Environment

| Variable | Required on Vercel? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Optional FastAPI base URL for local/full stack |

Copy `.env.example` for local work. Never commit `.env` / `.env.local`.

## Local full stack

1. API: `uvicorn app.main:app --reload --port 8000` in `apps/api`
2. Web: set `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` and `npm run dev` in `apps/web`
3. Or use `start.bat` on Windows
