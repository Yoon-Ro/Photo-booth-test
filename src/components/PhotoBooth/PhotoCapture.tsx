'use client';

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { usePhotoBooth } from '@/context/PhotoBoothContext';
import Countdown from './Countdown';
import Button from '@/components/ui/Button';

const PhotoCapture = () => {
  const webcamRef = useRef<Webcam>(null);
  const { photos, setPhotos, currentPhoto, setCurrentPhoto, setAppState } = usePhotoBooth();
  const [isCountingDown, setIsCountingDown] = useState(false);

  const messages = [
    "Looks great! Keep smiling! 😊",
    "Perfect! Give us your best pose! ✨",
    "Amazing! Show us your fun side! 🌟",
    "Last one! Make it memorable! 🎉"
  ];

  useEffect(() => {
    if (currentPhoto === 1) {
      // Start the process automatically
      handleCapture();
    }
  }, [currentPhoto]);

  const handleCountdownComplete = () => {
    if (webcamRef.current) {
      const photo = webcamRef.current.getScreenshot();
      if (photo) {
        setPhotos([...photos, photo]);
        if (currentPhoto < 4) {
          setCurrentPhoto(currentPhoto + 1);
          setIsCountingDown(false);
          // Start next photo automatically after a short delay
          setTimeout(() => {
            handleCapture();
          }, 1000);
        } else {
          setAppState('collage');
        }
      }
    }
  };

  const handleCapture = () => {
    setIsCountingDown(true);
  };

  const progressWidth = `${(currentPhoto - 1) * 25}%`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="relative w-full max-w-2xl h-[60vh] flex items-center justify-center mb-8">
        <div className="relative aspect-square h-full">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover rounded-lg"
            mirrored
            disablePictureInPicture
            forceScreenshotSourceSize
            imageSmoothing
            onUserMedia={() => {}}
            onUserMediaError={() => {}}
            videoConstraints={{
              width: 1080,
              height: 1080,
              facingMode: "user"
            }}
          />
          {isCountingDown && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
              <Countdown 
                onComplete={handleCountdownComplete}
                isActive={isCountingDown}
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative w-[60vh] mb-8">
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-sm text-white text-lg px-6 py-3 rounded-full text-center">
          <div 
            className="absolute inset-0 bg-green-500/50 transition-all duration-500 ease-out rounded-full"
            style={{ width: progressWidth }}
          />
          <div className="relative z-10">
            {messages[currentPhoto - 1]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCapture; 