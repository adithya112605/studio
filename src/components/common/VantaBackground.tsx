
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

// Extend window type to include VANTA and THREE
declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

const VantaBackground = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let effect: any = null;

    const initVanta = () => {
      if (window.VANTA && window.VANTA.GLOBE && window.THREE && vantaRef.current) {
        // Use VANTA.GLOBE instead of VANTA.NET
        effect = window.VANTA.GLOBE({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          size: 0.7, // A good size for the globe
          // Set colors based on the current theme
          // Using accent color for main points and a muted color for lines to contrast with primary text
          color: resolvedTheme === 'dark' ? 0x60a5fa : 0x3b82f6, // Accent Blue (light/dark)
          color2: resolvedTheme === 'dark' ? 0x2d3d52 : 0xdbeafe, // Muted color for lines
          backgroundColor: resolvedTheme === 'dark' ? 0x020610 : 0xfafafa,
        });
        setVantaEffect(effect);
      }
    };
    
    const checkScriptsAndInit = () => {
      // Check for VANTA.GLOBE specifically, as the script has changed
      if (window.VANTA && window.VANTA.GLOBE && window.THREE) {
        initVanta();
      } else {
        setTimeout(checkScriptsAndInit, 500);
      }
    };

    checkScriptsAndInit();
    
    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, [resolvedTheme]); 

  return <div ref={vantaRef} className="absolute inset-0 z-0 w-full h-full" />;
};

export default VantaBackground;
