
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
    let effect: any;
    // Check if scripts are loaded and component is mounted
    if (typeof window !== "undefined" && window.VANTA && window.THREE && vantaRef.current) {
      effect = window.VANTA.NET({
        el: vantaRef.current,
        THREE: window.THREE, // Vanta requires the THREE object to be passed
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff3b9e,
        backgroundColor: resolvedTheme === 'dark' ? 0x020610 : 0xfafafa, // Match theme background colors
        points: 12.00,
        maxDistance: 25.00,
        spacing: 17.00
      });
      setVantaEffect(effect);
    }

    // Cleanup function to destroy the effect on unmount
    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // This effect updates the background color whenever the theme changes
  useEffect(() => {
    if (vantaEffect) {
        vantaEffect.setOptions({
            backgroundColor: resolvedTheme === 'dark' ? 0x020610 : 0xfafafa,
        });
    }
  }, [resolvedTheme, vantaEffect]);


  return <div ref={vantaRef} className="absolute inset-0 z-0 w-full h-full" />;
};

export default VantaBackground;
