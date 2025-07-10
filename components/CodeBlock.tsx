import React, { useState, useEffect, useRef } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

// This will declare Prism for TypeScript, as it's loaded from a CDN
declare const Prism: any;

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text' }) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeEl = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if Prism is loaded and we have a ref to the code element
    if (typeof Prism !== 'undefined' && codeEl.current) {
        // Highlight the code block
        Prism.highlightElement(codeEl.current);
    }
  }, [code, language]); // Re-run effect when code or language changes

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      {/* 
        The `pre` tag is styled to integrate with the Prism 'Okaidia' theme.
        We let the theme handle background and text colors, but enforce
        padding, margin, and border-radius to match the app's design.
      */}
      <pre className="!p-3 !my-0 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto">
        <code ref={codeEl} className={`language-${language}`}>
          {code}
        </code>
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