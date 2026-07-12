import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ProsCons = ({ pros, cons, isFallback }) => {
  if (isFallback) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft">
        <h3 className="text-lg font-semibold">AI Insights</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">AI insights are currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Pros Panel */}
      <div className="glass-panel rounded-3xl p-6 shadow-soft border-emerald-500/10 bg-emerald-500/[0.01]">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <FiCheckCircle className="text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Strengths & Moats</p>
            <h3 className="text-base font-bold font-display text-white">Investment Pros</h3>
          </div>
        </div>
        <ul className="space-y-2.5">
          {pros?.map((item) => (
            <li key={item} className="rounded-xl border border-white/5 bg-gray-950/30 p-3.5 text-sm text-slate-300 font-medium leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Cons Panel */}
      <div className="glass-panel rounded-3xl p-6 shadow-soft border-rose-500/10 bg-rose-500/[0.01]">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
            <FiXCircle className="text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400">Risks & Threats</p>
            <h3 className="text-base font-bold font-display text-white">Investment Cons</h3>
          </div>
        </div>
        <ul className="space-y-2.5">
          {cons?.map((item) => (
            <li key={item} className="rounded-xl border border-white/5 bg-gray-950/30 p-3.5 text-sm text-slate-300 font-medium leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProsCons;
