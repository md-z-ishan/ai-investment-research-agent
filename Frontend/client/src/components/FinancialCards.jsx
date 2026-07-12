const tooltipText = {
  'Market Cap': 'The total market value of a company\'s outstanding shares.',
  'Pe Ratio': 'The stock price divided by earnings per share.',
  'Eps': 'Earnings per share for the most recent period.',
  'Profit Margin': 'The percentage of revenue that becomes profit.'
};

const FinancialCards = ({ metricsData }) => {
  const items = Object.entries(metricsData || {}).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
    value
  }));

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {items.map((item) => (
        <div
          key={item.label}
          className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-soft"
          title={tooltipText[item.label] || ''}
          aria-label={item.label}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/80">{item.label}</p>
          <p className="mt-2 text-lg font-bold tracking-tight text-white font-display">{item.value || 'N/A'}</p>
        </div>
      ))}
    </div>
  );
};

export default FinancialCards;
