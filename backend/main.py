
from fastapi import FastAPI, HTTPException

from services.elexon import fetch_actual_wind_generation

app = FastAPI(
    title="Wind Generation Analytics API",
    description="API for UK wind generation forecasts and actuals.",
    version="1.0.0",
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
