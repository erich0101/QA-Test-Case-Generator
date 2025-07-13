
import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';
import { InfoIcon } from './icons/InfoIcon';
import { GoToIcon } from './icons/GoToIcon';

interface HistoryManagerProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onClearHistory: () => void;
  onGoToHistory: () => void;
  historyCount: number;
}

const HistoryManager: React.FC<HistoryManagerProps> = ({ isEnabled, onToggle, onClearHistory, onGoToHistory, historyCount }) => {
  return (
    <div className="bg-slate-800/60 p-4 rounded-xl shadow-md border border-slate-700 space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-200">Historial de Generación</h3>
        </div>
        <div className="flex items-center gap-4">
          {historyCount > 0 && (
            <>
              <button
                onClick={onGoToHistory}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                aria-label="Go to history panel"
              >
                <GoToIcon className="w-4 h-4" />
                <span>Ver Historial</span>
              </button>
              <button
                onClick={onClearHistory}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-rose-400 hover:text-rose-300 disabled:opacity-50"
                aria-label="Clear history"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Borrar Historial ({historyCount})</span>
              </button>
            </>
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
      <div className="flex items-start gap-2 text-xs text-yellow-400 pt-3 border-t border-slate-700/60">
        <InfoIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Advertencia:</strong> El historial se guarda únicamente en el almacenamiento local de este navegador. Se perderá de forma permanente si limpia los datos del sitio o la caché.
        </p>
      </div>
    </div>
  );
};

export default HistoryManager;
