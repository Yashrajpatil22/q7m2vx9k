
from math import sqrt


def calculate_accuracy_metrics(comparisons):
    """Calculate forecast accuracy metrics from hourly comparisons."""

    if not comparisons:
        raise ValueError("Cannot calculate metrics without comparisons")

    errors = [record["error"] for record in comparisons]
    absolute_errors = [abs(error) for error in errors]
    squared_errors = [error ** 2 for error in errors]

    percentage_errors = [
        abs(record["error"]) / abs(record["actualGeneration"]) * 100
        for record in comparisons
        if record["actualGeneration"] != 0
    ]

    return {
        "periodsEvaluated": len(comparisons),
        "mae": sum(absolute_errors) / len(absolute_errors),
        "rmse": sqrt(sum(squared_errors) / len(squared_errors)),
        "mape": (
            sum(percentage_errors) / len(percentage_errors)
            if percentage_errors
            else None
        ),
        "mapePeriodsEvaluated": len(percentage_errors),
    }
