import { FiAlertTriangle, FiCpu, FiRadio, FiSearch, FiWifiOff } from 'react-icons/fi';

const variants = {
  network: {
    icon: FiWifiOff,
    cardClass: 'border-amber-500/10 bg-amber-500/[0.02]',
    iconClass: 'bg-amber-500/10 text-amber-400'
  },
  company: {
    icon: FiSearch,
    cardClass: 'border-sky-500/10 bg-sky-500/[0.02]',
    iconClass: 'bg-sky-500/10 text-sky-400'
  },
  ai: {
    icon: FiCpu,
    cardClass: 'border-violet-500/10 bg-violet-500/[0.02]',
    iconClass: 'bg-violet-500/10 text-violet-400'
  },
  news: {
    icon: FiRadio,
    cardClass: 'border-emerald-500/10 bg-emerald-500/[0.02]',
    iconClass: 'bg-emerald-500/10 text-emerald-400'
  },
  default: {
    icon: FiAlertTriangle,
    cardClass: 'border-rose-500/10 bg-rose-500/[0.02]',
    iconClass: 'bg-rose-500/10 text-rose-400'
  }
};

const ErrorCard = ({ message, title = 'Analysis unavailable', subtitle, variant = 'default' }) => {
  const config = variants[variant] || variants.default;
  const Icon = config.icon;

  return (
    <div className={`glass-panel rounded-3xl p-8 text-center shadow-soft ${config.cardClass}`} role="alert" aria-live="polite">
      <div className="mb-4 flex justify-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.iconClass}`}>
          <Icon className="text-xl" />
        </div>
      </div>
      <h3 className="text-lg font-bold font-display text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 font-medium">{message}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
    </div>
  );
};

export default ErrorCard;
