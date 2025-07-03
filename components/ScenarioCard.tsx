
import React, { useState } from 'react';
import { ScenarioResult } from '../types';
import AcceptanceCriterion from './AcceptanceCriterion';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ScenarioCardProps {
  scenario: ScenarioResult;
  copiedScenarioIds: string[];
  setCopiedScenarioIds: (ids: string[] | ((prevIds: string[]) => string[])) => void;
  setShowCopyWarningModal: (show: boolean) => void;
  setCopyAction: (action: (() => void) | null) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ 
  scenario,
  copiedScenarioIds,
  setCopiedScenarioIds,
  setShowCopyWarningModal,
  setCopyAction
 }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const copyLogic = () => {
      const criteriaText = scenario.criteria.map(c => `• ${c}`).join('\n');
      const fullText = `Título: ${scenario.title}\n\n${scenario.gherkin}\n\nCriterios de Aceptación:\n${criteriaText}`;
      
      navigator.clipboard.writeText(fullText).then(() => {
        setIsCopied(true);
        if (!copiedScenarioIds.includes(scenario.id)) {
            setCopiedScenarioIds(prev => [...prev, scenario.id]);
        }
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      });
    };

    if (copiedScenarioIds.includes(scenario.id)) {
        setCopyAction(() => copyLogic);
        setShowCopyWarningModal(true);
    } else {
        copyLogic();
    }
  };
  
  return (
    <article className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-brand-primary hover:shadow-cyan-500/10">
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-cyan-400">{scenario.title}</h3>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors duration-200"
          aria-label="Copiar escenario"
        >
          <ClipboardIcon className="w-4 h-4" />
          <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </header>
      
      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Escenarios Gherkin</h4>
          <pre className="bg-black/50 p-4 rounded-lg text-sm text-slate-300 font-mono whitespace-pre-wrap">
            <code>{scenario.gherkin}</code>
          </pre>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">✅ Criterios de Aceptacion</h4>
          <div className="bg-black/50 p-3 rounded-lg text-sm font-mono">
             <div className="space-y-2">
                {scenario.criteria.map((criterion, index) => (
                <AcceptanceCriterion
                    key={index}
                    text={criterion}
                />
                ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ScenarioCard;
