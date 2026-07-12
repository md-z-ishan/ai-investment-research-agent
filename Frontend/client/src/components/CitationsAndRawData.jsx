import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink2, FiCode, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CitationsAndRawData = ({ news = [], scores = {}, rawData = null }) => {
  const [showRawJson, setShowRawJson] = useState(false);

  // Extract source links
  const newsSources = Array.isArray(news) ? news : [];
  const webSources = Array.isArray(rawData?.rawData?.generalSearch) ? rawData.rawData.generalSearch : [];

  return (
    <div className="space-y-6">
      {/* Sources List */}
      <div className="glass-panel rounded-3xl p-6 shadow-soft space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Verification & Citations</p>
          <h3 className="text-xl font-bold font-display text-white mt-0.5">Reference Sources</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* News Citations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">News Publications</h4>
            {newsSources.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No news references loaded.</p>
            ) : (
              <ul className="space-y-2">
                {newsSources.map((item, idx) => (
                  <li key={idx} className="text-xs">
                    <a 
                      href={item.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-start gap-1.5 font-medium leading-normal"
                    >
                      <FiLink2 className="text-slate-500 shrink-0 mt-0.5" />
                      <span>{item.title} <span className="text-slate-500 font-mono">({item.source})</span></span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Web search Citations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Competitor & Web Intelligence</h4>
            {webSources.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No competitor profiles search logs cached.</p>
            ) : (
              <ul className="space-y-2">
                {webSources.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="text-xs">
                    <a 
                      href={item.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-start gap-1.5 font-medium leading-normal"
                    >
                      <FiLink2 className="text-slate-500 shrink-0 mt-0.5" />
                      <span>{item.title || `Web Result #${idx + 1}`}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Raw Data Accordion */}
      <div className="glass-panel rounded-3xl p-5 shadow-soft">
        <div 
          onClick={() => setShowRawJson(!showRawJson)} 
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <FiCode className="text-indigo-400 text-lg" />
            <span>Raw Pipeline State Payload</span>
          </div>
          <div className="text-slate-400">
            {showRawJson ? <FiChevronUp className="text-lg" /> : <FiChevronDown className="text-lg" />}
          </div>
        </div>

        <AnimatePresence>
          {showRawJson && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-3"
            >
              <pre className="text-slate-400 font-mono text-[9px] bg-slate-950 p-4 rounded-xl overflow-x-auto border border-white/5 max-h-[360px] leading-relaxed">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CitationsAndRawData;
