"""Lead analytics, scoring helpers and follow-up radar."""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timedelta
from statistics import median

from app.models.schemas import (
    ClassifyRequest,
    ClassifyResponse,
    DashboardSummary,
    FollowUpTask,
    FunnelStage,
    ImportPreview,
    Lead,
    LostReason,
    ResponseKpi,
    Stage,
)
from app.services.demo_data import load_raw_rows

ACTIVE_STAGES: set[Stage] = {"new", "contacted", "qualified", "proposal"}
NOW = datetime.fromisoformat("2026-07-09T12:00:00")


def _parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value)


def row_to_lead(row: dict[str, str]) -> Lead:
    first = row.get("first_response_minutes") or None
    return Lead(
        id=row["id"],
        name=row["name"],
        channel=row["channel"],
        stage=row["stage"],  # type: ignore[arg-type]
        owner=row["owner"],
        source=row["source"],
        created_at=row["created_at"],
        first_response_minutes=int(first) if first not in (None, "") else None,
        last_touch_at=row["last_touch_at"],
        next_follow_up_at=row.get("next_follow_up_at") or None,
        opportunity_score=int(row["opportunity_score"]),
        estimated_revenue=float(row["estimated_revenue"]),
        temperature=row["temperature"],  # type: ignore[arg-type]
        lost_reason=row.get("lost_reason") or None,
        notes=row.get("notes") or "",
        tags=[tag for tag in (row.get("tags") or "").split(";") if tag],
    )


def load_leads() -> list[Lead]:
    return [row_to_lead(row) for row in load_raw_rows()]


def is_forgotten(lead: Lead) -> bool:
    if lead.stage not in ACTIVE_STAGES:
        return False
    if lead.first_response_minutes is None:
        return True
    last = _parse_dt(lead.last_touch_at)
    if last is None:
        return True
    return (NOW - last) >= timedelta(hours=24) and lead.stage in {
        "new",
        "contacted",
        "qualified",
    }


def build_follow_ups(leads: list[Lead]) -> list[FollowUpTask]:
    tasks: list[FollowUpTask] = []
    for lead in leads:
        if lead.stage not in ACTIVE_STAGES:
            continue
        due = lead.next_follow_up_at or lead.created_at
        priority = "medium"
        if lead.first_response_minutes is None or "forgotten" in lead.tags:
            priority = "critical"
        elif lead.temperature == "hot":
            priority = "high"
        elif lead.opportunity_score < 50:
            priority = "low"
        tasks.append(
            FollowUpTask(
                id=f"T-{lead.id}",
                lead_id=lead.id,
                lead_name=lead.name,
                due_at=due,
                priority=priority,  # type: ignore[arg-type]
                title=f"Retomar {lead.name} ({lead.channel})",
                status="open",
            )
        )
    order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    return sorted(tasks, key=lambda task: (order[task.priority], task.due_at))


def _weekly_highlights(
    *,
    forgotten_count: int,
    at_risk_revenue: float,
    median_first_response: float,
    p90_first_response: float,
    conversion: float,
    won_count: int,
    closed_count: int,
    top_lost_reason: str | None,
) -> list[str]:
    highlights = [
        (
            f"{forgotten_count} leads ativos sem retorno adequado "
            f"(receita em risco R$ {at_risk_revenue:,.0f})."
        ),
        (
            f"Mediana de 1ª resposta: {median_first_response:.0f} min "
            f"(p90 {p90_first_response:.0f})."
        ),
        f"Conversão demo: {conversion}% ({won_count} ganhos / {closed_count} encerrados).",
    ]
    if top_lost_reason:
        readable = top_lost_reason.replace("_", " ")
        highlights.append(f"Maior motivo de perda (demo): {readable}.")
    else:
        highlights.append("Nenhum lead perdido no snapshot — foque em SLA de resposta.")
    return highlights


