
import React from 'react';
import { ApiScenarioResult } from '../types';
import CodeBlock from './CodeBlock';

interface ApiScenarioCardProps {
  scenario: ApiScenarioResult;
}

const ApiScenarioCard: React.FC<ApiScenarioCardProps> = ({ scenario }) => {

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'POST': return 'bg-green-500 text-white';
      case 'GET': return 'bg-blue-500 text-white';
      case 'PUT': return 'bg-yellow-500 text-black';
      case 'PATCH': return 'bg-orange-500 text-white';
      case 'DELETE': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const headersContent = JSON.stringify(scenario.headers, null, 2);
  const bodyContent = scenario.body ? (typeof scenario.body === 'string' ? scenario.body : JSON.stringify(scenario.body, null, 2)) : '// No Body';

  return (
    <article className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-brand-secondary hover:shadow-emerald-500/10">
      <header className="p-4 bg-slate-800 border-b border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400">{scenario.title}</h3>
        <p className="text-slate-400 mt-1 text-sm">{scenario.description}</p>
      </header>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Escenario Gherkin</h4>
            <pre className="bg-black/50 p-3 rounded-lg text-sm text-slate-300 font-mono whitespace-pre-wrap">
              <code>{scenario.gherkin}</code>
            </pre>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Request</h4>
            <div className="bg-black/50 p-3 rounded-lg text-sm font-mono space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${getMethodColor(scenario.method)}`}>{scenario.method}</span>
                <span className="text-cyan-400 break-all">{scenario.url}</span>
              </div>
              <div>
                <h5 className="text-slate-400 mt-3 mb-1 font-semibold">Headers:</h5>
                <CodeBlock code={headersContent} language="json" />
              </div>
               <div>
                <h5 className="text-slate-400 mt-3 mb-1 font-semibold">Body:</h5>
                <CodeBlock code={bodyContent} language={typeof scenario.body === 'string' ? 'text' : 'json'} />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-4">
            <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Scripts Postman</h4>
                 <div className="space-y-3">
                    <div>
                        <h5 className="text-slate-300 mb-1 font-semibold">Pre-request Script:</h5>
                        <CodeBlock code={scenario.preRequestScript || '// Ninguno'} language="javascript" />
                    </div>
                    <div>
                        <h5 className="text-slate-300 mb-1 font-semibold">Tests Script:</h5>
                        <CodeBlock code={scenario.testScript} language="javascript" />
                    </div>
                </div>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Variables y Sugerencias</h4>
              <div className="bg-black/50 p-3 rounded-lg text-sm space-y-3">
                <div>
                  <h5 className="text-slate-300 mb-2 font-semibold">Variables de Entorno:</h5>
                  <div className="flex flex-wrap gap-2">
                    {scenario.envVars.length > 0 ? scenario.envVars.map(v => <code key={v} className="px-2 py-1 bg-slate-700 text-cyan-300 rounded-md text-xs">{v}</code>) : <span className="text-slate-500">Ninguna</span>}
                  </div>
                </div>
                <div>
                  <h5 className="text-slate-300 mt-3 mb-2 font-semibold">Sugerencias:</h5>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    {scenario.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
        </div>
      </div>
    </article>
  );
};

export default ApiScenarioCard;
