from services.elexon import (
    fetch_actual_wind_generation,
    fetch_wind_forecasts,
)
from services.analytics import build_hourly_comparison
from services.metrics import calculate_accuracy_metrics
from fastapi import FastAPI, HTTPException

from services.elexon import fetch_actual_wind_generation
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Wind Generation Analytics API",
    description="API for UK wind generation forecasts and actuals.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/actuals")
def get_actual_generation():
    try:
        records = fetch_actual_wind_generation()
        return {
            "count": len(records),
            "data": records,
        }
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve actual generation data from Elexon.",
        ) from exc

@app.get("/api/analytics")
def get_analytics():
    try:
        actuals = fetch_actual_wind_generation()
        forecasts = fetch_wind_forecasts()

        comparisons = build_hourly_comparison(actuals, forecasts)
        metrics = calculate_accuracy_metrics(comparisons)

        return {
            "metrics": metrics,
            "data": comparisons,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to generate wind forecast analytics.",
        ) from exc