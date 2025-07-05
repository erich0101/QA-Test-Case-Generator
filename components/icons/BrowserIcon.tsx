
import React from 'react';

export const BrowserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.621.206 1.278.317 1.976.317 1.272 0 2.46-.364 3.445-1.003m-4.431 8.187c.39.223.82.384 1.27.468m-1.943-1.125a23.945 23.945 0 01-.256-4.63m0 0a23.923 23.923 0 01-.43-4.522m1.157 8.948c.848-1.29 1.53-2.843 1.874-4.568m-1.157 8.948L10.5 21m5.25-11.25h.008v.008H15.75v-.008z" 
    />
     <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M3.75 9.75h16.5v10.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V9.75z" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3.75 6.75h16.5M5.25 4.5h.008v.008H5.25V4.5zm1.5 0h.008v.008H6.75V4.5zm1.5 0h.008v.008H8.25V4.5z"
    />
  </svg>
);
