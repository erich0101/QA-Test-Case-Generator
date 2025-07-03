
import React, { useState, useCallback, useEffect } from 'react';
import { RawScenario, ScenarioResult, ImageAttachment } from './types';
import { generateTestScenarios } from './services/geminiService';
import InputCard from './components/InputCard';
import ResultsDisplay from './components/ResultsDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import ApiKeyManager from './components/ApiKeyManager';
import { LinkedInIcon } from './components/icons/LinkedInIcon';
import InvalidFileModal from './components/InvalidFileModal';
import InfoModal from './components/InfoModal';
import { QuestionMarkCircleIcon } from './components/icons/QuestionMarkCircleIcon';
import AlreadyCopiedModal from './components/AlreadyCopiedModal';

function App() {
  const [userInput, setUserInput] = useState<string>('');
  const [image, setImage] = useState<ImageAttachment | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showInvalidFileModal, setShowInvalidFileModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copiedScenarioIds, setCopiedScenarioIds] = useState<string[]>([]);
  const [showCopyWarningModal, setShowCopyWarningModal] = useState(false);
  const [copyAction, setCopyAction] = useState<(() => void) | null>(null);


  useEffect(() => {
    // Load API key from local storage on initial render
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('gemini_api_key', newKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handleGenerate = useCallback(async () => {
    if ((!userInput.trim() && !image) || isLoading || !apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const result: RawScenario[] = await generateTestScenarios(userInput, apiKey, image);
      const newScenarios: ScenarioResult[] = result.map((scenario, index) => ({
        id: `${Date.now()}-${index}`,
        title: scenario.title,
        gherkin: scenario.gherkin,
        criteria: scenario.acceptanceCriteria,
      }));
      setScenarios(prevScenarios => [...prevScenarios, ...newScenarios]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, apiKey, image]);

  const handleClear = useCallback(() => {
    setScenarios([]);
    setError(null);
    setImage(null);
    setUserInput('');
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
            Powered by Gemini, este asistente le ayuda a crear escenarios de prueba completos a partir de historias de usuarios.
          </p>
        </header>

        <div className="space-y-6">
          <ApiKeyManager apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
          
          <div className="flex flex-col items-center">
            <InputCard
              userInput={userInput}
              setUserInput={setUserInput}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              apiKey={apiKey}
              image={image}
              setImage={setImage}
              onInvalidFileType={handleInvalidFileType}
            />
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

        <ResultsDisplay 
          scenarios={scenarios} 
          onClear={handleClear}
          copiedScenarioIds={copiedScenarioIds}
          setCopiedScenarioIds={setCopiedScenarioIds}
          setShowCopyWarningModal={setShowCopyWarningModal}
          setCopyAction={setCopyAction}
        />
      </main>
      <footer className="text-center mt-12 text-slate-500 text-sm">
        <div className="flex justify-center items-center gap-2 mb-2">
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
        </div>
        <p className="text-slate-600 mt-1">API Key is stored in your browser's local storage.</p>
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
