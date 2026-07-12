import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-2xl">
      <div className="glass-panel rounded-3xl p-1.5 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]">
        <div className="flex flex-col gap-2 rounded-[22px] border border-white/5 bg-gray-950/30 p-2 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 focus-within:border-indigo-500/30 transition-all duration-300">
            <FiSearch className="text-slate-400 text-lg" />
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search company (e.g. Apple, Tesla, NVIDIA)..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 font-medium"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all shadow-[0_0_20px_-3px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_-3px_rgba(99,102,241,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiArrowRight className="text-base" />
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </motion.button>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
        <span className="text-slate-500 font-medium">Try searching:</span>
        {['Tesla', 'Apple', 'Microsoft', 'NVIDIA'].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange(example)}
            className="rounded-full border border-white/5 bg-white/5 px-3 py-1.5 font-medium transition duration-200 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
};

export default SearchBar;
