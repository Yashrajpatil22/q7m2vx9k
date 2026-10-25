from fastapi import FastAPI

app = FastAPI(
    title="Wind Generation Analytics API",
    description="API for UK wind generation forecasts and actuals.",
    version="1.0.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
