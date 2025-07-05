
import React, { useState, useCallback, useEffect } from 'react';
import { RawScenario, ScenarioResult, ImageAttachment, ApiScenario, ApiScenarioResult } from './types';
import { generateScenarios } from './services/geminiService';
import InputCard from './components/InputCard';
import ResultsDisplay from './components/ResultsDisplay';
import ApiResultsDisplay from './components/ApiResultsDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import ApiKeyManager from './components/ApiKeyManager';
import { LinkedInIcon } from './components/icons/LinkedInIcon';
import { GithubIcon } from './components/icons/GithubIcon';
import InvalidFileModal from './components/InvalidFileModal';
import InfoModal from './components/InfoModal';
import { QuestionMarkCircleIcon } from './components/icons/QuestionMarkCircleIcon';
import AlreadyCopiedModal from './components/AlreadyCopiedModal';
import { encrypt, decrypt } from './services/secureStore';
import ModeSelector from './components/ModeSelector';
import ApiInputCard from './components/ApiInputCard';


type AppMode = 'e2e' | 'api';

// Type guards
function isRawScenarioArray(data: any): data is RawScenario[] {
    return Array.isArray(data) && (data.length === 0 || ('title' in data[0] && 'gherkin' in data[0] && 'acceptanceCriteria' in data[0]));
}
function isApiScenarioArray(data: any): data is ApiScenario[] {
    return Array.isArray(data) && (data.length === 0 || ('title' in data[0] && 'gherkin' in data[0] && 'method' in data[0]));
}


function App() {
  const [mode, setMode] = useState<AppMode>('e2e');
  
  // E2E state
  const [userInput, setUserInput] = useState<string>('');
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);
  
  // API state
  const [curlInput, setCurlInput] = useState<string>('');
  const [apiScenarios, setApiScenarios] = useState<ApiScenarioResult[]>([]);

  // Common state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showInvalidFileModal, setShowInvalidFileModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copiedScenarioIds, setCopiedScenarioIds] = useState<string[]>([]);
  const [showCopyWarningModal, setShowCopyWarningModal] = useState(false);
  const [copyAction, setCopyAction] = useState<(() => void) | null>(null);


  useEffect(() => {
    // Carga y descifra la clave de API del almacenamiento local en el renderizado inicial
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      const decryptedKey = decrypt(storedApiKey);
      setApiKey(decryptedKey);
    }
  }, []);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    if (newKey) {
      const encryptedKey = encrypt(newKey);
      localStorage.setItem('gemini_api_key', encryptedKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handleGenerate = useCallback(async () => {
    const isE2EMode = mode === 'e2e';
    const isApiMode = mode === 'api';

    if (isLoading || !apiKey) return;
    if (isE2EMode && !userInput.trim() && images.length === 0) return;
    if (isApiMode && !curlInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isE2EMode) {
        const result = await generateScenarios('e2e', userInput, apiKey, images);
        if (isRawScenarioArray(result)) {
            const newScenarios: ScenarioResult[] = result.map((scenario, index) => ({
                id: `${Date.now()}-${index}`,
                title: scenario.title,
                gherkin: scenario.gherkin,
                criteria: scenario.acceptanceCriteria,
            }));
            setScenarios(prevScenarios => [...prevScenarios, ...newScenarios]);
        } else {
            throw new Error('La API devolvió un tipo de datos inesperado para el modo E2E.');
        }

      } else { // API Mode
        const result = await generateScenarios('api', curlInput, apiKey);
        if (isApiScenarioArray(result)) {
            const newApiScenarios: ApiScenarioResult[] = result.map((scenario, index) => ({
                ...scenario,
                id: `${Date.now()}-${index}`,
            }));
            setApiScenarios(prevScenarios => [...prevScenarios, ...newApiScenarios]);
        } else {
            throw new Error('La API devolvió un tipo de datos inesperado para el modo API.');
        }
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [mode, userInput, curlInput, isLoading, apiKey, images]);

  const handleClear = useCallback(() => {
    // E2E
    setScenarios([]);
    setError(null);
    setImages([]);
    setUserInput('');
    // API
    setApiScenarios([]);
    setCurlInput('');
    // Common
    setCopiedScenarioIds([]); // Reset copied tracker
  }, []);
  
  const handleInvalidFileType = () => {
    setShowInvalidFileModal(true);
  };

  const handleConfirmCopy = () => {
    if (copyAction) {
      copyAction();
    }
    setShowCopyWarningModal(false);
    setCopyAction(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <SparklesIcon className="w-7 h-7 text-brand-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
              QA Test Case Generator
            </h1>
          </div>
          <p className="text-slate-400">
            Powered by Gemini, este asistente le ayuda a crear escenarios de prueba completos.
          </p>
        </header>

        <div className="space-y-6">
          <ApiKeyManager apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
          
          <ModeSelector mode={mode} setMode={setMode} />

          {mode === 'e2e' ? (
             <InputCard
              userInput={userInput}
              setUserInput={setUserInput}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              apiKey={apiKey}
              images={images}
              setImages={setImages}
              onInvalidFileType={handleInvalidFileType}
            />
          ) : (
            <ApiInputCard
              curlInput={curlInput}
              setCurlInput={setCurlInput}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              apiKey={apiKey}
            />
          )}

          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-2 mt-4 text-sm text-yellow-400"
              aria-label="About this application"
            >
              <QuestionMarkCircleIcon className="w-8 h-8 text-yellow-400" />
              <span>Información importante sobre el uso y limitaciones</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-rose-900/50 border border-brand-danger text-rose-200 rounded-lg">
            <h3 className="font-bold mb-2">Generation Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {mode === 'e2e' && scenarios.length > 0 && (
          <ResultsDisplay 
            scenarios={scenarios} 
            onClear={handleClear}
            copiedScenarioIds={copiedScenarioIds}
            setCopiedScenarioIds={setCopiedScenarioIds}
            setShowCopyWarningModal={setShowCopyWarningModal}
            setCopyAction={setCopyAction}
          />
        )}
        
        {mode === 'api' && apiScenarios.length > 0 && (
          <ApiResultsDisplay
            scenarios={apiScenarios}
            onClear={handleClear}
          />
        )}
      </main>
      <footer className="text-center mt-12 text-slate-500 text-sm">
        <div className="flex justify-center items-center gap-3 mb-2">
          <span>Created by Erich Petrocelli</span>
          <a 
            href="https://www.linkedin.com/in/erichpetrocelli/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Erich Petrocelli's LinkedIn Profile" 
            className="text-slate-400 hover:opacity-80 transition-opacity"
          >
            <LinkedInIcon className="w-7 h-7" />
          </a>
          <a 
            href="https://github.com/erich0101/QA-Test-Case-Generator" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Project's GitHub Repository" 
            className="text-slate-400 hover:text-white transition-colors"
          >
            <GithubIcon className="w-6 h-6" />
          </a>
        </div>
        <p className="text-slate-600 mt-1">API Key is stored encrypted in your browser's local storage.</p>
      </footer>
      
      <InvalidFileModal 
        isOpen={showInvalidFileModal}
        onClose={() => setShowInvalidFileModal(false)}
      />
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
      <AlreadyCopiedModal
        isOpen={showCopyWarningModal}
        onClose={() => setShowCopyWarningModal(false)}
        onConfirm={handleConfirmCopy}
      />
    </div>
  );
}

export default App;
