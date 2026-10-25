export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950">
            W
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">
              WIND<span className="text-cyan-400">SCOPE</span>
            </h1>
            <p className="text-xs text-slate-400">Generation analytics</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 text-sm text-slate-300 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          UK national wind generation
          <span className="rounded-md border border-cyan-900 bg-cyan-950/50 px-3 py-1 text-xs font-semibold text-cyan-300">
            JAN 2026
          </span>
        </div>
      </div>
    </header>
  );
}
