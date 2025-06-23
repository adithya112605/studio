
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
      if (window.VANTA && window.THREE && vantaRef.current) {
        effect = window.VANTA.NET({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          points: 13.00,
          spacing: 17.00,
          color: resolvedTheme === 'dark' ? 0x6487e3 : 0xb18282, 
          backgroundColor: resolvedTheme === 'dark' ? 0x020610 : 0xfafafa,
        });
        setVantaEffect(effect);
      }
    };
    
    const checkScriptsAndInit = () => {
      if (window.VANTA && window.THREE) {
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
