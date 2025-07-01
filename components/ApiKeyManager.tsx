
import React, { useState, useEffect } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { InfoIcon } from './icons/InfoIcon';

interface ApiKeyManagerProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKey, onApiKeyChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!apiKey) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [apiKey]);

  const handleSave = () => {
    onApiKeyChange(inputValue);
    setIsEditing(false);
  };

  const handleClear = () => {
    onApiKeyChange('');
    setInputValue('');
  };

  const handleEdit = () => {
    setInputValue(apiKey);
    setIsEditing(true);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '****';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <div className="bg-slate-800/60 p-4 rounded-xl shadow-md border border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <KeyIcon className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-200">Gemini API Key</h3>
        </div>
        {!isEditing && apiKey && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded">{maskApiKey(apiKey)}</span>
            <button onClick={handleEdit} className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">Edit</button>
            <button onClick={handleClear} className="text-sm text-rose-400 hover:text-rose-300 font-semibold">Clear</button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste your API key here"
              className="flex-grow p-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200"
            />
            <button
              onClick={handleSave}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 disabled:bg-slate-600 transition-colors duration-200"
            >
              Save
            </button>
          </div>
          <div className="flex items-start gap-2 p-3 bg-slate-900/50 rounded-lg text-sm text-slate-400">
            <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-cyan-500" />
            <p>
              Tu clave de API se almacena únicamente en el almacenamiento local de tu navegador y nunca se envía a ningún otro lugar que no sea la API de Google.
              Puedes obtener una clave de API gratuita en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-300">Google AI Studio</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
