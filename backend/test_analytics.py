from services.metrics import calculate_accuracy_metrics
from services.elexon import (
    fetch_actual_wind_generation,
    fetch_wind_forecasts,
)
from services.analytics import build_hourly_comparison


actuals = fetch_actual_wind_generation()
forecasts = fetch_wind_forecasts()

results = build_hourly_comparison(actuals, forecasts)

print(f"Actual half-hourly records: {len(actuals)}")
print(f"Forecast records retrieved: {len(forecasts)}")
print(f"Comparable hourly records: {len(results)}")

if results:
    print("\nFirst comparison:")
    print(results[0])

    print("\nLast comparison:")
    print(results[-1])

    print("\nMissing forecast or actual values:", sum(
        record.get("forecastGeneration") is None
        or record.get("actualGeneration") is None
        for record in results
    ))
else:
    print("No comparable records were produced.")

metrics = calculate_accuracy_metrics(results)

print("\nJanuary 2026 Forecast Accuracy")
print(f"Periods evaluated: {metrics['periodsEvaluated']}")
print(f"MAE: {metrics['mae']:.2f} MW")
print(f"RMSE: {metrics['rmse']:.2f} MW")
print(f"MAPE: {metrics['mape']:.2f}%")
print(f"Periods used for MAPE: {metrics['mapePeriodsEvaluated']}")