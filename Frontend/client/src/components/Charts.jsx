import { useMemo } from 'react';
import { motion } from 'framer-motion';

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/A';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
};

const Charts = ({ chartData }) => {
  const metrics = useMemo(() => {
    const values = Array.isArray(chartData) ? chartData : [];
    const resolvedValues = values.slice(0, 3);

    return resolvedValues.map((entry, index) => {
      const label = entry?.name || 'Metric';
      const value = Number(entry?.value ?? 0);
      const color = index === 0 ? '#3B82F6' : index === 1 ? '#22C55E' : '#EF4444';

      return {
        label,
        value,
        displayValue: formatCurrency(value),
        color
      };
    });
  }, [chartData]);

  const maxValue = Math.max(...metrics.map((item) => item.value || 0), 1);
  const currentPrice = metrics[0]?.value ?? null;
  const weekHigh = metrics[1]?.value ?? null;
  const weekLow = metrics[2]?.value ?? null;

  const belowHighPct = currentPrice !== null && weekHigh !== null && weekHigh > 0
    ? ((weekHigh - currentPrice) / weekHigh) * 100
    : null;
  const belowHighDiff = currentPrice !== null && weekHigh !== null
    ? weekHigh - currentPrice
    : null;
  const aboveLowPct = currentPrice !== null && weekLow !== null && weekLow > 0
    ? ((currentPrice - weekLow) / weekLow) * 100
    : null;
  const aboveLowDiff = currentPrice !== null && weekLow !== null
    ? currentPrice - weekLow
    : null;

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 shadow-soft">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Market Momentum</p>
        <h3 className="text-xl font-bold font-display text-white mt-1">Price Range & Technical Channels</h3>
      </div>

      <div className="space-y-4">
        {metrics.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-white font-mono">{item.displayValue}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-950 border border-white/5 p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(6, (item.value / maxValue) * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-gray-950/40 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-300/80">Distance to 52W High</p>
          <p className="mt-2 text-lg font-bold text-white font-display">
            {belowHighPct !== null ? `${belowHighPct.toFixed(1)}% Below` : 'N/A'}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {belowHighDiff !== null ? `${formatCurrency(belowHighDiff)} below target range` : 'No comparison data'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-gray-950/40 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-300/80">Distance to 52W Low</p>
          <p className="mt-2 text-lg font-bold text-white font-display">
            {aboveLowPct !== null ? `${aboveLowPct.toFixed(1)}% Above` : 'N/A'}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {aboveLowDiff !== null ? `${formatCurrency(aboveLowDiff)} support cushion` : 'No comparison data'}
          </p>
        </div>
      </div>

      <p className="mt-5 text-center text-[10px] font-medium text-slate-500">Stock indicators reflect cached daily close rates.</p>
    </div>
  );
};

export default Charts;
