import { useState } from 'react';
import { FiGithub, FiCpu, FiZap } from 'react-icons/fi';
import WorkflowModal from './WorkflowModal';

const Navbar = () => {
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-20 border-b border-white/5 bg-gray-950/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)]">
              <FiCpu className="text-xl text-white" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 font-display">InvestIQ AI</p>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-indigo-300/80">Premium Research Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWorkflowOpen(true)}
              className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/10"
            >
              <FiZap className="text-indigo-400" />
              AI Workflow
            </button>
            <a
              href="https://github.com/md-z-ishan/ai-investment-research-agent"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-slate-100 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-indigo-500/20"
            >
              <FiGithub />
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <WorkflowModal isOpen={isWorkflowOpen} onClose={() => setIsWorkflowOpen(false)} />
    </>
  );
};

export default Navbar;
