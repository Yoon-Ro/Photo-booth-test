'use client';

import React from 'react';
import { usePhotoBooth } from '@/context/PhotoBoothContext';
import Button from '@/components/ui/Button';

const WelcomeScreen = () => {
  const { setAppState } = usePhotoBooth();

  const handleStart = () => {
    setAppState('permission');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 text-center">
        Welcome to Photo Booth
      </h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-md">
        Get ready to capture 4 amazing photos with our countdown timer!
      </p>
      <Button onClick={handleStart} className="rounded-full">
        Start Taking Photos
      </Button>
    </div>
  );
};

export default WelcomeScreen; 