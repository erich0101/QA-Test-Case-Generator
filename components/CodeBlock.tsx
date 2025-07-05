
import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      <pre className="bg-black/50 p-3 rounded-lg text-sm text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-slate-700/80 text-slate-300 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 hover:bg-slate-600"
        aria-label="Copy code"
      >
        <ClipboardIcon className="w-4 h-4" />
      </button>
      {isCopied && (
        <span className="absolute top-2 right-10 px-2 py-1 bg-emerald-500 text-white text-xs rounded-md">
          Copiado!
        </span>
      )}
    </div>
  );
};

export default CodeBlock;
