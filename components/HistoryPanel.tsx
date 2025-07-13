
import React, { forwardRef } from 'react';
import { E2EHistoryItem, ApiHistoryItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { HistoryIcon } from './icons/HistoryIcon';


interface HistoryPanelProps {
  history: (E2EHistoryItem | ApiHistoryItem)[];
  onLoadItem: (item: E2EHistoryItem | ApiHistoryItem) => void;
  onDeleteItem: (id: string) => void;
}

const HistoryPanel = forwardRef<HTMLDivElement, HistoryPanelProps>(
  ({ history, onLoadItem, onDeleteItem }, ref) => {

    const isApiItem = (item: any): item is ApiHistoryItem => 'curlInput' in item;

    const truncateText = (text: string, length = 100) => {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    };

    if (history.length === 0) {
      return null;
    }

    return (
      <div className="mt-8" ref={ref}>
        <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-2 mb-4">
          <HistoryIcon className="w-6 h-6 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-200">
            Historial
          </h2>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {history.map(item => {
            const input = isApiItem(item) ? item.curlInput : item.userInput;
            const hasImages = !isApiItem(item) && item.images.length > 0;

            return (
              <div key={item.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors hover:border-slate-600">
                <div className="flex-grow overflow-hidden w-full">
                  <div className="text-xs text-slate-400 mb-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-words">
                    {truncateText(input) || (hasImages ? `[${item.images.length} image(s)]` : `[Sin entrada de texto]`)}
                  </p>
                  <div className="text-xs text-cyan-400 mt-1">
                    {item.scenarios.length} escenario(s) generado(s)
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => onLoadItem(item)}
                    className="px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    aria-label="Load this history item"
                  >
                    Cargar
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label="Delete this history item"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
);

export default HistoryPanel;
