
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface ApiInputCardProps {
  curlInput: string;
  setCurlInput: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  apiKey: string;
}

const ApiInputCard: React.FC<ApiInputCardProps> = ({ curlInput, setCurlInput, onGenerate, isLoading, apiKey }) => {
  const isButtonDisabled = isLoading || !curlInput.trim() || !apiKey;

  return (
    <div className="w-full bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <label htmlFor="curl-command" className="block text-lg font-medium text-slate-300 mb-2">
        Comando cURL
      </label>
      <div className="relative">
        <textarea
          id="curl-command"
          value={curlInput}
          onChange={(e) => setCurlInput(e.target.value)}
          placeholder="Pegue aquí un comando cURL para generar pruebas de API..."
          className="w-full h-48 p-4 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 resize-y disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
          disabled={isLoading || !apiKey}
        />
      </div>

      <div className="text-right text-xs text-slate-500 mt-1 pr-1">
        {curlInput.length.toLocaleString()} caracteres
      </div>
      <div className="mt-4 flex justify-end items-center gap-4">
        <button
          onClick={onGenerate}
          disabled={isButtonDisabled}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          aria-label="Generar Escenarios de API"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generar Escenarios
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ApiInputCard;
