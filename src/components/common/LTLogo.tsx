// src/components/common/LTLogo.tsx
import React from 'react';

// Simplified L&T-like SVG representation
const LTLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="3" />
    {/* L part - stylized */}
    <path d="M19 22 V42 H34" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    {/* T part - stylized and slightly offset to appear as the T from L&T logo */}
    <path d="M32 22 H45 M38.5 22 V42" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default LTLogo;
