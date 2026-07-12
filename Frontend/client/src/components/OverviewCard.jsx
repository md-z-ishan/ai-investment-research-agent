const OverviewCard = ({ company, symbol, industry, sector, currentPrice }) => {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-8 shadow-soft">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-white font-display">{company}</h2>
            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              {symbol}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="rounded-md border border-white/5 bg-gray-950/40 px-3 py-1.5 font-medium uppercase tracking-wider text-slate-300">{sector}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            <span className="rounded-md border border-white/5 bg-gray-950/40 px-3 py-1.5 font-medium uppercase tracking-wider text-slate-300">{industry}</span>
          </div>
        </div>
        <div className="flex flex-col sm:items-end bg-gray-950/30 border border-white/5 rounded-2xl p-4 sm:min-w-[180px]">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-500">Current Price</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white font-display">{currentPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
