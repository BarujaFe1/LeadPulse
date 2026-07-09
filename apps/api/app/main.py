from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import classify, demo, health, leads, methodology
from app.services.demo_data import ensure_seed_csv


@asynccontextmanager
async def lifespan(_: FastAPI):
    ensure_seed_csv()
    yield


app = FastAPI(
    title="LeadPulse API",
    description=(
        "WhatsApp-first lead analytics and follow-up radar for SMB sales teams. "
        "Funnel clarity, response-time KPIs, forgotten-lead alerts and opportunity scoring."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(demo.router, prefix="/api")
app.include_router(leads.router, prefix="/api")
app.include_router(classify.router, prefix="/api")
app.include_router(methodology.router, prefix="/api")
