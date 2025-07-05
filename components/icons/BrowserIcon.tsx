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
        d="M4.5 4.5h15a1.5 1.5 0 011.5 1.5v1.5h-18V6a1.5 1.5 0 011.5-1.5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5h18v10.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18V7.5z"
      />
      <circle cx="6.5" cy="6" r="0.75" fill="currentColor" />
      <circle cx="9" cy="6" r="0.75" fill="currentColor" />
      <circle cx="11.5" cy="6" r="0.75" fill="currentColor" />
    </svg>
  );
  