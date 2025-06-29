import React from 'react';

interface AcceptanceCriterionProps {
  text: string;
}

const AcceptanceCriterion: React.FC<AcceptanceCriterionProps> = ({ text }) => {
  return (
    <div className="flex items-start gap-3">
      <span className="text-slate-500 mt-0.5">•</span>
      <span className="flex-1 text-slate-300 break-words">{text}</span>
    </div>
  );
};

export default AcceptanceCriterion;