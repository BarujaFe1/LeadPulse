"""Demo dataset endpoints."""

from fastapi import APIRouter

from app.models.schemas import DashboardSummary, ImportPreview, Lead
from app.services.analytics import build_dashboard, import_preview, load_leads

router = APIRouter(tags=["demo"])


@router.get("/demo", response_model=DashboardSummary)
def get_demo_dashboard() -> DashboardSummary:
    return build_dashboard()


@router.get("/demo/leads", response_model=list[Lead])
def get_demo_leads() -> list[Lead]:
    return load_leads()


@router.get("/demo/import-preview", response_model=ImportPreview)
def get_import_preview() -> ImportPreview:
    return import_preview()
