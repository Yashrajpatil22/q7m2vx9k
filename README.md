#  Wind Generation Forecast Analytics

WindScope is a full-stack analytics application that compares day-ahead UK wind generation forecasts with realised generation and quantifies forecast accuracy. It is designed to help energy procurement teams understand forecast uncertainty when making electricity purchasing decisions.

## Live Application

**Dashboard:** https://q7m2vx9k.vercel.app

**Backend API:** https://q7m2vx9k-cydn.vercel.app

**API health check:** https://q7m2vx9k-cydn.vercel.app/health

## Problem Statement

Wind generation is weather-dependent, making forecast uncertainty an important consideration when purchasing electricity from the day-ahead wholesale market.

WindScope focuses on two objectives:

- Compare forecast wind generation with actual generation for January 2026.
- Quantify forecast accuracy using statistical error metrics.

The application uses UK national wind generation data from the [Elexon BMRS API](https://bmrs.elexon.co.uk/api-documentation).

## Features

- Interactive dashboard summarising forecast accuracy.
- Hourly forecast-versus-actual generation chart.
- Forecast error visualisation over time.
- Hourly comparison table containing forecast publication times, forecast generation, actual generation, and forecast error.
- Forecast accuracy metrics: Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Mean Absolute Percentage Error (MAPE).
- Docker-based local execution.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | Python, FastAPI |
| Data source | Elexon BMRS API |
| Containerisation | Docker, Docker Compose |
| Deployment | Vercel |

## Data Sources

The application uses only the national-level wind generation datasets specified in the assignment.

- **Actual generation:** [FUELHH dataset](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream), filtered to `fuelType=WIND`.
- **Forecast generation:** [WINDFOR dataset](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream).

The relevant fields are `startTime`, `generation`, and, for forecasts, `publishTime`.

The analysis is restricted to delivery periods in January 2026.

## Analysis Methodology

1. Retrieve actual wind generation at its available 30-minute resolution.
2. Retrieve forecast versions and retain target delivery periods within January 2026.
3. For each delivery hour, select the latest forecast published before the assumed day-ahead decision cutoff.
4. Calculate hourly actual generation by averaging the two corresponding half-hourly actual values.
5. Compare the selected forecast against hourly actual generation.
6. Calculate MAE, RMSE, and MAPE from the hourly comparisons.

### Forecast cutoff assumption

The assignment does not specify an exact market gate-closure time. This implementation therefore uses **09:50 UTC on the day before delivery** as its assumed decision cutoff. Only forecasts published before that cutoff are eligible for selection.

This assumption is explicitly stated to make the selection methodology transparent and reproducible.

## Forecast Accuracy Metrics

- **MAE:** Average absolute difference between forecast and actual generation, expressed in MW.
- **RMSE:** Square root of the mean squared forecast error, expressed in MW; larger errors have greater influence.
- **MAPE:** Average absolute percentage error across periods with non-zero actual generation.

For this implementation, the January 2026 analysis evaluates 744 hourly delivery periods.

## Project Structure

```text
.
├── backend/
│   ├── services/
│   │   ├── elexon.py          # Elexon API data retrieval
│   │   ├── analytics.py       # Forecast selection and hourly comparison
│   │   └── metrics.py         # Accuracy metric calculations
│   ├── main.py                # FastAPI application and API endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend container configuration
│   ├── test_elexon.py         # Elexon data retrieval tests
│   ├── test_forecasts.py      # Forecast data checks
│   ├── test_analytics.py      # Analytics tests
│   └── test_metrics.py        # Metric calculation tests
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── analytics.js   # Backend API client
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── GenerationChart.jsx
│   │   │   ├── ForecastErrorChart.jsx
│   │   │   └── ComparisonTable.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx  # Main dashboard
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── Dockerfile             # Frontend build and Nginx configuration
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── docker-compose.yml         # Runs frontend and backend together
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.12 or compatible Python 3 installation
- Node.js and npm
- Docker Desktop and Docker Compose (for containerised execution)

### Option 1: Run with Docker Compose

From the repository root:

```bash
docker compose up --build -d
```

Open the following URLs:

- Dashboard: http://localhost:3000
- Backend health check: http://localhost:8000/health
- Analytics API: http://localhost:8000/api/analytics

To stop the containers:

```bash
docker compose down
```

### Option 2: Run locally

**Start the backend**

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies and start FastAPI:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`.

**Start the frontend**

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will normally be available at `http://localhost:5173`.

For local development, the frontend uses `http://127.0.0.1:8000` as its default API base URL. The backend CORS configuration must permit the frontend's local origin.

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /api/actuals` | Retrieve actual wind generation records |
| `GET /api/analytics` | Return hourly comparisons and forecast accuracy metrics |

## AI Tool Disclosure

ChatGPT was used as an AI-assisted development tool for implementation guidance, debugging, code review, and documentation. The application logic, data-selection assumptions, and resulting outputs were reviewed and tested during development.

## Scope and Limitations

- The analysis is limited to UK national wind generation and January 2026 delivery periods.
- No additional generation sources, demand forecasts, or market-price datasets are included.
- Forecast selection depends on the documented 09:50 UTC day-ahead cutoff assumption.
- Forecast accuracy metrics describe historical forecast performance and should be interpreted alongside the stated data and methodology limitations.
