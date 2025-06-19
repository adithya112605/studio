// src/components/common/LTLogo.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

  const lightThemeLogoSrc = "https://placehold.co/32x32/005BAC/FFFFFF.png?text=LT"; // L&T Blue background, White text
  const darkThemeLogoSrc = "https://placehold.co/32x32/FFFFFF/005BAC.png?text=LT";   // White background, L&T Blue text

  if (!mounted) {
    // Fallback for SSR or before theme is resolved, matching the light theme visual
    return (
      <div className={className} style={{ width: '32px', height: '32px' }}>
        <Image
          src={lightThemeLogoSrc}
          alt="L&T Helpdesk Logo"
          width={32}
          height={32}
          priority
          data-ai-hint="company logo"
        />
      </div>
    );
  }

  const logoSrc = resolvedTheme === 'dark' ? darkThemeLogoSrc : lightThemeLogoSrc;

  return (
    <div className={className} style={{ width: '32px', height: '32px' }}>
      <Image
        src={logoSrc}
        alt="L&T Helpdesk Logo"
        width={32}
        height={32}
        priority 
        key={resolvedTheme} // Add key to force re-render on theme change if needed
        data-ai-hint="company logo"
      />
    </div>
  );
};

export default LTLogo;
