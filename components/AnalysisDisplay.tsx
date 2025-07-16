import React from 'react';
import { LightBulbIcon } from './icons/LightBulbIcon';

interface AnalysisDisplayProps {
  markdownContent: string;
}

interface ParsedProblem {
  id: number;
  type: string;
  description: string;
  explanation: string;
  suggestion: string;
}

const parseAnalysis = (content: string): ParsedProblem[] | null => {
  if (!content || !content.includes('Problemas Detectados')) {
    return null;
  }
  
  const problems: ParsedProblem[] = [];
  // Split the content by a newline followed by a digit and a dot, which marks a new problem.
  const problemBlocks = content.split(/\n(?=\d+\.\s\*\*)/);
  
  // The first element might be the header, so we check and remove it.
  if (problemBlocks[0] && problemBlocks[0].includes('## 🧱 Problemas Detectados')) {
      const headerlessContent = problemBlocks[0].split('## 🧱 Problemas Detectados')[1];
      if(headerlessContent && headerlessContent.trim()) {
        problemBlocks[0] = headerlessContent.trim();
      } else {
        problemBlocks.shift();
      }
  }

  problemBlocks.forEach((block, index) => {
    if (!block.trim()) return;

    const lines = block.trim().split('\n');
    const titleLine = lines.shift() || '';
    const explanationLine = lines.find(l => l.includes('🔍 Explicación:')) || '';
    const suggestionLine = lines.find(l => l.includes('✅ Sugerencia:')) || '';

    // Regex to capture: 1. **Type**: Description
    const titleMatch = titleLine.match(/\d+\.\s\*\*(.*?)\*\*:\s(.*)/);
    const type = titleMatch ? titleMatch[1].trim() : 'Problema';
    const description = titleMatch ? titleMatch[2].trim() : titleLine;

    const explanation = explanationLine.replace(/.*🔍\sExplicación:\s/, '').trim();
    const suggestion = suggestionLine.replace(/.*✅\sSugerencia:\s/, '').trim();

    if(explanation || suggestion){
        problems.push({ id: index, type, description, explanation, suggestion });
    }
  });

  return problems.length > 0 ? problems : null;
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ markdownContent }) => {
  const parsedProblems = parseAnalysis(markdownContent);

  if (!parsedProblems) {
    return null; // Don't render anything if no problems were parsed
  }

  return (
    <div className="mt-8 bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-3 mb-4">
        <LightBulbIcon className="w-7 h-7 text-yellow-400" />
        <h2 className="text-2xl font-bold text-slate-200">
          Análisis de la Historia de Usuario
        </h2>
      </div>
      <div className="space-y-6">
        {parsedProblems.map(problem => (
          <div key={problem.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">
              <span className="text-yellow-400">{problem.type}:</span> {problem.description}
            </h3>
            <div className="space-y-3 text-slate-300">
              {problem.explanation && (
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0" aria-hidden="true">🔍</span>
                  <p><strong className="text-slate-400 font-medium">Explicación:</strong> {problem.explanation}</p>
                </div>
              )}
              {problem.suggestion && (
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0" aria-hidden="true">✅</span>
                  <p><strong className="text-slate-400 font-medium">Sugerencia:</strong> {problem.suggestion}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisDisplay;
