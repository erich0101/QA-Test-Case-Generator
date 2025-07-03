
import React, { useRef, useCallback } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ImageAttachment } from '../types';

interface InputCardProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  apiKey: string;
  images: ImageAttachment[];
  setImages: (update: React.SetStateAction<ImageAttachment[]>) => void;
  onInvalidFileType: () => void;
}

const InputCard: React.FC<InputCardProps> = ({ userInput, setUserInput, onGenerate, isLoading, apiKey, images, setImages, onInvalidFileType }) => {
  const isButtonDisabled = isLoading || (!userInput.trim() && images.length === 0) || !apiKey;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File | null) => {
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImages(prevImages => [...prevImages, {
          mimeType: file.type,
          data: base64String,
        }]);
      };
      reader.readAsDataURL(file);
    } else {
      onInvalidFileType();
    }
  }, [setImages, onInvalidFileType]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      processFile(file);
    }
    
    // Reset file input to allow selecting the same file again
    if(event.target) {
        event.target.value = '';
    }
  };

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        processFile(file); 
      }
    }
  }, [processFile]);

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };


  return (
    <div className="w-full bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <label htmlFor="user-story" className="block text-lg font-medium text-slate-300 mb-2">
        Historia de Usuario o Descripcion Funcional.
      </label>
      <div className="relative">
        <textarea
          id="user-story"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onPaste={handlePaste}
          placeholder="'Escriba aqui la historia de usuario o pegue una imagen (Ctrl+V)... por ejemplo: Como usuario, quiero iniciar sesión con mi correo electrónico y contraseña para poder acceder a mi panel de control.'"
          className="w-full h-48 p-4 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !apiKey}
        />
        {images.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-2 p-2 bg-slate-900/80 rounded-lg border border-slate-600 max-w-[calc(100%-1.5rem)] overflow-x-auto">
             {images.map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={`data:${image.mimeType};base64,${image.data}`}
                    alt={`Preview ${index + 1}`}
                    className="h-16 w-auto object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-brand-danger transition-all"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-right text-xs text-slate-500 mt-1 pr-1">
        {userInput.length.toLocaleString()} caracteres
      </div>
      <div className="mt-4 flex justify-end items-center gap-4">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            multiple
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || !apiKey}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg shadow-md hover:bg-slate-600 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          aria-label="Attach image"
        >
          <PaperclipIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={onGenerate}
          disabled={isButtonDisabled}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          aria-label="Generar Escenarios"
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

export default InputCard;
