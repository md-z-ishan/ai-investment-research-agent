import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="glass-panel rounded-3xl p-8 shadow-soft" role="status" aria-live="polite">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-10 w-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500"
          />
          <div>
            <p className="text-base font-bold text-white font-display">Gathering Market Context</p>
            <p className="text-xs text-slate-500 mt-0.5">Fetching financials, news updates, and compiling agent state...</p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-800/50" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-800/50" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
