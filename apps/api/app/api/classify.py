"""Lightweight intent / opportunity classification."""

from fastapi import APIRouter

from app.models.schemas import ClassifyRequest, ClassifyResponse
from app.services.analytics import classify_message

router = APIRouter(tags=["classify"])


@router.post("/classify", response_model=ClassifyResponse)
def classify(payload: ClassifyRequest) -> ClassifyResponse:
    return classify_message(payload)
