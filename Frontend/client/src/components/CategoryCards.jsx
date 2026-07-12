import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiHeart, FiAlertOctagon, FiShield, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CategoryCard = ({ title, score, icon: Icon, colorClass, borderClass, summary, pros = [], cons = [], extraContent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`glass-panel rounded-3xl transition-all duration-300 ${borderClass} bg-slate-900/[0.15]`}>
      {/* Header (Always Visible) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/80 border border-white/5 ${colorClass}`}>
            <Icon className="text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">{title}</h4>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Specialist Agent</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 font-mono block">Rating</span>
            <p className={`text-sm font-extrabold font-mono ${colorClass}`}>{score}/100</p>
          </div>
          <div className="text-slate-400 hover:text-white transition-colors">
            {isExpanded ? <FiChevronUp className="text-lg" /> : <FiChevronDown className="text-lg" />}
          </div>
        </div>
      </div>

      {/* Expanded Details Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-5 space-y-4 text-xs">
              {/* Summary Paragraph */}
              <div className="bg-gray-950/40 rounded-xl p-3 border border-white/5">
                <p className="text-slate-300 leading-relaxed font-medium">{summary || 'No summary overview provided.'}</p>
              </div>

              {/* Extra data metrics (PE, Risk factors, Competitors, etc.) */}
              {extraContent && (
                <div className="bg-gray-950/60 rounded-xl p-3 border border-white/5">
                  {extraContent}
                </div>
              )}

              {/* Pros & Cons Columns */}
              <div className="grid gap-4 sm:grid-cols-2">
                {pros.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="font-bold text-emerald-400 uppercase tracking-wider text-[9px]">Strengths & Drivers</p>
                    <ul className="space-y-1">
                      {pros.map((pro, i) => (
                        <li key={i} className="text-slate-300 flex items-start gap-1.5 leading-relaxed font-medium">
                          <span className="text-emerald-400 font-bold shrink-0">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="font-bold text-rose-400 uppercase tracking-wider text-[9px]">Risks & Warnings</p>
                    <ul className="space-y-1">
                      {cons.map((con, i) => (
                        <li key={i} className="text-slate-300 flex items-start gap-1.5 leading-relaxed font-medium">
                          <span className="text-rose-400 font-bold shrink-0">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryCards = ({ data }) => {
  if (!data) return null;

  const { financialAnalysis, sentimentAnalysis, riskAnalysis, competitiveAnalysis } = data;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Detailed Breakdowns</p>
        <h3 className="text-xl font-bold font-display text-white mt-0.5">Specialist Agent Audit logs</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Financial Analyst */}
        {financialAnalysis && (
          <CategoryCard
            title="Financial Performance Audit"
            score={financialAnalysis.score}
            icon={FiTrendingUp}
            colorClass="text-sky-400"
            borderClass="hover:border-sky-500/20"
            summary={financialAnalysis.summary}
            pros={financialAnalysis.pros}
            cons={financialAnalysis.cons}
            extraContent={
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500 font-bold">P/E Ratio:</span>
                  <span className="ml-1 text-slate-300 font-mono">{(financialAnalysis.metricsUsed?.peRatio ?? 'N/A')}x</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Profit Margin:</span>
                  <span className="ml-1 text-slate-300 font-mono">
                    {financialAnalysis.metricsUsed?.profitMargin != null 
                      ? `${(financialAnalysis.metricsUsed.profitMargin * 100).toFixed(1)}%` 
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Diluted EPS:</span>
                  <span className="ml-1 text-slate-300 font-mono">${(financialAnalysis.metricsUsed?.eps ?? 'N/A')}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Market Value:</span>
                  <span className="ml-1 text-slate-300 font-mono">
                    {financialAnalysis.metricsUsed?.marketCap != null 
                      ? `$${(financialAnalysis.metricsUsed.marketCap / 1e9).toFixed(1)}B` 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            }
          />
        )}

        {/* Sentiment Analyst */}
        {sentimentAnalysis && (
          <CategoryCard
            title="Market Sentiment Audit"
            score={sentimentAnalysis.score}
            icon={FiHeart}
            colorClass="text-pink-400"
            borderClass="hover:border-pink-500/20"
            summary={sentimentAnalysis.summary}
            pros={sentimentAnalysis.pros}
            cons={sentimentAnalysis.cons}
            extraContent={
              <div className="text-[10px]">
                <span className="text-slate-500 font-bold">Media Sentiment Rating:</span>
                <span className="ml-1 text-pink-400 font-bold uppercase tracking-wider">{sentimentAnalysis.sentimentRating || 'Neutral'}</span>
              </div>
            }
          />
        )}

        {/* Risk Analyst */}
        {riskAnalysis && (
          <CategoryCard
            title="Risk Profile Assessment"
            score={riskAnalysis.score}
            icon={FiAlertOctagon}
            colorClass="text-amber-400"
            borderClass="hover:border-amber-500/20"
            summary={riskAnalysis.summary}
            pros={riskAnalysis.pros}
            cons={riskAnalysis.cons}
            extraContent={
              <div className="space-y-1">
                <span className="text-slate-500 font-bold text-[10px]">Key Risk Flags:</span>
                <div className="flex flex-wrap gap-1">
                  {(riskAnalysis.riskFactors || []).map((factor, i) => (
                    <span key={i} className="bg-amber-500/10 text-amber-300 text-[8px] font-bold px-2 py-0.5 rounded-full border border-amber-500/10">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            }
          />
        )}

        {/* Competitive Analyst */}
        {competitiveAnalysis && (
          <CategoryCard
            title="Competitive Moat Benchmarking"
            score={competitiveAnalysis.score}
            icon={FiShield}
            colorClass="text-emerald-400"
            borderClass="hover:border-emerald-500/20"
            summary={competitiveAnalysis.summary}
            pros={competitiveAnalysis.pros}
            cons={competitiveAnalysis.cons}
            extraContent={
              <div className="space-y-1">
                <span className="text-slate-500 font-bold text-[10px]">Identified Industry Peers:</span>
                <div className="flex flex-wrap gap-1">
                  {(competitiveAnalysis.competitors || []).map((peer, i) => (
                    <span key={i} className="bg-emerald-500/10 text-emerald-300 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/10">
                      {peer}
                    </span>
                  ))}
                </div>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

export default CategoryCards;
