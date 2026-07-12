import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import OverviewCard from '../components/OverviewCard';
import FinancialCards from '../components/FinancialCards';
import NewsSection from '../components/NewsSection';
import RecommendationCard from '../components/RecommendationCard';
import ProsCons from '../components/ProsCons';
import Reasoning from '../components/Reasoning';
import Charts from '../components/Charts';
import RadarChartWrapper from '../components/RadarChart';
import ProgressTimeline from '../components/ProgressTimeline';
import CategoryCards from '../components/CategoryCards';
import CitationsAndRawData from '../components/CitationsAndRawData';
import ErrorCard from '../components/ErrorCard';
import Footer from '../components/Footer';
import { useResearchStream } from '../hooks/useResearchStream';
import bgAgent from '../assets/bg-agent.jpg';
import ResearchCopilot from '../components/ResearchCopilot';

const Home = () => {
  const [query, setQuery] = useState('');
  const { data, error, isLoading, progressLogs, currentStep, analyzeCompany } = useResearchStream();

  const handleAnalyze = (event) => {
    event.preventDefault();
    analyzeCompany(query);
  };

  const getErrorVariant = (errorMessage = '') => {
    const normalizedError = errorMessage.toLowerCase();

    if (normalizedError.includes('no publicly listed company') || normalizedError.includes('company not found')) {
      return 'company';
    }

    if (normalizedError.includes('network') || normalizedError.includes('fetch') || normalizedError.includes('failed')) {
      return 'network';
    }

    if (normalizedError.includes('unavailable') || normalizedError.includes('fallback')) {
      return 'ai';
    }

    if (normalizedError.includes('news')) {
      return 'news';
    }

    return 'default';
  };

  const errorVariant = getErrorVariant(error);
  const errorTitle = error?.includes('No publicly listed company') ? 'Company not found' : error?.includes('AI recommendation') ? 'AI unavailable' : 'Analysis unavailable';

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      {/* Background Gradients and Matrix Grid Pattern */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Background Image with Opacity & Blend Mode */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity filter contrast-[1.2] brightness-[0.8]"
          style={{ backgroundImage: `url(${bgAgent})` }}
        />
        <div className="absolute top-[-10%] left-[-15%] h-[550px] w-[550px] rounded-full bg-indigo-500/10 blur-[130px] animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-[20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-violet-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute top-[35%] right-[20%] h-[450px] w-[450px] rounded-full bg-sky-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:28px_28px] opacity-75" />
      </div>

      <Navbar />
      <Hero query={query} onQueryChange={setQuery} onAnalyze={handleAnalyze} isLoading={isLoading} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:px-8">
        {!data && !error && !isLoading && (
          <div className="space-y-8">
            {/* Main Call to Action Hero Card */}
            <div className="rounded-[32px] border border-white/5 bg-slate-950/30 p-10 text-center shadow-soft relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.02] to-violet-500/[0.02] -z-10" />
              <h2 className="text-2xl font-bold font-display text-white">Advanced Investment Research Agent</h2>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
                Search any public company name above to launch a multi-agent LangGraph orchestration pipeline. Our system will analyze raw financials, news feeds, and competitor data to deliver verified ratings.
              </p>
            </div>

            {/* Agent Grid Preview */}
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Agent Network</p>
                <h3 className="text-lg font-bold font-display text-white mt-0.5">Orchestration Grid</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="glass-panel rounded-2xl p-5 space-y-2 border-white/5 bg-slate-950/20">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">01</div>
                  <h4 className="text-xs font-bold text-white font-display">Router & Validator</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Resolves exchanges ticker mappings, cleans company query names, and handles private enterprise filters.</p>
                </div>
                <div className="glass-panel rounded-2xl p-5 space-y-2 border-white/5 bg-slate-950/20">
                  <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">02</div>
                  <h4 className="text-xs font-bold text-white font-display">Market Scrapers</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Aggregates SEC indicators, Alpha Vantage margins, Yahoo stock bounds, and GNews publications in parallel.</p>
                </div>
                <div className="glass-panel rounded-2xl p-5 space-y-2 border-white/5 bg-slate-950/20">
                  <div className="h-8 w-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-xs">03</div>
                  <h4 className="text-xs font-bold text-white font-display">Specialist Analysts</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Four independent analysts auditing financial balance sheets, news bias, tail-risk factors, and competitor moats.</p>
                </div>
                <div className="glass-panel rounded-2xl p-5 space-y-2 border-white/5 bg-slate-950/20">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">04</div>
                  <h4 className="text-xs font-bold text-white font-display">Critic & Verifier</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Validates consolidated thesis consistency against raw data inputs, triggering feedback correction loops.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && <ProgressTimeline logs={progressLogs} currentStep={currentStep} />}
        {error && (
          <ErrorCard
            title={errorTitle}
            message={error.includes('No publicly listed company') ? 'We couldn’t find any publicly listed company matching your search.' : error}
            subtitle={error.includes('No publicly listed company') ? 'Please try another company name and try again.' : 'Please try again in a moment.'}
            variant={errorVariant}
          />
        )}

        {data && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <OverviewCard
              company={data.company}
              symbol={data.symbol}
              industry={data.industry}
              sector={data.sector}
              currentPrice={data.currentPrice}
            />

            <FinancialCards metricsData={data.metrics} />

            <div className="grid gap-6 md:grid-cols-2">
              <RecommendationCard recommendation={data.recommendation} isFallback={data.isFallback} />
              <RadarChartWrapper scores={data.scores} />
            </div>

            <CategoryCards data={data} />

            <div className="grid gap-6 md:grid-cols-2">
              <NewsSection news={data.news} />
              <Charts chartData={data.chartData} />
            </div>

            <ProsCons pros={data.pros} cons={data.cons} isFallback={data.isFallback} />
            <Reasoning analysis={data.analysis} />
            <CitationsAndRawData news={data.news} scores={data.scores} rawData={data} />
            <ResearchCopilot companyName={data.company} reportContext={data} />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
