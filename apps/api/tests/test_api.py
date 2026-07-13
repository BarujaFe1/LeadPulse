"""Smoke and regression tests for LeadPulse API."""

from fastapi.testclient import TestClient

from app.main import app
from app.models.schemas import ClassifyRequest
from app.services.analytics import classify_message

client = TestClient(app)


def test_health() -> None:
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["service"] == "leadpulse-api"


def test_demo_dashboard() -> None:
    res = client.get("/api/demo")
    assert res.status_code == 200
    body = res.json()
    assert body["total_leads"] >= 10
    assert "kpis" in body
    assert len(body["funnel"]) == 6
    assert any("motivo de perda" in item for item in body["weekly_highlights"])


def test_forgotten_leads() -> None:
    res = client.get("/api/leads/forgotten")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    assert len(res.json()) >= 1


def test_classify_hot_intent() -> None:
    res = client.post(
        "/api/classify",
        json={
            "message": "Quero fechar hoje, pode me passar o orçamento?",
            "channel": "whatsapp",
            "hours_since_last_touch": 30,
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert body["temperature"] == "hot"
    assert body["opportunity_score"] >= 60
    assert "15 minutos" in body["next_action"]


def test_classify_hot_keeps_action_despite_silence() -> None:
    result = classify_message(
        ClassifyRequest(
            message="Quero fechar hoje com o orçamento",
            channel="whatsapp",
            hours_since_last_touch=40,
        )
    )
    assert result.temperature == "hot"
    assert "15 minutos" in result.next_action
    assert any("24h" in item for item in result.rationale)


def test_lead_not_found() -> None:
    res = client.get("/api/leads/does-not-exist")
    assert res.status_code == 404
