import { useEffect, useState, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function useScrambleText(value: string | number, duration = 300) {
  const [displayValue, setDisplayValue] = useState(String(value));
  const targetValue = String(value);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (displayValue === targetValue) return;

    const startScramble = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;

      if (progress < duration) {
        const scrambled = targetValue
          .split('')
          .map((char, i) => {
            if (char === '.' || char === ' ') return char;
            // Gradually lock characters from left to right
            if (progress / duration > (i / targetValue.length) * 1.5) {
              return targetValue[i];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');

        setDisplayValue(scrambled);
        frameRef.current = requestAnimationFrame(startScramble);
      } else {
        setDisplayValue(targetValue);
        startTimeRef.current = undefined;
      }
    };

    frameRef.current = requestAnimationFrame(startScramble);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      startTimeRef.current = undefined;
    };
  }, [targetValue, duration, displayValue]);

  return displayValue;
}
