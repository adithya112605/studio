
// src/components/common/LTLogo.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface LTLogoProps {
  className?: string;
}

const LTLogo = ({ className }: LTLogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // For SSR or before theme is resolved, we can render a static version or nothing.
  // A simple div with background might be best to avoid content layout shift.
  if (!mounted) {
    return <div className={className} style={{ width: '32px', height: '32px', backgroundColor: '#005BAC' }} data-ai-hint="company logo placeholder"></div>;
  }

  const isDark = resolvedTheme === 'dark';
  const bgColor = isDark ? '#FFFFFF' : '#005BAC';
  const textColor = isDark ? '#005BAC' : '#FFFFFF';

  return (
    <div className={className} style={{ width: '32px', height: '32px' }} data-ai-hint="company logo">
      <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill={bgColor} />
        <text x="50" y="55" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="bold" fill={textColor}>
            LT
        </text>
      </svg>
    </div>
  );
};

export default LTLogo;

    