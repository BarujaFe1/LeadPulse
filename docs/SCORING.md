# Scoring & classification (honest methodology)

## What it is

A **deterministic heuristic** that helps SMB operators prioritize human follow-up.

## What it is not

- Not machine learning
- Not an LLM / generative AI classifier
- Not a credit, hiring, or automated approval model
- Not a substitute for WhatsApp Business Platform analytics

## Inputs

| Signal | Effect |
|---|---|
| Base | 40 |
| Hot intent keywords | +25, temperature `hot`, stage `qualified` |
| Cold language | −15, temperature `cold` |
| Lost language | score capped ≤25, stage `lost` |
| Silence ≥24h | +10 (+ rationale); does **not** overwrite hot next-action |
| WhatsApp / Instagram channel | +5 |

## Outputs

- `temperature` (`hot` / `warm` / `cold`)
- `suggested_stage`
- `opportunity_score` (0–100)
- `rationale[]` (human-readable)
- `next_action`

## Forgotten-lead rule (separate from score)

Active stages only (`new`, `contacted`, `qualified`, `proposal`):

- no first response, **or**
- last touch ≥24h before the fixed demo clock (`2026-07-09T12:00:00`) for `new`/`contacted`/`qualified`

## Parity

TypeScript (`apps/web/lib/engine.ts`) and Python (`apps/api/app/services/analytics.py`) must stay aligned. CI runs both suites.
