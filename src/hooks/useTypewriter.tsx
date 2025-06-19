
'use client';

import { useState, useEffect } from 'react';

interface UseTypewriterProps {
  text: string;
  speed?: number;
  startCondition?: boolean;
  onComplete?: () => void;
}

export function useTypewriter({
  text,
  speed = 50,
  startCondition = true,
  onComplete,
}: UseTypewriterProps): string {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset if text changes or if startCondition becomes false and we want to allow re-triggering
    if (text === '' || !startCondition) {
        setDisplayedText('');
        setCurrentIndex(0);
        return;
    }
    // If text changes but startCondition is still true, reset to type new text
    if (startCondition && text !== displayedText.slice(0, text.length)) {
        setDisplayedText('');
        setCurrentIndex(0);
    }
  }, [text, startCondition]);

  useEffect(() => {
    if (!startCondition || currentIndex >= text.length) {
      if (startCondition && currentIndex >= text.length) {
        if (onComplete) {
          onComplete();
        }
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeoutId);
  }, [text, speed, startCondition, currentIndex, onComplete, displayedText]); // Added displayedText to re-evaluate if external reset happens

  return displayedText;
}
