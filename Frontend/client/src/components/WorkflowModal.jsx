import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowDown, FiCpu, FiFileText, FiGlobe, FiSearch, FiZap, FiX } from 'react-icons/fi';

const workflowSteps = [
  {
    title: 'Input Routing & Ticker Mapping',
    subtitle: 'Router Node - validates search and maps tickers',
    icon: <FiSearch />
  },
  {
    title: 'Parallel Market Scraping & Web Search',
    subtitle: 'Data Collector Node - runs Alpha Vantage, NewsAPI, and Tavily search',
    icon: <FiGlobe />
  },
  {
    title: 'Parallel Specialist Analyst Audits',
    subtitle: 'Specialist Nodes - Financials, Sentiment, Risk, and Competition reviews',
    icon: <FiCpu />
  },
  {
    title: 'Investment Thesis Synthesis',
    subtitle: 'Synthesizer Node - consolidates analyst reports into unified copy',
    icon: <FiFileText />
  },
  {
    title: 'Skeptical Editorial Critique',
    subtitle: 'Critic Node - checks report consistency and handles correction retry loops',
    icon: <FiX />
  },
  {
    title: 'Mathematical Index Scoring',
    subtitle: 'Verdict Engine - calculates weighted investment index and confidence level',
    icon: <FiZap />
  }
];

const techBadges = ['React', 'Express', 'LangGraph', 'Gemini', 'Alpha Vantage', 'Tavily Search', 'NewsAPI'];

const WorkflowModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-soft backdrop-blur-xl sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              aria-label="Close workflow modal"
            >
              <FiX />
            </button>

            <div className="pr-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                <FiZap />
                Multi-Agent Graph
              </div>
              <h2 className="text-2xl font-bold font-display text-white sm:text-3xl">AI Research Pipeline</h2>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
                This application runs an orchestrator LangGraph routing company queries across specialized AI specialists before grading final investment scores.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center gap-1">
                  <div className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-indigo-300 text-sm">
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-normal">{step.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-normal">{step.subtitle}</p>
                    </div>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="flex items-center justify-center py-0.5 text-slate-600">
                      <FiArrowDown className="text-sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
              {techBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkflowModal;
