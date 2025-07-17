
import React from 'react';
import { CommandLineIcon } from './icons/CommandLineIcon';

interface ApiInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiInstructionsModal: React.FC<ApiInstructionsModalProps> = ({ isOpen, onClose }) => {
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
                <CommandLineIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Cómo Obtener un Comando cURL</h2>
        </div>
        
        <div className="text-slate-300 space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <section>
                <h3 className="font-semibold text-lg text-cyan-400 mb-2">Opción 1: Desde las Herramientas del Desarrollador del Navegador (Recomendado)</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-400">
                    <li>Abre las <strong className="text-slate-200">Herramientas de Desarrollador</strong> en tu navegador (usualmente con F12 o clic derecho {'>'} Inspeccionar).</li>
                    <li>Ve a la pestaña <strong className="text-slate-200">"Network"</strong> o <strong className="text-slate-200">"Red"</strong>.</li>
                    <li>Realiza la acción en la página web que ejecuta la petición de API que quieres probar.</li>
                    <li>Busca la petición en la lista, haz clic derecho sobre ella.</li>
                    <li>Ve a <strong className="text-slate-200">"Copiar"</strong> o <strong className="text-slate-200">"Copy"</strong> y selecciona <strong className="text-yellow-300 font-bold">"Copiar como cURL (bash)"</strong> o <strong className="text-yellow-300 font-bold">"Copy as cURL (bash)"</strong>.</li>
                </ol>
            </section>

            <section>
                <h3 className="font-semibold text-lg text-cyan-400 mb-2">Opción 2: Desde Postman</h3>
                <p>
                    Si ya tienes la petición configurada en Postman, puedes generar el cURL desde allí:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-400 mt-2">
                    <li>Con tu petición abierta, busca el ícono de <strong className="text-slate-200">"Código"</strong> o <strong className="text-slate-200">{'</>'}</strong> en el panel derecho.</li>
                    <li>Se abrirá una ventana. En el menú desplegable, selecciona <strong className="text-slate-200">"cURL"</strong>.</li>
                    <li>Copia el código generado.</li>
                </ol>
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

export default ApiInstructionsModal;
