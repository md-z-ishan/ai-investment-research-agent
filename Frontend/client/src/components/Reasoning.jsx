const Reasoning = ({ analysis }) => {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 shadow-soft">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Executive Summary & Thesis</p>
      <h3 className="text-xl font-bold font-display text-white mt-1 mb-5">AI Analyst Memorandum</h3>
      <div className="space-y-4">
        {analysis?.map((point) => (
          <div key={point} className="rounded-2xl border border-white/5 bg-gray-950/20 p-5 text-sm leading-relaxed text-slate-300 font-medium">
            {point}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reasoning;
