import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import MetricCard from "../components/MetricCard.jsx";
import GenerationChart from "../components/GenerationChart.jsx";
import ForecastErrorChart from "../components/ForecastErrorChart.jsx";
import ComparisonTable from "../components/ComparisionTable.jsx";
import { fetchAnalytics } from "../api/analytics.js";

function formatNumber(value) {
  return Number(value).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadAnalytics() {
      try {
        const result = await fetchAnalytics();

        if (isActive) {
          setAnalytics(result);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Unable to load analytics.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <div className="mb-5 h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
        <h1 className="text-xl font-semibold">Loading wind analytics</h1>
        <p className="mt-2 text-sm text-slate-400">
          Retrieving forecast and actual generation data from Elexon.
        </p>
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <h1 className="text-xl font-semibold">Unable to load analytics</h1>
        <p className="mt-3 max-w-lg text-sm text-rose-300">
          {error || "The API returned no analytics data."}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Check that the FastAPI backend is running at http://127.0.0.1:8000.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg bg-cyan-400 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-300"
        >
          Retry
        </button>
      </main>
    );
  }

  const { metrics, data } = analytics;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-400">
              ENERGY PROCUREMENT INTELLIGENCE
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Wind generation
              <span className="block text-cyan-400">forecast analytics</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Compare day-ahead wind generation forecasts with realised output
              and quantify forecast errors to support purchasing decisions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-xs font-medium tracking-wider text-slate-500">
              ANALYSIS PERIOD
            </p>
            <p className="mt-2 font-semibold text-white">01–31 January 2026</p>
            <p className="mt-1 text-xs text-slate-400">
              UK national wind generation · Elexon
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Forecast accuracy overview
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Performance across January delivery hours
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Mean absolute error"
              value={formatNumber(metrics.mae)}
              unit="MW"
              description="Average absolute forecast error"
            />
            <MetricCard
              label="Root mean squared error"
              value={formatNumber(metrics.rmse)}
              unit="MW"
              description="Penalises larger errors"
            />
            <MetricCard
              label="Mean absolute percentage error"
              value={`${formatNumber(metrics.mape)}%`}
              description="Average absolute percentage error"
            />
            <MetricCard
              label="Hours evaluated"
              value={metrics.periodsEvaluated.toLocaleString("en-GB")}
              unit="/ 744"
              description="Hourly comparisons evaluated"
            />
          </div>
        </section>

        <GenerationChart data={data} />

        <ForecastErrorChart data={data} />

        <section className="rounded-xl border border-cyan-950 bg-gradient-to-r from-slate-900 to-slate-900/60 p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-400">
            DATA INSIGHT
          </p>
          <h2 className="mt-3 text-lg font-semibold text-white">
            Understanding forecast uncertainty
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-400">
            Across {metrics.periodsEvaluated} hourly comparisons, the mean
            absolute error was {formatNumber(metrics.mae)} MW. Forecast errors
            show how far the selected forecasts differed from realised wind
            generation; positive errors indicate overforecasting, while negative
            errors indicate underforecasting.
          </p>
        </section>

        <ComparisonTable data={data} />

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-800 py-5 text-xs text-slate-500 sm:flex-row">
          <span>WINDSCOPE · WIND GENERATION ANALYTICS</span>
          <span>Data source: Elexon · January 2026 · Times in UTC</span>
        </footer>
      </main>
    </div>
  );
}
