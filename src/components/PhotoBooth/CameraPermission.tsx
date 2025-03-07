'use client';

import React, { useEffect } from 'react';
import { usePhotoBooth } from '@/context/PhotoBoothContext';
import Button from '@/components/ui/Button';

const CameraPermission = () => {
  const { setHasPermission, setAppState } = usePhotoBooth();

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
        setAppState('capture');
      } catch (error) {
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, [setHasPermission, setAppState]);

  const handleRetry = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setAppState('capture');
    } catch (error) {
      setHasPermission(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Camera Access Required
      </h2>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Please allow camera access to take photos. If you've already denied access, 
        please enable it in your browser settings and try again.
      </p>
      <Button onClick={handleRetry} className="rounded-full">
        Try Again
      </Button>
    </div>
  );
};

export default CameraPermission; 