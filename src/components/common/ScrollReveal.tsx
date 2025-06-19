
"use client";

import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animationClass?: string; // e.g., 'animate-fadeInUp'
  delay?: number; // in ms
  threshold?: number;
  once?: boolean; // Only animate once
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  animationClass = 'animate-fadeInUp', // Default animation
  delay = 0,
  threshold = 0.1,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimated || !once) {
            setTimeout(() => {
              setIsVisible(true);
              if (once) {
                setHasAnimated(true);
              }
            }, delay);
          }
        } else {
          if (!once) {
            // setIsVisible(false); // Optionally reset if animation should replay on scroll out
          }
        }
      },
      {
        threshold: threshold,
      }
    );

    const currentRef = targetRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [delay, threshold, once, hasAnimated]);

  return (
    <div
      ref={targetRef}
      className={cn(
        'transition-opacity duration-700 ease-out',
        isVisible ? `${animationClass} opacity-100` : 'opacity-0',
        className
      )}
      style={{ willChange: 'opacity, transform' }} // Performance hint
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
