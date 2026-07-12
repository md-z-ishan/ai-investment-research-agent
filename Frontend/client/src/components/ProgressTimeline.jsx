import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { FiCpu, FiTerminal, FiCheckCircle, FiActivity } from 'react-icons/fi';

const PIPELINE_STEPS = [
  { id: 'Router', label: 'Input validation & Ticker mapping' },
  { id: 'Data Collector', label: 'Scraping metrics & press feeds' },
  { id: 'Analysts', label: 'Parallel specialist agent deep audits' },
  { id: 'Synthesizer', label: 'Executive thesis consolidation' },
  { id: 'Critic', label: 'Skeptical critique & verification' },
  { id: 'Scoring Engine', label: 'Mathematical index scoring' },
];

const ProgressTimeline = ({ logs = [], currentStep = '' }) => {
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal log to bottom as new frames arrive
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Determine state of each phase
  const getStepState = (stepId, index) => {
    const isCompleted = logs.some(l => {
      if (stepId === 'Analysts') {
        return l.node.includes('Analyst') && l.message.includes('complete');
      }
      return l.node === stepId && l.message.includes('complete');
    });

    const isActive = currentStep === stepId || 
      (stepId === 'Analysts' && currentStep.includes('Analyst')) ||
      (!isCompleted && index === 0 && logs.length > 0 && currentStep === 'Router');

    return { isCompleted, isActive };
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] items-start w-full">
      {/* Visual Stepper */}
      <div className="glass-panel rounded-3xl p-6 shadow-soft space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Execution Stepper</p>
          <h3 className="text-lg font-bold font-display text-white mt-0.5">Pipeline Progression</h3>
        </div>

        <div className="relative pl-6 border-l border-white/5 space-y-7">
          {PIPELINE_STEPS.map((step, index) => {
            const { isCompleted, isActive } = getStepState(step.id, index);

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Dot */}
                <div 
                  className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                      : isActive 
                        ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse' 
                        : 'bg-gray-950 border-white/10'
                  }`}
                >
                  {isCompleted && (
                    <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                  {isActive && (
                    <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>

                {/* Content */}
                <div>
                  <p className={`text-xs font-bold transition-all duration-200 ${
                    isCompleted ? 'text-slate-400' : isActive ? 'text-white' : 'text-slate-600'
                  }`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] uppercase tracking-wider font-extrabold text-indigo-400">
                      <FiActivity className="animate-spin" /> Active Step
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Live Output Console */}
      <div className="glass-panel rounded-3xl p-6 shadow-soft flex flex-col h-[340px]">
        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <FiTerminal className="text-indigo-400 text-lg" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Agent Console</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500/80 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Stream Active</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl bg-gray-950/80 border border-white/5 p-4 font-mono text-[11px] leading-relaxed text-slate-300 space-y-2.5">
          {logs.length === 0 ? (
            <p className="text-slate-600 italic">Establishing SSE handshake... Waiting for agent payload.</p>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2"
              >
                <span className="text-indigo-400 shrink-0 select-none">&gt;</span>
                <div>
                  <span className="text-slate-500 font-bold shrink-0">[{log.node}]</span>{' '}
                  <span className="text-slate-200">{log.message}</span>
                </div>
              </motion.div>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ProgressTimeline;
