import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';

const formatConfidence = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }
  return Math.max(0, Math.min(100, numericValue));
};

const RecommendationCard = ({ recommendation, isFallback }) => {
  const [showDevilsAdvocate, setShowDevilsAdvocate] = useState(false);
  const score = recommendation?.score ?? null;
  const action = (recommendation?.action || 'WATCH').toUpperCase();
  const confidenceValue = formatConfidence(recommendation?.confidence);
  const opposingThesis = recommendation?.opposingThesis || 'No opposing thesis compiled.';
  
  // Decide colors and icons based on INVEST / WATCH / PASS
  let badgeColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]';
  let gradientTextClass = 'text-gradient-gold';
  let Icon = FiAlertTriangle;
  
  if (action === 'INVEST') {
    badgeColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]';
    gradientTextClass = 'text-gradient-emerald';
    Icon = FiCheckCircle;
  } else if (action === 'PASS') {
    badgeColor = 'text-rose-400 border-rose-500/20 bg-rose-500/10 shadow-[0_0_15px_-3px_rgba(244,63,94,0.2)]';
    gradientTextClass = 'text-gradient-rose';
    Icon = FiAlertCircle;
  }

  if (isFallback || recommendation == null || recommendation?.action == null) {
    return (
      <div className="glass-panel rounded-3xl p-6 shadow-soft">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">AI Recommendation</p>
        <div className="mt-4 rounded-2xl border border-white/5 bg-gray-950/40 p-5">
          <p className="text-base font-semibold text-slate-300">🤖 AI Recommendation Unavailable</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {recommendation?.reasoning || 'Recommendation could not be computed at the moment.'}
          </p>
        </div>
      </div>
    );
  }

  // Set up gauge color variables
  let strokeColor = '#f59e0b'; // Amber
  if (action === 'INVEST') strokeColor = '#10b981'; // Emerald
  else if (action === 'PASS') strokeColor = '#f43f5e'; // Rose

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 shadow-soft relative overflow-hidden transition-all duration-300">
      
      {/* Devil's Advocate Header Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setShowDevilsAdvocate(!showDevilsAdvocate)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all border ${
            showDevilsAdvocate
              ? 'bg-rose-500/20 border-rose-500/30 text-rose-300 shadow-[0_0_10px_-2px_rgba(244,63,94,0.3)]'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          😈 {showDevilsAdvocate ? "Standard Thesis" : "Devil's Advocate"}
        </button>
      </div>

      {!showDevilsAdvocate ? (
        <motion.div 
          key="standard-thesis"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          
          {/* Qualitative Verdict Details */}
          <div className="flex-1 space-y-4 pr-16">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">System Verdict</p>
              <div className={`mt-2.5 inline-flex items-center gap-2 rounded-full border px-4.5 py-1.5 text-sm font-bold uppercase tracking-wider ${badgeColor}`}>
                <Icon className="text-base" />
                {action}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {recommendation?.reasoning}
            </p>
            
            {/* Confidence bar */}
            {confidenceValue !== null && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Confidence Rating</span>
                  <span className="text-white font-mono">{confidenceValue}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-950 border border-white/5 p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${confidenceValue}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Circular Score Gauge */}
          {score !== null && (
            <div className="flex flex-col items-center justify-center sm:min-w-[150px]">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90 gauge-svg">
                  <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke={strokeColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                    animate={{ strokeDasharray: 283, strokeDashoffset: 283 - (283 * score) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight font-display">{score}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Score</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          key="opposing-thesis"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="space-y-4 pr-16 animate-fade-in"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400">Risk Assessment</p>
            <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4.5 py-1.5 text-sm font-bold uppercase tracking-wider text-rose-400 shadow-[0_0_15px_-3px_rgba(244,63,94,0.2)]">
              <FiAlertCircle className="text-base" />
              COUNTER-THESIS
            </div>
          </div>
          <p className="text-sm leading-relaxed text-rose-200/90 bg-rose-950/20 border border-rose-500/10 rounded-2xl p-4.5">
            {opposingThesis}
          </p>
          <p className="text-[10px] font-semibold text-slate-500 italic">
            *This section aggregates critic node issues and risk variables to present the worst-case scenario.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RecommendationCard;
