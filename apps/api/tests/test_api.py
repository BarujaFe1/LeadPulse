"""Smoke tests for LeadPulse API."""

from fastapi.testclient import TestClient

from app.main import app

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


def test_forgotten_leads() -> None:
    res = client.get("/api/leads/forgotten")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


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
