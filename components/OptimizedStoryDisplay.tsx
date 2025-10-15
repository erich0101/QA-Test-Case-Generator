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
  
  const convertMarkdownToHtml = (markdown: string): string => {
    const lines = markdown.split('\n');
    let html = '';
    let inList = false;

    const parseLine = (line: string) => {
        return line
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    const closeList = () => {
        if (inList) {
            html += '</ul>';
            inList = false;
        }
    };

    lines.forEach(line => {
        if (line.trim() === '---') {
            closeList();
            html += '<hr style="border-top: 1px solid #475569; margin: 24px 0;" />';
            return;
        }
        if (line.startsWith('## ')) {
            closeList();
            html += `<h2 style="font-size: 1.5rem; font-weight: bold; color: #2dd4bf; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #475569; padding-bottom: 8px;">${parseLine(line.substring(3))}</h2>`;
            return;
        }
        if (line.startsWith('### ')) {
            closeList();
            html += `<h3 style="font-size: 1.25rem; font-weight: 600; color: #e2e8f0; margin-top: 16px; margin-bottom: 8px;">${parseLine(line.substring(4))}</h3>`;
            return;
        }
        if (line.startsWith('#### ')) {
            closeList();
            html += `<h4 style="font-size: 1.125rem; font-weight: 600; color: #cbd5e1; margin-top: 12px; margin-bottom: 4px;">${parseLine(line.substring(5))}</h4>`;
            return;
        }
        if (line.startsWith('> ')) {
            closeList();
            html += `<blockquote style="padding-left: 16px; border-left: 4px solid #475569; color: #94a3b8; margin: 4px 0;">${parseLine(line.substring(2))}</blockquote>`;
            return;
        }
        if (line.trim().startsWith('- ')) {
            if (!inList) {
                html += '<ul style="list-style-type: disc; list-style-position: inside; padding-left: 20px; margin: 8px 0; display: block;">';
                inList = true;
            }
            html += `<li style="color: #cbd5e1; line-height: 1.625; margin-bottom: 4px;">${parseLine(line.trim().substring(2))}</li>`;
            return;
        }
        
        closeList();

        if (line.trim() === '') {
            return; 
        }
        
        html += `<p style="margin: 4px 0; color: #cbd5e1; line-height: 1.625;">${parseLine(line)}</p>`;
    });

    closeList();
    return `<div style="font-family: sans-serif; color: #e2e8f0;">${html}</div>`;
  };

  const handleCopy = async () => {
    try {
      const html = convertMarkdownToHtml(markdownContent);
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([markdownContent], { type: 'text/plain' });
      
      const clipboardItem = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });

      await navigator.clipboard.write([clipboardItem]);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy rich text, falling back to plain text: ', err);
      navigator.clipboard.writeText(markdownContent).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const renderContent = () => {
    const lines = markdownContent.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside pl-5 my-2 space-y-1">{listItems}</ul>);
        listItems = [];
      }
    };

    const parseLine = (line: string) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-bold text-slate-100">{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      );
    };

    lines.forEach((line, index) => {
      const key = `line-${index}`;
      
      if (line.trim() === '---') {
        flushList();
        elements.push(<hr key={key} className="my-6 border-slate-700" />);
        return;
      }
      if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={key} className="text-2xl font-bold text-cyan-400 mt-6 mb-3 border-b border-slate-700 pb-2">{parseLine(line.substring(3))}</h2>);
        return;
      }
      if (line.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={key} className="text-xl font-semibold text-slate-200 mt-4 mb-2">{parseLine(line.substring(4))}</h3>);
        return;
      }
      if (line.startsWith('#### ')) {
        flushList();
        elements.push(<h4 key={key} className="text-lg font-semibold text-slate-300 mt-3 mb-1">{parseLine(line.substring(5))}</h4>);
        return;
      }
      if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={key} className="pl-4 border-l-4 border-slate-600 text-slate-400 my-1">
            {parseLine(line.substring(2))}
          </blockquote>
        );
        return;
      }
      if (line.trim().startsWith('- ')) {
        listItems.push(
          <li key={key} className="text-slate-300 leading-relaxed">
             {parseLine(line.trim().substring(2))}
          </li>
        );
        return;
      }
      
      flushList();

      if (line.trim() === '') {
        return; 
      }
      
      elements.push(
        <p key={key} className="my-1 text-slate-300 leading-relaxed">
          {parseLine(line)}
        </p>
      );
    });

    flushList();
    return elements;
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
      <div className="prose-styles">
        {renderContent()}
      </div>
    </div>
  );
};

export default OptimizedStoryDisplay;