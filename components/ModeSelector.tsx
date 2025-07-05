
import React from 'react';
import { BrowserIcon } from './icons/BrowserIcon';
import { ServerStackIcon } from './icons/ServerStackIcon';

type AppMode = 'e2e' | 'api';

interface ModeSelectorProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  const commonButtonClasses = 'flex-1 flex items-center justify-center gap-3 py-3 px-4 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  const activeButtonClasses = 'bg-brand-primary text-white shadow-lg scale-105';
  const inactiveButtonClasses = 'bg-slate-700 text-slate-300 hover:bg-slate-600';

  return (
    <div className="flex gap-2 sm:gap-4 p-1 bg-slate-800 rounded-xl border border-slate-700">
      <button
        onClick={() => setMode('e2e')}
        className={`${commonButtonClasses} ${mode === 'e2e' ? activeButtonClasses : inactiveButtonClasses}`}
        aria-pressed={mode === 'e2e'}
      >
        <BrowserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>Funcional E2E</span>
      </button>
      <button
        onClick={() => setMode('api')}
        className={`${commonButtonClasses} ${mode === 'api' ? activeButtonClasses : inactiveButtonClasses}`}
        aria-pressed={mode === 'api'}
      >
        <ServerStackIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>Funcional API</span>
      </button>
    </div>
  );
};

export default ModeSelector;
