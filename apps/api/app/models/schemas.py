"""LeadPulse request/response schemas."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


Stage = Literal[
    "new",
    "contacted",
    "qualified",
    "proposal",
    "won",
    "lost",
]

Temperature = Literal["hot", "warm", "cold"]


class Lead(BaseModel):
    id: str
    name: str
    channel: str
    stage: Stage
    owner: str
    source: str
    created_at: str
    first_response_minutes: int | None = None
    last_touch_at: str
    next_follow_up_at: str | None = None
    opportunity_score: int = Field(ge=0, le=100)
    estimated_revenue: float = 0
    temperature: Temperature = "warm"
    lost_reason: str | None = None
    notes: str = ""
    tags: list[str] = Field(default_factory=list)


class FollowUpTask(BaseModel):
    id: str
    lead_id: str
    lead_name: str
    due_at: str
    priority: Literal["critical", "high", "medium", "low"]
    title: str
    status: Literal["open", "done", "snoozed"] = "open"


class FunnelStage(BaseModel):
    stage: Stage
    count: int
    revenue: float


class ResponseKpi(BaseModel):
    median_first_response_minutes: float
    p90_first_response_minutes: float
    unanswered_over_24h: int
    forgotten_leads: int
    open_follow_ups: int
    hot_leads: int
    at_risk_revenue: float


class LostReason(BaseModel):
    reason: str
    count: int
    revenue_impact: float


class DashboardSummary(BaseModel):
    total_leads: int
    active_leads: int
    won_leads: int
    lost_leads: int
    conversion_rate: float
    kpis: ResponseKpi
    funnel: list[FunnelStage]
    lost_reasons: list[LostReason]
    top_risk_leads: list[Lead]
    follow_ups: list[FollowUpTask]
    weekly_highlights: list[str]


class ClassifyRequest(BaseModel):
    message: str
    channel: str = "whatsapp"
    hours_since_last_touch: float = 0


class ClassifyResponse(BaseModel):
    temperature: Temperature
    suggested_stage: Stage
    opportunity_score: int
    rationale: list[str]
    next_action: str


class ImportPreview(BaseModel):
    rows_ingested: int
    rows_valid: int
    channels: dict[str, int]
    stages: dict[str, int]
    sample: list[Lead]
