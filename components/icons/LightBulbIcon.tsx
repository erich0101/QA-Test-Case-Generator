import React from 'react';

export const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311V21m-3.75-2.311v-.698a2.25 2.25 0 012.25-2.25h.01M12 3.75a6.75 6.75 0 00-6.75 6.75c0 3.523 2.11 6.542 5.12 7.917V12.75A2.25 2.25 0 0112 10.5h.01M12 3.75a6.75 6.75 0 016.75 6.75c0 3.523-2.11 6.542-5.12 7.917V12.75a2.25 2.25 0 00-2.25-2.25h-.01" 
    />
  </svg>
);
