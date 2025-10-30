import React from 'react';

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a12.025 12.025 0 01-4.25 6.11m-1.59-6.11a12.025 12.025 0 00-4.25-6.11m7.5 0a9 9 0 00-7.5 0m7.5 0a3 3 0 11-7.5 0m7.5 0a3 3 0 00-7.5 0" 
    />
  </svg>
);