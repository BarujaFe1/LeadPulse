"""Lead inbox and follow-up endpoints."""

from fastapi import APIRouter, HTTPException

from app.models.schemas import FollowUpTask, Lead
from app.services.analytics import build_follow_ups, is_forgotten, load_leads

router = APIRouter(tags=["leads"])


@router.get("/leads", response_model=list[Lead])
def list_leads(stage: str | None = None, temperature: str | None = None) -> list[Lead]:
    leads = load_leads()
    if stage:
        leads = [l for l in leads if l.stage == stage]
    if temperature:
        leads = [l for l in leads if l.temperature == temperature]
    return sorted(leads, key=lambda l: (-l.opportunity_score, l.last_touch_at))


@router.get("/leads/forgotten", response_model=list[Lead])
def forgotten_leads() -> list[Lead]:
    return [l for l in load_leads() if is_forgotten(l)]


@router.get("/leads/{lead_id}", response_model=Lead)
def get_lead(lead_id: str) -> Lead:
    for lead in load_leads():
        if lead.id == lead_id:
            return lead
    raise HTTPException(status_code=404, detail="Lead not found")


@router.get("/follow-ups", response_model=list[FollowUpTask])
def list_follow_ups() -> list[FollowUpTask]:
    return build_follow_ups(load_leads())
