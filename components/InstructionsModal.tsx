
import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl p-6 m-4 max-w-2xl w-full border border-slate-700 transform transition-all duration-300 scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4">
            <div className="p-2 bg-cyan-900/50 rounded-full">
                <BookOpenIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Cómo Obtener los Mejores Resultados</h2>
        </div>
        
        <div className="text-slate-300 space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <section>
                <h3 className="font-semibold text-lg text-cyan-400 mb-2">1. Proporciona Historias de Usuario Claras</h3>
                <p>
                    Una historia de usuario bien definida, específica y sin ambigüedades es el mejor punto de partida. Cuanto más claros sean el objetivo, los actores y los resultados esperados, más precisos serán los escenarios generados.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-lg text-cyan-400 mb-2">2. Adjunta Imágenes para Dar Contexto Visual</h3>
                <p>
                    Una imagen vale más que mil palabras. Adjunta capturas de pantalla, mockups de Figma o cualquier otro recurso visual de la interfaz de usuario. Esto ayuda a la IA a comprender el diseño, los elementos interactivos y el flujo de la pantalla.
                </p>
            </section>
            
            <section>
                <h3 className="font-semibold text-lg text-cyan-400 mb-2">3. Combina Texto y Reglas de Negocio con Imágenes</h3>
                <p>
                    El mejor resultado se obtiene al combinar una descripción textual con imágenes de apoyo. Esto es especialmente útil cuando la historia de usuario se centra más en reglas de negocio complejas que en la descripción del flujo de la interfaz. La imagen proporciona el contexto visual que el texto podría omitir.
                </p>
            </section>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-700 text-right">
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

export default InstructionsModal;
