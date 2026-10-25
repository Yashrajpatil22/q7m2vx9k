export default function MetricCard({ label, value, unit, description }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-cyan-400">{unit}</span>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </article>
  );
}
