
import requests

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"


def fetch_actual_wind_generation():
    """Fetch actual UK wind generation for January 2026."""

    url = f"{BASE_URL}/FUELHH/stream"

    params = {
        "settlementDateFrom": "2026-01-01",
        "settlementDateTo": "2026-01-31",
        "fuelType": "WIND",
    }

    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()

    records = response.json()

    if not isinstance(records, list):
        raise ValueError("Unexpected response format from Elexon API")

    return records
