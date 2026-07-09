"""Product methodology and scope notes."""

from fastapi import APIRouter

router = APIRouter(tags=["methodology"])


@router.get("/methodology")
def methodology() -> dict:
    return {
        "product": "LeadPulse",
        "thesis": (
            "WhatsApp-first analytics and light automation so local businesses "
            "stop losing paid leads to slow replies and weak follow-up."
        ),
        "mvp_inputs": [
            "CSV / WhatsApp export (manual)",
            "Form submissions",
            "Manual lead entry",
        ],
        "core_metrics": [
            "first_response_time",
            "forgotten_leads",
            "follow_up_tasks",
            "opportunity_score",
            "lost_reasons",
            "at_risk_revenue",
        ],
        "out_of_scope_mvp": [
            "Full corporate CRM",
            "WhatsApp Web scraping / unofficial automation",
            "Illegal mass messaging",
        ],
        "scoring_notes": (
            "Opportunity score in the MVP is a transparent heuristic based on "
            "intent keywords, channel urgency and silence time — not a black-box model."
        ),
    }
