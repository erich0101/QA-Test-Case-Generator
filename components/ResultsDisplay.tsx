import React from 'react';
import { ScenarioResult } from '../types';
import ScenarioCard from './ScenarioCard';

interface ResultsDisplayProps {
  scenarios: ScenarioResult[];
  onClear: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ scenarios, onClear }) => {
  if (scenarios.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center border-b-2 border-slate-700 pb-2">
        <h2 className="text-2xl font-bold text-slate-200">
          Escenarios Generados ({scenarios.length})
        </h2>
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm font-semibold text-rose-300 bg-rose-900/50 border border-brand-danger rounded-lg hover:bg-rose-800/70 transition-colors duration-200"
          aria-label="Borra todos los escenarios"
        >
          Clear All
        </button>
      </div>

      {scenarios.map((scenario) => (
        <ScenarioCard 
          key={scenario.id} 
          scenario={scenario} 
        />
      ))}
    </div>
  );
};

export default ResultsDisplay;