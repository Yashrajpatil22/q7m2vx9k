
from services.metrics import calculate_accuracy_metrics


sample_comparisons = [
    {"error": 100, "actualGeneration": 1000},
    {"error": -200, "actualGeneration": 2000},
    {"error": 300, "actualGeneration": 3000},
]

metrics = calculate_accuracy_metrics(sample_comparisons)

print(metrics)

assert metrics["periodsEvaluated"] == 3
assert metrics["mae"] == 200
assert round(metrics["rmse"], 2) == 216.02
assert round(metrics["mape"], 2) == 10.00

print("Metric tests passed.")
