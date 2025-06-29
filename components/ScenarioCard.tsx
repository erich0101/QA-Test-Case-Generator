import React from 'react';
import { ScenarioResult } from '../types';
import AcceptanceCriterion from './AcceptanceCriterion';

interface ScenarioCardProps {
  scenario: ScenarioResult;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  
  return (
    <article className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-brand-primary hover:shadow-cyan-500/10">
      <header className="p-4 bg-slate-800 border-b border-slate-700">
        <h3 className="text-xl font-semibold text-cyan-400">{scenario.title}</h3>
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