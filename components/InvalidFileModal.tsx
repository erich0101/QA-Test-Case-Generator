
import React from 'react';
import { InfoIcon } from './icons/InfoIcon';

interface InvalidFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvalidFileModal: React.FC<InvalidFileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl p-6 m-4 max-w-md w-full border border-slate-700 transform transition-all duration-300 scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-900/50 rounded-full">
                <InfoIcon className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Archivo no Soportado</h2>
        </div>
        
        <div className="text-slate-300 space-y-4">
            <p>
                Para obtener la mejor calidad de resultados, por favor ingrese la descripción de las funcionalidades de forma textual o adjunte una <strong>imagen/captura de pantalla</strong>.
            </p>
            <p className="text-sm text-slate-400">
                El análisis de documentos (como PDF o Word) a través de OCR puede ser inconsistente y provocar fallos o imprecisiones en la generación de escenarios.
            </p>
            <div className="p-4 bg-slate-900/70 rounded-lg">
                <p className="font-semibold text-slate-200">¿Necesitas analizar un documento completo?</p>
                <p className="text-slate-400 mt-1">
                    Te recomendamos usar una herramienta especializada como{' '}
                    <a 
                        href="https://notebooklm.google.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-cyan-400 underline hover:text-cyan-300 transition-colors"
                    >
                        Google NotebookLM
                    </a>
                    , que es una solución completa para el análisis de documentación.
                </p>
            </div>
        </div>
        
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 transition-colors duration-200"
          >
            Entendido
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InvalidFileModal;
