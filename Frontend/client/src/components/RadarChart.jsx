import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-950/95 p-3 shadow-soft backdrop-blur-md">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">{payload[0].name}</p>
        <p className="mt-1 text-lg font-extrabold text-white font-mono">{payload[0].value}/100</p>
      </div>
    );
  }
  return null;
};

const RadarChartWrapper = ({ scores }) => {
  // Map scores data structure
  const data = [
    { subject: 'Financials', value: scores?.financial ?? 50, fullMark: 100 },
    { subject: 'Sentiment', value: scores?.sentiment ?? 50, fullMark: 100 },
    { subject: 'Safety', value: scores?.safety ?? 50, fullMark: 100 },
    { subject: 'Competition', value: scores?.competitive ?? 50, fullMark: 100 },
  ];

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 shadow-soft flex flex-col justify-between h-[360px]">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Dimension Benchmarks</p>
        <h3 className="text-xl font-bold font-display text-white mt-1">Multi-Agent Vector Map</h3>
      </div>
      
      <div className="w-full h-[260px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#475569', fontSize: 8 }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Index Rating"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartWrapper;
