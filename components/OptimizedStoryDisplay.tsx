
import React from 'react';
import { DocumentCheckIcon } from './icons/DocumentCheckIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface OptimizedStoryDisplayProps {
  markdownContent: string;
}

const OptimizedStoryDisplay: React.FC<OptimizedStoryDisplayProps> = ({ markdownContent }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  if (!markdownContent) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const renderContent = () => {
    return markdownContent.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-slate-200 mt-4 mb-1">{line.substring(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-cyan-400 mt-5 mb-2 border-b border-slate-700 pb-1">{line.substring(3)}</h2>;
      }
       if (line.startsWith('> **')) {
        return <p key={index} className="pl-4 border-l-4 border-slate-600 italic text-slate-400 my-2">{line.substring(2)}</p>
      }

      // Bold text using **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);

      return (
        <p key={index} className="my-1">
          {parts.map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={i} className="font-bold text-slate-200">{part.slice(2, -2)}</strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className="mt-8 bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="flex justify-between items-center border-b-2 border-slate-700 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <DocumentCheckIcon className="w-7 h-7 text-emerald-400" />
          <h2 className="text-2xl font-bold text-slate-200">
            Historia de Usuario Optimizada
          </h2>
        </div>
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-cyan-300 bg-cyan-900/50 border border-brand-primary rounded-lg hover:bg-cyan-800/70 transition-colors duration-200"
            aria-label="Copiar historia optimizada"
        >
            <ClipboardIcon className="w-4 h-4" />
            <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </div>
      <div className="text-slate-300 leading-relaxed prose-styles">
        {renderContent()}
      </div>
      <style>{`
        .prose-styles strong {
            color: #e2e8f0;
        }
        .prose-styles h2 {
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid #475569;
            font-size: 1.5rem;
            font-weight: 700;
            color: #22d3ee;
        }
        .prose-styles h3 {
            margin-top: 1.25rem;
            margin-bottom: 0.25rem;
            font-size: 1.25rem;
            font-weight: 600;
            color: #f1f5f9;
        }
        .prose-styles p {
            margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default OptimizedStoryDisplay;
