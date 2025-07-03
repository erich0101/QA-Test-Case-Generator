
import React from 'react';

interface AlreadyCopiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlreadyCopiedModal: React.FC<AlreadyCopiedModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl p-6 m-4 max-w-sm w-full border border-slate-700 transform transition-all duration-300 scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-100 mb-4">Aviso</h2>
        
        <p className="text-slate-300 mb-6">
          Ya has copiado este contenido. ¿Estás seguro de que quieres copiarlo de nuevo?, asegutare de no estar duplicandolo en tu matriz de pruebas.
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 transition-colors duration-200"
          >
            Copiar de nuevo
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

export default AlreadyCopiedModal;
