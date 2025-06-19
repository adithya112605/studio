
'use client';

import React, { useState, useEffect, useRef, type ElementType, useCallback } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

interface ScrollTypewriterProps {
  text: string;
  speed?: number;
  tag?: ElementType;
  className?: string;
  once?: boolean; // Animate only once
  delay?: number; // Delay before starting animation after becoming visible (ms)
  startOffset?: string; // Intersection observer rootMargin, e.g., "0px 0px -100px 0px"
  onAnimationComplete?: () => void;
  startManually?: boolean; // If true, animation will only start when this prop becomes true
}

const ScrollTypewriter: React.FC<ScrollTypewriterProps> = ({
  text,
  speed = 50,
  tag = 'p',
  className,
  once = true,
  delay = 0,
  startOffset = '0px',
  onAnimationComplete,
  startManually = false, // Default to false, meaning IntersectionObserver controls it
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  const effectiveStartCondition = startManually || animationTriggered;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!hasAnimated || !once) {
          setIsIntersecting(true);
        }
      } else {
        if (!once) {
          // Optional: Reset if it should replay when scrolling out (if not manually controlled)
          // if (!startManually) {
          //   setIsIntersecting(false);
          //   setAnimationTriggered(false); // Reset trigger for re-animation
          // }
        }
      }
    });
  }, [hasAnimated, once]);

  useEffect(() => {
    if (startManually) { // If manually controlled, bypass IntersectionObserver for triggering
        setAnimationTriggered(true);
        if (once) setHasAnimated(true);
        return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: startOffset,
      threshold: 0.01, // Start even if 1% is visible
    });

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
  }, [handleIntersection, startOffset, startManually, once]); // Added startManually & once

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isIntersecting && !animationTriggered && !startManually) { // only apply delay if not manually started
      if (delay > 0) {
        timeoutId = setTimeout(() => {
          setAnimationTriggered(true);
          if (once) setHasAnimated(true);
        }, delay);
      } else {
        setAnimationTriggered(true);
        if (once) setHasAnimated(true);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [isIntersecting, animationTriggered, delay, once, startManually]);


  const displayedText = useTypewriter({
    text: effectiveStartCondition ? text : '',
    speed,
    startCondition: effectiveStartCondition,
    onComplete: onAnimationComplete,
  });

  const Tag = tag;
  const showCursor = effectiveStartCondition && displayedText.length < text.length;

  return (
    <Tag ref={targetRef as any} className={cn(className, 'relative leading-snug')}>
      {/* Preserve space for text to avoid layout shifts, but make it invisible */}
      <span className="opacity-0" aria-hidden="true">{text}</span>
      <span className="absolute left-0 top-0 w-full h-full">
        {displayedText}
        {showCursor && <span className="inline-block w-px h-[1em] bg-current animate-caret-blink ml-0.5 relative top-[0.1em]"></span>}
      </span>
    </Tag>
  );
};

export default ScrollTypewriter;
