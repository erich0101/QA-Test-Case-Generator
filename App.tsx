import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { RawScenario, ScenarioResult, ImageAttachment, ApiScenario, ApiScenarioResult, E2EHistoryItem, ApiHistoryItem } from './types';
import { generateScenarios, analyzeUserStory, optimizeUserStory } from './services/geminiService';
import InputCard from './components/InputCard';
import ResultsDisplay from './components/ResultsDisplay';
import ApiResultsDisplay from './components/ApiResultsDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import ApiKeyManager from './components/ApiKeyManager';
import { LinkedInIcon } from './components/icons/LinkedInIcon';
import { GithubIcon } from './components/icons/GithubIcon';
import InvalidFileModal from './components/InvalidFileModal';
import InfoModal from './components/InfoModal';
import InstructionsModal from './components/InstructionsModal';
import { QuestionMarkCircleIcon } from './components/icons/QuestionMarkCircleIcon';
import AlreadyCopiedModal from './components/AlreadyCopiedModal';
import { encrypt, decrypt } from './services/secureStore';
import ModeSelector from './components/ModeSelector';
import ApiInputCard from './components/ApiInputCard';
import HistoryManager from './components/HistoryManager';
import HistoryPanel from './components/HistoryPanel';
import AnalysisDisplay from './components/AnalysisDisplay';
import ApiInstructionsModal from './components/ApiInstructionsModal';
import OptimizedStoryDisplay from './components/OptimizedStoryDisplay';


type AppMode = 'e2e' | 'api';

