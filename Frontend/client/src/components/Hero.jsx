import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

const Hero = ({ query, onQueryChange, onAnalyze, isLoading }) => {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 pulse-glow-blue">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Multi-Agent Research Pipeline
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 sm:text-6xl lg:text-7xl font-display leading-tight">
          InvestIQ AI Research
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Analyze any company instantly. Our autonomous multi-agent graph collects financials, audits sentiment, evaluates risks, and maps competitive moats to generate institutional-grade recommendations.
        </p>
        <div className="mt-10">
          <SearchBar value={query} onChange={onQueryChange} onSubmit={onAnalyze} isLoading={isLoading} />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
