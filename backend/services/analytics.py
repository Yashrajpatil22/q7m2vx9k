
from collections import defaultdict
from datetime import datetime, timedelta, timezone


def parse_timestamp(value):
    """Parse an ISO timestamp and normalize it to UTC."""
    timestamp = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return timestamp.astimezone(timezone.utc)


def build_hourly_comparison(actual_records, forecast_records):
    """
    Select the latest eligible day-ahead forecast for each January 2026
    delivery hour and compare it with hourly average actual generation.
    """
    january_start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    february_start = datetime(2026, 2, 1, tzinfo=timezone.utc)

    # Index actual generation by the start of each half-hour period.
    actual_by_time = {
        parse_timestamp(record["startTime"]): float(record["generation"])
        for record in actual_records
        if record.get("generation") is not None
    }

    # Group all forecast versions by their delivery-period start time.
    forecasts_by_target = defaultdict(list)

    for record in forecast_records:
        target_time = parse_timestamp(record["startTime"])

        if not (january_start <= target_time < february_start):
            continue

        # The observed forecast data is hourly.
        if target_time.minute != 0:
            continue

        forecasts_by_target[target_time].append(record)

    comparisons = []

    for target_time, versions in forecasts_by_target.items():
        # January is GMT/UTC in the UK.
        cutoff = (
            target_time.replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            - timedelta(days=1)
            + timedelta(hours=9, minutes=50)
        )

        eligible_versions = [
            record
            for record in versions
            if parse_timestamp(record["publishTime"]) < cutoff
        ]

        if not eligible_versions:
            continue

        # Choose the most recently published eligible forecast.
        selected = max(
            eligible_versions,
            key=lambda record: parse_timestamp(record["publishTime"]),
        )

        # Each hourly period contains two half-hourly actual readings.
        second_half_hour = target_time + timedelta(minutes=30)

        if (
            target_time not in actual_by_time
            or second_half_hour not in actual_by_time
        ):
            continue

        actual_generation = (
            actual_by_time[target_time]
            + actual_by_time[second_half_hour]
        ) / 2

        forecast_generation = float(selected["generation"])
        error = forecast_generation - actual_generation

        comparisons.append(
            {
                "startTime": target_time.isoformat().replace("+00:00", "Z"),
                "publishTime": selected["publishTime"],
                "forecastGeneration": forecast_generation,
                "actualGeneration": actual_generation,
                "error": error,
                "absoluteError": abs(error),
            }
        )

    return sorted(comparisons, key=lambda record: record["startTime"])