// localStorage keys
const HISTORY_ENABLED_KEY = 'history_enabled';
const E2E_HISTORY_KEY = 'e2e_history';
const API_HISTORY_KEY = 'api_history';


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
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [optimizedStory, setOptimizedStory] = useState<string | null>(null);


  // API state
  const [curlInput, setCurlInput] = useState<string>('');
  const [apiScenarios, setApiScenarios] = useState<ApiScenarioResult[]>([]);

  // History state
  const [isHistoryEnabled, setIsHistoryEnabled] = useState<boolean>(false);
  const [e2eHistory, setE2eHistory] = useState<E2EHistoryItem[]>([]);
  const [apiHistory, setApiHistory] = useState<ApiHistoryItem[]>([]);

  // Common state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showInvalidFileModal, setShowInvalidFileModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showApiInstructionsModal, setShowApiInstructionsModal] = useState(false);
  const [copiedScenarioIds, setCopiedScenarioIds] = useState<string[]>([]);
  const [showCopyWarningModal, setShowCopyWarningModal] = useState(false);
  const [copyAction, setCopyAction] = useState<(() => void) | null>(null);

  const historyPanelRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Load API Key
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      const decryptedKey = decrypt(storedApiKey);
      setApiKey(decryptedKey);
    }

    // Load history settings and data
    try {
        const historyEnabled = localStorage.getItem(HISTORY_ENABLED_KEY);
        setIsHistoryEnabled(historyEnabled ? JSON.parse(historyEnabled) : false);

        const storedE2EHistory = localStorage.getItem(E2E_HISTORY_KEY);
        setE2eHistory(storedE2EHistory ? JSON.parse(storedE2EHistory) : []);

        const storedApiHistory = localStorage.getItem(API_HISTORY_KEY);
        setApiHistory(storedApiHistory ? JSON.parse(storedApiHistory) : []);
    } catch (e) {
        console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Sync history state with localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_ENABLED_KEY, JSON.stringify(isHistoryEnabled));
  }, [isHistoryEnabled]);
  
  useEffect(() => {
    localStorage.setItem(E2E_HISTORY_KEY, JSON.stringify(e2eHistory));
  }, [e2eHistory]);

  useEffect(() => {
    localStorage.setItem(API_HISTORY_KEY, JSON.stringify(apiHistory));
  }, [apiHistory]);


  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    if (newKey) {
      const encryptedKey = encrypt(newKey);
      localStorage.setItem('gemini_api_key', encryptedKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handleE2EGeneration = useCallback(async () => {
    if (isLoading || !apiKey) return;
    if (!userInput.trim() && images.length === 0) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const [analysis, scenariosData] = await Promise.all([
        analyzeUserStory(userInput, apiKey, images),
        generateScenarios('e2e', userInput, apiKey, images),
      ]);

      setAnalysisResult(analysis);

      if (isRawScenarioArray(scenariosData)) {
        const newScenarios: ScenarioResult[] = scenariosData.map(
          (scenario, index) => ({
            id: `${Date.now()}-${index}`,
            title: scenario.title,
            gherkin: scenario.gherkin,
            criteria: scenario.acceptanceCriteria,
            expectedResult: scenario.expectedResult,
            assumption: scenario.assumption,
            preconditions: scenario.preconditions,
            testData: scenario.testData,
          })
        );
        setScenarios((prevScenarios) => [...prevScenarios, ...newScenarios]);

        if (isHistoryEnabled) {
          const historyItem: E2EHistoryItem = {
            id: `hist-e2e-${Date.now()}`,
            timestamp: Date.now(),
            userInput: userInput,
            images: images,
            scenarios: newScenarios,
            analysisResult: analysis,
            optimizedStory: optimizedStory || undefined, // Include existing optimized story
          };
          setE2eHistory((prev) => [historyItem, ...prev]);
        }
      } else {
        throw new Error(
          'La API devolvió un tipo de datos inesperado para la generación de escenarios E2E.'
        );
      }
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error
          ? e.message
          : 'An unknown error occurred. Please check the console.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [userInput, images, isLoading, apiKey, isHistoryEnabled, optimizedStory]);

  const handleOptimize = useCallback(async () => {
    if (isLoading || !apiKey) return;
    if (!userInput.trim() && images.length === 0) return;

    setIsLoading(true);
    setError(null);
    setOptimizedStory(null);

    try {
        const optimizedStoryData = await optimizeUserStory(userInput, apiKey, images);
        setOptimizedStory(optimizedStoryData);
    } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred while optimizing. Please check the console.');
    } finally {
        setIsLoading(false);
    }
  }, [userInput, images, isLoading, apiKey]);


  const handleApiGeneration = useCallback(async () => {
    if (isLoading || !apiKey) return;
    if (!curlInput.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
        const result = await generateScenarios('api', curlInput, apiKey);
        if (isApiScenarioArray(result)) {
            const newApiScenarios: ApiScenarioResult[] = result.map((scenario, index) => ({
                ...scenario,
                id: `${Date.now()}-${index}`,
            }));
            setApiScenarios(prevScenarios => [...prevScenarios, ...newApiScenarios]);
             if (isHistoryEnabled) {
                const historyItem: ApiHistoryItem = {
                    id: `hist-api-${Date.now()}`,
                    timestamp: Date.now(),
                    curlInput: curlInput,
                    scenarios: newApiScenarios
                };
                setApiHistory(prev => [historyItem, ...prev]);
            }
        } else {
            throw new Error('La API devolvió un tipo de datos inesperado para el modo API.');
        }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [curlInput, isLoading, apiKey, isHistoryEnabled]);


  const handleGenerate = () => {
    if (mode === 'e2e') {
        handleE2EGeneration();
    } else {
        handleApiGeneration();
    }
  };

  const handleGenerateAndOptimize = () => {
    if (mode === 'e2e') {
        handleOptimize();
    }
  };

  const handleClear = useCallback(() => {
    // E2E
    setScenarios([]);
    setError(null);
    setImages([]);
    setUserInput('');
    setAnalysisResult(null);
    setOptimizedStory(null);
    // API
    setApiScenarios([]);
    setCurlInput('');
    // Common
    setCopiedScenarioIds([]); // Reset copied tracker
  }, []);

  const handleToggleHistory = (enabled: boolean) => {
    setIsHistoryEnabled(enabled);
  };

  const handleClearHistory = () => {
    if (mode === 'e2e') {
        setE2eHistory([]);
    } else {
        setApiHistory([]);
    }
  };

  const handleLoadHistoryItem = (item: E2EHistoryItem | ApiHistoryItem) => {
    handleClear(); // Clear current state before loading
    if (mode === 'e2e' && 'userInput' in item) {
        setUserInput(item.userInput);
        setImages(item.images);
        setScenarios(item.scenarios);
        setAnalysisResult(item.analysisResult || null);
        setOptimizedStory(item.optimizedStory || null);
    } else if (mode === 'api' && 'curlInput' in item) {
        setCurlInput(item.curlInput);
        setApiScenarios(item.scenarios);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteHistoryItem = (id: string) => {
    if (mode === 'e2e') {
        setE2eHistory(prev => prev.filter(item => item.id !== id));
    } else {
        setApiHistory(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const handleGoToHistory = () => {
    historyPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const handleDeleteScenario = (idToDelete: string) => {
    setScenarios(prevScenarios => prevScenarios.filter(scenario => scenario.id !== idToDelete));
  };

  const currentHistory = mode === 'e2e' ? e2eHistory : apiHistory;

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
          <HistoryManager
            isEnabled={isHistoryEnabled}
            onToggle={handleToggleHistory}
            onClearHistory={handleClearHistory}
            onGoToHistory={handleGoToHistory}
            historyCount={currentHistory.length}
          />
          
          <ModeSelector mode={mode} setMode={setMode} />

          {mode === 'e2e' ? (
             <InputCard
              userInput={userInput}
              setUserInput={setUserInput}
              onGenerate={handleGenerate}
              onGenerateAndOptimize={handleGenerateAndOptimize}
              isLoading={isLoading}
              apiKey={apiKey}
              images={images}
              setImages={setImages}
              onInvalidFileType={handleInvalidFileType}
              onShowInstructions={() => setShowInstructionsModal(true)}
            />
          ) : (
            <ApiInputCard
              curlInput={curlInput}
              setCurlInput={setCurlInput}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              apiKey={apiKey}
              onShowInstructions={() => setShowApiInstructionsModal(true)}
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
        
        {mode === 'e2e' && analysisResult && (
          <AnalysisDisplay markdownContent={analysisResult} />
        )}
        
        {mode === 'e2e' && optimizedStory && (
          <OptimizedStoryDisplay markdownContent={optimizedStory} />
        )}

        {mode === 'e2e' && scenarios.length > 0 && (
          <ResultsDisplay 
            scenarios={scenarios} 
            onClear={handleClear}
            copiedScenarioIds={copiedScenarioIds}
            setCopiedScenarioIds={setCopiedScenarioIds}
            setShowCopyWarningModal={setShowCopyWarningModal}
            setCopyAction={setCopyAction}
            onDeleteScenario={handleDeleteScenario}
          />
        )}
        
        {mode === 'api' && apiScenarios.length > 0 && (
          <ApiResultsDisplay
            scenarios={apiScenarios}
            onClear={handleClear}
            curlInput={curlInput}
          />
        )}

        <HistoryPanel 
            ref={historyPanelRef}
            history={currentHistory}
            onLoadItem={handleLoadHistoryItem}
            onDeleteItem={handleDeleteHistoryItem}
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
      <InstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
      />
       <ApiInstructionsModal
        isOpen={showApiInstructionsModal}
        onClose={() => setShowApiInstructionsModal(false)}
      />
      <AlreadyCopiedModal
        isOpen={showCopyWarningModal}
        onClose={() => setShowCopyWarningModal(false)}
        onConfirm={handleConfirmCopy}
      />
      <Analytics />
    </div>
  );
}

export default App;