def build_dashboard() -> DashboardSummary:
    leads = load_leads()
    active = [lead for lead in leads if lead.stage in ACTIVE_STAGES]
    won = [lead for lead in leads if lead.stage == "won"]
    lost = [lead for lead in leads if lead.stage == "lost"]
    responses = [
        lead.first_response_minutes
        for lead in leads
        if lead.first_response_minutes is not None
    ]
    forgotten = [lead for lead in active if is_forgotten(lead)]
    hot = [lead for lead in active if lead.temperature == "hot"]
    follow_ups = build_follow_ups(leads)

    stage_order: list[Stage] = [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "won",
        "lost",
    ]
    funnel: list[FunnelStage] = []
    for stage in stage_order:
        bucket = [lead for lead in leads if lead.stage == stage]
        funnel.append(
            FunnelStage(
                stage=stage,
                count=len(bucket),
                revenue=round(sum(lead.estimated_revenue for lead in bucket), 2),
            )
        )

    reason_counter: Counter[str] = Counter()
    reason_revenue: dict[str, float] = {}
    for lead in lost:
        reason = lead.lost_reason or "nao_informado"
        reason_counter[reason] += 1
        reason_revenue[reason] = reason_revenue.get(reason, 0) + lead.estimated_revenue
    lost_reasons = [
        LostReason(
            reason=reason,
            count=count,
            revenue_impact=round(reason_revenue[reason], 2),
        )
        for reason, count in reason_counter.most_common()
    ]

    risk = sorted(
        [
            lead
            for lead in active
            if is_forgotten(lead) or lead.temperature == "hot"
        ],
        key=lambda lead: (-lead.opportunity_score, lead.last_touch_at),
    )[:5]

    closed = len(won) + len(lost)
    conversion = round((len(won) / closed) * 100, 1) if closed else 0.0
    sorted_resp = sorted(responses)
    p90 = (
        float(sorted_resp[int(0.9 * (len(sorted_resp) - 1))])
        if sorted_resp
        else 0.0
    )

    kpis = ResponseKpi(
        median_first_response_minutes=float(median(responses)) if responses else 0.0,
        p90_first_response_minutes=p90,
        unanswered_over_24h=len(
            [lead for lead in active if lead.first_response_minutes is None]
        ),
        forgotten_leads=len(forgotten),
        open_follow_ups=len(follow_ups),
        hot_leads=len(hot),
        at_risk_revenue=round(sum(lead.estimated_revenue for lead in forgotten), 2),
    )

    highlights = _weekly_highlights(
        forgotten_count=len(forgotten),
        at_risk_revenue=kpis.at_risk_revenue,
        median_first_response=kpis.median_first_response_minutes,
        p90_first_response=kpis.p90_first_response_minutes,
        conversion=conversion,
        won_count=len(won),
        closed_count=closed,
        top_lost_reason=lost_reasons[0].reason if lost_reasons else None,
    )

    return DashboardSummary(
        total_leads=len(leads),
        active_leads=len(active),
        won_leads=len(won),
        lost_leads=len(lost),
        conversion_rate=conversion,
        kpis=kpis,
        funnel=funnel,
        lost_reasons=lost_reasons,
        top_risk_leads=risk,
        follow_ups=follow_ups[:8],
        weekly_highlights=highlights,
    )


def classify_message(payload: ClassifyRequest) -> ClassifyResponse:
    text = payload.message.lower()
    score = 40
    rationale: list[str] = []
    temperature = "warm"
    stage: Stage = "contacted"
    next_action = "Registrar lead e agendar follow-up em 24h."

    hot_terms = [
        "quero fechar",
        "hoje",
        "agora",
        "orçamento",
        "preço",
        "agendar",
        "visita",
    ]
    cold_terms = ["só pesquisando", "depois", "talvez", "não tenho pressa"]
    lost_terms = ["já fechei", "concorrente", "desisti"]

    hits = [term for term in hot_terms if term in text]
    if hits:
        score += 25
        rationale.append(f"Sinais de intenção: {', '.join(hits)}.")
        temperature = "hot"
        stage = "qualified"
        next_action = "Priorizar retorno humano em até 15 minutos."

    if any(term in text for term in cold_terms):
        score -= 15
        temperature = "cold"
        rationale.append("Linguagem de baixa urgência detectada.")
        next_action = "Nutrir com valor e remarcar contato em 3 dias."

    if any(term in text for term in lost_terms):
        score = min(score, 25)
        stage = "lost"
        temperature = "cold"
        rationale.append("Indício de perda / fechamento externo.")
        next_action = "Registrar motivo de perda e pedir feedback curto."

    if payload.hours_since_last_touch >= 24:
        score += 10
        rationale.append("Lead sem toque há 24h+ — risco de esquecimento.")
        # Keep hot-intent action; silence only raises score/rationale.
        if temperature != "hot":
            next_action = "Criar tarefa crítica de follow-up agora."

    if payload.channel in {"whatsapp", "instagram"}:
        score += 5
        rationale.append(f"Canal {payload.channel} costuma exigir resposta rápida.")

    score = max(0, min(100, score))
    if not rationale:
        rationale.append(
            "Classificação heurística sem sinais fortes — revisar manualmente."
        )

    return ClassifyResponse(
        temperature=temperature,  # type: ignore[arg-type]
        suggested_stage=stage,
        opportunity_score=score,
        rationale=rationale,
        next_action=next_action,
    )


def import_preview() -> ImportPreview:
    leads = load_leads()
    channels = Counter(lead.channel for lead in leads)
    stages = Counter(lead.stage for lead in leads)
    return ImportPreview(
        rows_ingested=len(leads),
        rows_valid=len(leads),
        channels=dict(channels),
        stages=dict(stages),
        sample=leads[:5],
    )
