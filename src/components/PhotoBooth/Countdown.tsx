'use client';

import React, { useEffect, useState } from 'react';
import { CountdownProps } from '@/types';

const Countdown = ({ onComplete, isActive }: CountdownProps) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const numbers = [3, 2, 1];
    let currentIndex = 0;

    // Set initial count
    setCount(numbers[0]);

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < numbers.length) {
        setCount(numbers[currentIndex]);
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  if (!isActive || count === null) return null;

  return (
    <div className="text-white text-[120px] font-bold animate-pulse text-center leading-none">
      {count}
    </div>
  );
};

export default Countdown; 