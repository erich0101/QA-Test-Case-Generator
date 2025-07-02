
import React from 'react';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
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
                <QuestionMarkCircleIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Guía Rápida y Alcance de la Herramienta</h2>
        </div>
        
        <div className="text-slate-300 space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <section>
                <h3 className="font-semibold text-lg text-cyan-400 mb-2">1. Aclaración Clave de Buenas Prácticas</h3>
                <p>
                    El análisis inicial y la comprensión profunda de cualquier historia de usuario o funcionalidad <strong className="text-slate-100">son responsabilidad del profesional de calidad.</strong> Esta herramienta no sustituye este paso crítico. Su función es ser un catalizador: acelera la redacción y facilita la edición de los casos de prueba. Cada escenario generado debe ser revisado, validado y ajustado por un experto antes de ser considerado 100% correcto y válido.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-lg text-cyan-400 mb-2">2. Propósito y Objetivo</h3>
                <p>
                    El objetivo principal de esta herramienta es <strong className="text-slate-100">acelerar drásticamente la creación de casos de prueba</strong> para equipos de QA y desarrollo. Utiliza IA para transformar historias de usuario y descripciones funcionales en escenarios de prueba detallados, liberando tiempo valioso para que los equipos se enfoquen en la estrategia de pruebas y la calidad del producto.
                </p>
            </section>
            
            <section>
                <h3 className="font-semibold text-lg text-cyan-400 mb-2">3. Enfoque Principal: BDD y Pruebas Funcionales</h3>
                <p>
                    La aplicación está especializada en generar escenarios de prueba en formato <strong className="text-slate-100">Gherkin (Dado, Cuando, Entonces)</strong> para metodologías BDD. Su punto fuerte es la creación de pruebas funcionales que validan el comportamiento observable por el usuario (frontend y flujos de la UI).
                </p>
            </section>
            
            <section>
                <h3 className="font-semibold text-lg text-rose-400 mb-2">4. Limitaciones Importantes (Para mejores resultados)</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                    <li><strong className="text-slate-200">Es un Asistente, no un Reemplazo:</strong> La IA es una herramienta de apoyo poderosa, pero la revisión y el criterio de un profesional de QA son insustituibles para garantizar la calidad final.</li>
                    <li><strong className="text-slate-200">La Calidad del Input es Clave:</strong> Una historia de usuario ambigua o mal definida generará casos de prueba igualmente ambiguos. Sé lo más claro y detallado posible en tu descripción.</li>
                    <li><strong className="text-slate-200">Análisis de Imágenes:</strong> La función de adjuntar imágenes es ideal para capturas de pantalla de interfaces de usuario (UI). El análisis de texto en imágenes complejas (OCR) puede tener imprecisiones.</li>
                    <li><strong className="text-slate-200">No Ejecuta Pruebas:</strong> Esta herramienta genera los *scripts* de los casos de prueba, no los ejecuta.</li>
                </ul>
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

export default InfoModal;
