# Technical Decisions

## ADR-001 — Frontend-first public demo

**Decision:** Ship the Vercel lab with a TypeScript analytics engine.  
**Why:** FastAPI on Vercel needs extra ops; recruiters need a one-click demo.  
**Trade-off:** Dual implementation (TS + Python) must stay tested in lockstep.

## ADR-002 — Fixed demo clock (`2026-07-09T12:00:00`)

**Decision:** Forgotten-lead rules use a fixed `NOW`.  
**Why:** Public KPIs stay stable over time.  
**Trade-off:** Not a live wall-clock SLA monitor.

## ADR-003 — Heuristic opportunity score (not ML)

**Decision:** Keyword + channel + silence scoring with explicit rationale.  
**Why:** Explainability for SMB ops and interview storytelling.  
**Trade-off:** Not a calibrated propensity model.

## ADR-004 — Silence must not overwrite hot next-action

**Decision:** ≥24h silence raises score/rationale but keeps “reply in 15 min” when intent is hot.  
**Why:** Hot leads need immediate response, not a generic task creation message.

## ADR-005 — No invented production metrics

**Decision:** UI and README only show seed-derived KPIs and label them as lab/demo.  
**Why:** Portfolio credibility and privacy/compliance hygiene.
