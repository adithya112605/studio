
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

  // Effect for CREATING and DESTROYING the Vanta instance.
  // It runs only when the component mounts and unmounts.
  useEffect(() => {
    let effect: any;
    
    // We can't initialize if Vanta script isn't loaded yet.
    // So we'll poll until it's ready.
    if (typeof window !== "undefined" && vantaRef.current) {
      const checkVanta = setInterval(() => {
        if (window.VANTA) {
          clearInterval(checkVanta);
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
            color: 0x3175ff,
            points: 13.00,
            spacing: 17.00
            // Initial background color is set in the next effect
          });
          setVantaEffect(effect);
        }
      }, 500); // Check every 500ms

       // Cleanup the interval if the component unmounts before Vanta loads
      return () => clearInterval(checkVanta);
    }
    
    // Cleanup function. This will be called when the component unmounts.
    return () => {
      if (effect) effect.destroy();
    };
  // The empty dependency array [] means this effect runs only once on mount.
  }, []);

  // This separate effect handles UPDATING the background color when the theme changes.
  useEffect(() => {
    if (vantaEffect && resolvedTheme) {
      vantaEffect.setOptions({
        backgroundColor: resolvedTheme === 'dark' ? 0x020610 : 0xfafafa,
      });
    }
  }, [resolvedTheme, vantaEffect]);


  return <div ref={vantaRef} className="absolute inset-0 z-0 w-full h-full" />;
};

export default VantaBackground;
