
import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryManagerProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onClearHistory: () => void;
  historyCount: number;
}

const HistoryManager: React.FC<HistoryManagerProps> = ({ isEnabled, onToggle, onClearHistory, historyCount }) => {
  return (
    <div className="bg-slate-800/60 p-4 rounded-xl shadow-md border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <HistoryIcon className="w-6 h-6 text-cyan-400" />
        <h3 className="text-lg font-semibold text-slate-200">Historial de Generación</h3>
      </div>
      <div className="flex items-center gap-4">
        {historyCount > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-rose-400 hover:text-rose-300 disabled:opacity-50"
            aria-label="Clear history"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Borrar Historial ({historyCount})</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isEnabled ? 'text-slate-200' : 'text-slate-400'}`}>
            {isEnabled ? 'Activado' : 'Desactivado'}
          </span>
          <button
            onClick={() => onToggle(!isEnabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-brand-primary ${
              isEnabled ? 'bg-brand-primary' : 'bg-slate-600'
            }`}
            role="switch"
            aria-checked={isEnabled}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryManager;
