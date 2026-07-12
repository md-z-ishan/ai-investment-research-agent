import { FiArrowUpRight } from 'react-icons/fi';

const NewsSection = ({ news }) => {
  const hasNews = Array.isArray(news) && news.length > 0;

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 shadow-soft">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Latest Intelligence</p>
        <h3 className="text-xl font-bold font-display text-white mt-1">Recent Market Developments</h3>
      </div>
      {hasNews ? (
        <div className="space-y-3">
          {news.map((article) => (
            <div key={article.title} className="flex items-start justify-between gap-3 rounded-2xl border border-white/5 bg-gray-950/20 p-4 transition-all duration-300 hover:border-indigo-500/20 hover:bg-gray-950/40">
              <div>
                <p className="font-semibold text-sm leading-snug text-white tracking-tight">{article.title}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="text-indigo-300">{article.source}</span>
                  <span className="text-slate-600">•</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>
              <button type="button" className="rounded-xl border border-white/5 bg-white/5 p-2.5 transition-all duration-200 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300" aria-label={`Open article: ${article.title}`}>
                <FiArrowUpRight />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-gray-950/40 p-6 text-center">
          <p className="text-sm font-semibold text-slate-300">News unavailable</p>
          <p className="mt-1 text-xs text-slate-500">Recent market updates are not available right now.</p>
        </div>
      )}
    </div>
  );
};

export default NewsSection;
