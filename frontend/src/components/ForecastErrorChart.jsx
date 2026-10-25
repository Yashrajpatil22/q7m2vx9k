import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

function formatTime(value) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export default function ForecastErrorChart({ data }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Forecast error over time
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Forecast minus actual generation · MW
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
        >
          <CartesianGrid stroke="#263449" strokeDasharray="3 5" />

          <XAxis
            dataKey="startTime"
            tickFormatter={formatTime}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
            minTickGap={65}
          />

          <YAxis
            tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
          />

          <Tooltip
            labelFormatter={formatTime}
            formatter={(value) => [
              `${Number(value).toLocaleString("en-GB", {
                maximumFractionDigits: 1,
              })} MW`,
              "Forecast error",
            ]}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 10,
              color: "#f1f5f9",
            }}
          />

          <ReferenceLine y={0} stroke="#64748b" strokeDasharray="4 4" />

          <Area
            type="monotone"
            dataKey="error"
            name="Forecast error"
            stroke="#c084fc"
            fill="#a855f7"
            fillOpacity={0.15}
            strokeWidth={1.6}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
