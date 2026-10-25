function formatTime(value) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function formatNumber(value) {
  return Number(value).toLocaleString("en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export default function ComparisonTable({ data }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Hourly comparison data
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Forecast publication and realised generation · UTC
          </p>
        </div>

        <span className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300">
          {data.length.toLocaleString("en-GB")} HOURS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left text-sm">
          <thead className="bg-slate-800/70 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Delivery time</th>
              <th className="px-5 py-3 font-medium">Forecast published</th>
              <th className="px-5 py-3 text-right font-medium">
                Forecast (MW)
              </th>
              <th className="px-5 py-3 text-right font-medium">Actual (MW)</th>
              <th className="px-5 py-3 text-right font-medium">Error (MW)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {data.slice(0, 24).map((record) => (
              <tr
                key={record.startTime}
                className="transition-colors hover:bg-slate-800/50"
              >
                <td className="whitespace-nowrap px-5 py-3 text-slate-200">
                  {formatTime(record.startTime)}
                </td>

                <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                  {formatTime(record.publishTime)}
                </td>

                <td className="px-5 py-3 text-right tabular-nums text-slate-200">
                  {formatNumber(record.forecastGeneration)}
                </td>

                <td className="px-5 py-3 text-right tabular-nums text-slate-200">
                  {formatNumber(record.actualGeneration)}
                </td>

                <td
                  className={`px-5 py-3 text-right tabular-nums font-medium ${
                    record.error > 0
                      ? "text-rose-400"
                      : record.error < 0
                        ? "text-emerald-400"
                        : "text-slate-300"
                  }`}
                >
                  {record.error > 0 ? "+" : ""}
                  {formatNumber(record.error)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-slate-800 px-5 py-3 text-xs text-slate-500">
        Showing the first 24 hours in chronological order.
      </p>
    </section>
  );
}
