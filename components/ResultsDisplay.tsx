
import React, { useState } from 'react';
import { ScenarioResult } from '../types';
import ScenarioCard from './ScenarioCard';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ResultsDisplayProps {
  scenarios: ScenarioResult[];
  onClear: () => void;
  copiedScenarioIds: string[];
  setCopiedScenarioIds: (ids: string[] | ((prevIds: string[]) => string[])) => void;
  setShowCopyWarningModal: (show: boolean) => void;
  setCopyAction: (action: (() => void) | null) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  scenarios, 
  onClear,
  copiedScenarioIds,
  setCopiedScenarioIds,
  setShowCopyWarningModal,
  setCopyAction
 }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (scenarios.length === 0) {
    return null;
  }

  const formatScenarioToText = (scenario: ScenarioResult): string => {
    const criteriaText = scenario.criteria.map(c => `• ${c}`).join('\n');
    return `Título: ${scenario.title}\n\n${scenario.gherkin}\n\nCriterios de Aceptación:\n${criteriaText}`;
  };

  const handleCopyAll = () => {
    const copyLogic = () => {
      const allScenariosText = scenarios
        .map(formatScenarioToText)
        .join('\n\n---\n\n');
      
      navigator.clipboard.writeText(allScenariosText).then(() => {
        setIsCopied(true);
        setCopiedScenarioIds(scenarios.map(s => s.id));
        setTimeout(() => setIsCopied(false), 2000);
      });
    };

    const allHaveBeenCopied = scenarios.length > 0 && scenarios.every(s => copiedScenarioIds.includes(s.id));

    if (allHaveBeenCopied) {
      setCopyAction(() => copyLogic);
      setShowCopyWarningModal(true);
    } else {
      copyLogic();
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center border-b-2 border-slate-700 pb-2">
        <h2 className="text-2xl font-bold text-slate-200">
          Escenarios Generados ({scenarios.length})
        </h2>
        <div className="flex items-center gap-2">
           <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-cyan-300 bg-cyan-900/50 border border-brand-primary rounded-lg hover:bg-cyan-800/70 transition-colors duration-200"
            aria-label="Copiar todos los escenarios"
          >
            <ClipboardIcon className="w-4 h-4" />
            <span>{isCopied ? 'All Copied!' : 'Copy All'}</span>
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-semibold text-rose-300 bg-rose-900/50 border border-brand-danger rounded-lg hover:bg-rose-800/70 transition-colors duration-200"
            aria-label="Borra todos los escenarios"
          >
            Clear All
          </button>
        </div>
      </div>

      {scenarios.map((scenario) => (
        <ScenarioCard 
          key={scenario.id} 
          scenario={scenario} 
          copiedScenarioIds={copiedScenarioIds}
          setCopiedScenarioIds={setCopiedScenarioIds}
          setShowCopyWarningModal={setShowCopyWarningModal}
          setCopyAction={setCopyAction}
        />
      ))}
    </div>
  );
};

export default ResultsDisplay;
