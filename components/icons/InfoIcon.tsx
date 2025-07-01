import React from 'react';

export const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M11.25 11.25l.25 5.25m.45-5.45l.25-5.25M11.25 11.25h.25m.45 0h.25m-1.125 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm1.125 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
