
from collections import Counter
from datetime import datetime
from services.elexon import fetch_wind_forecasts

records = fetch_wind_forecasts()

january_records = [
    record for record in records
    if record["startTime"].startswith("2026-01-")
]

# Count how many forecasts exist for each target period.
target_counts = Counter(
    record["startTime"] for record in january_records
)

# Inspect forecasts for one target period.
target = "2026-01-15T12:00:00Z"

print(f"Forecast versions for {target}:")
for record in sorted(
    (r for r in january_records if r["startTime"] == target),
    key=lambda r: r["publishTime"],
):
    print(
        f"Published: {record['publishTime']}, "
        f"Generation: {record['generation']}"
    )

print("\nForecast count distribution:")
print(Counter(target_counts.values()))

# Inspect target intervals.
target_times = sorted(target_counts)
parsed_times = [
    datetime.fromisoformat(t.replace("Z", "+00:00"))
    for t in target_times
]

intervals = Counter(
    int((b - a).total_seconds() / 60)
    for a, b in zip(parsed_times, parsed_times[1:])
)

print("\nTarget interval lengths (minutes):", intervals)
