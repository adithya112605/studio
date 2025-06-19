
"use client";

import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animationInClass?: string;
  animationOutClass?: string;
  delayIn?: number; // Delay for the "in" animation
  threshold?: number;
  once?: boolean; // If true, only 'in' animation runs once. If false, 'in' and 'out' animations toggle.
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  animationInClass = 'animate-fadeInUp',
  animationOutClass = 'animate-fadeOutDown',
  delayIn = 0,
  threshold = 0.1,
  once = true,
}) => {
  // currentAnimation will hold the class for the current animation state.
  // It starts as 'opacity-0' to ensure elements are hidden before the first "in" animation.
  const [currentAnimation, setCurrentAnimation] = useState<string>('opacity-0');
  const targetRef = useRef<HTMLDivElement | null>(null);
  
  // This ref tracks if the "in" animation has triggered at least once.
  // Useful for the `once={false}` scenario to apply `animationOutClass`.
  const hasAnimatedInAtLeastOnceRef = useRef(false);

  useEffect(() => {
    const currentTarget = targetRef.current; 
    if (!currentTarget) return;

    // Set initial state for the element based on its visibility before JS might run or for first paint.
    // The main purpose is to make it invisible before the first 'in' animation.
    setCurrentAnimation('opacity-0');
    // Reset this ref if dependencies change, to allow re-evaluation of "first animation" logic.
    hasAnimatedInAtLeastOnceRef.current = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Element is in view
          // Trigger "in" animation
          setTimeout(() => {
            setCurrentAnimation(animationInClass);
            hasAnimatedInAtLeastOnceRef.current = true;
          }, delayIn);
        } else {
          // Element is out of view
          if (!once && hasAnimatedInAtLeastOnceRef.current) {
            // If 'once' is false AND it has been animated in before, apply 'out' animation
            setCurrentAnimation(animationOutClass);
          } else if (!hasAnimatedInAtLeastOnceRef.current && !once) {
            // If it has never animated in (e.g., scrolled past very quickly before delayIn timeout)
            // and we are in a !once scenario, ensure it's set to its initial hidden state.
            setCurrentAnimation('opacity-0');
          }
          // If 'once' is true and it has animated in, it should retain 'animationInClass'
          // state due to the 'forwards' fill mode, so no change to currentAnimation here.
          // If 'once' is true and it hasn't animated in, it should remain 'opacity-0'.
        }
      },
      {
        threshold: threshold,
      }
    );

    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
      observer.disconnect();
    };
  }, [animationInClass, animationOutClass, delayIn, threshold, once]); // Key props that re-configure the behavior

  return (
    <div
      ref={targetRef}
      className={cn(currentAnimation, className)}
      style={{ willChange: 'opacity, transform' }} // Performance hint
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
