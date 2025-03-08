'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePhotoBooth } from '@/context/PhotoBoothContext';
import Button from '@/components/ui/Button';
import html2canvas from 'html2canvas';
import dynamic from 'next/dynamic';
import { Home2, Download1 } from 'lineicons-react';

// Dynamically import react-confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

const PhotoCollage = () => {
  const { 
    photos, 
    setAppState, 
    setPhotos, 
    setCurrentPhoto, 
    previousPhotoSets, 
    setPreviousPhotoSets 
  } = usePhotoBooth();
  const collageRef = React.useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!collageRef.current) return;

      const rect = collageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (window.innerWidth / 2);
      const y = (e.clientY - centerY) / (window.innerHeight / 2);

      const maxRotation = 15;
      setRotation({
        x: -y * maxRotation,
        y: x * maxRotation,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const createAndDownloadCollage = async (photos: string[], index?: number) => {
    try {
      // Calculate dimensions
      const downloadWidth = 360;
      const photoWidth = downloadWidth; // Use full width for the photo
      const containerPadding = Math.round(photoWidth * 0.03); // 3% of photo width for container padding

      console.log('Download dimensions:', {
        containerWidth: downloadWidth,
        photoWidth,
        containerPadding,
      });

      // Create a wrapper div with minimal padding
      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.backgroundColor = '#ffffff';
      wrapper.style.padding = `${containerPadding}px`;
      wrapper.style.width = `${photoWidth}px`;
      wrapper.style.borderRadius = '8px';
      wrapper.style.boxSizing = 'border-box'; // Include padding in width
      document.body.appendChild(wrapper);

      // Create the photo container
      const photoContainer = document.createElement('div');
      photoContainer.style.width = '100%';
      photoContainer.style.display = 'flex';
      photoContainer.style.flexDirection = 'column';
      photoContainer.style.gap = `${containerPadding}px`;
      photoContainer.style.backgroundColor = '#ffffff';
      photoContainer.style.boxSizing = 'border-box';
      wrapper.appendChild(photoContainer);

      // Add each photo
      for (const photo of photos) {
        const photoDiv = document.createElement('div');
        photoDiv.style.flex = '1';
        photoDiv.style.position = 'relative';
        photoDiv.style.width = '100%';
        photoDiv.style.borderRadius = '8px';
        photoDiv.style.overflow = 'hidden';
        photoDiv.style.backgroundColor = '#ffffff';
        photoDiv.style.boxSizing = 'border-box';

        const img = document.createElement('img');
        img.src = photo;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        photoDiv.appendChild(img);
        photoContainer.appendChild(photoDiv);
      }

      // Wait for images to load
      await Promise.all(
        Array.from(wrapper.getElementsByTagName('img')).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve(true);
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
            })
        )
      );

      // Calculate the total height needed
      const totalHeight = photoContainer.offsetHeight + (containerPadding * 2);
      wrapper.style.height = `${totalHeight}px`;

      // Use html2canvas with better settings
      const canvas = await html2canvas(wrapper, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: photoWidth,
        height: totalHeight
      });

      // Clean up
      document.body.removeChild(wrapper);

      // Download the image
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.download = index !== undefined 
        ? `photo-booth-collage-${index + 1}.jpg` 
        : 'photo-booth-collage.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error creating collage:', error);
    }
  };

  const handleDownload = async () => {
    if (!collageRef.current || !photos.length) return;
    try {
      // Store original transform
      const originalTransform = collageRef.current.style.transform;
      // Temporarily remove 3D transform for clean capture
      collageRef.current.style.transform = 'none';

      await createAndDownloadCollage(photos);

      // Restore transform
      collageRef.current.style.transform = originalTransform;
    } catch (error) {
      console.error('Error in handleDownload:', error);
      // Restore transform in case of error
      if (collageRef.current) {
        collageRef.current.style.transform = originalTransform;
      }
    }
  };

  const handleRetake = () => {
    setPreviousPhotoSets((prev: string[][]) => [photos, ...prev].slice(0, 3));
    setPhotos([]);
    setCurrentPhoto(1);
    setAppState('capture');
  };

  const handleHome = () => {
    setPhotos([]);
    setCurrentPhoto(1);
    setAppState('welcome');
  };

  const transform = `
    perspective(1000px) 
    rotateX(${rotation.x}deg) 
    rotateY(${rotation.y}deg)
  `;

  const baseWidth = Math.min(220, windowSize.height * 0.3);
  const baseHeight = Math.min(windowSize.height * 0.7, 700);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={false}
        gravity={0.2}
        initialVelocityY={10}
      />
      <div className="relative mb-8">
        {previousPhotoSets.map((photoSet, setIndex) => {
          const scale = 1 - (setIndex + 1) * 0.1;
          const width = baseWidth * scale;
          const height = baseHeight * scale;
          
          return (
            <div 
              key={setIndex}
              className="absolute bottom-0 bg-white rounded-lg p-2 shadow-lg cursor-pointer group transition-all duration-300 hover:-rotate-3"
              style={{ 
                width: `${width}px`,
                height: `${height}px`,
                right: `-${80 + setIndex * 40}px`,
                transform: `
                  translateZ(${-50 * (3 - setIndex)}px) 
                  rotate(${2 * (3 - setIndex)}deg)
                  scale(${scale})
                `,
                transition: 'all 0.3s ease-out',
                zIndex: 20 - setIndex,
                '--hover-right': `-${120 + setIndex * 40}px`,
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.right = target.style.getPropertyValue('--hover-right');
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.right = `-${80 + setIndex * 40}px`;
              }}
              onMouseMove={(e) => {
                const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
                if (tooltip) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  tooltip.style.left = `${x}px`;
                  tooltip.style.top = `${y}px`;
                }
              }}
              onClick={() => createAndDownloadCollage(photoSet, setIndex)}
            >
              <div className="absolute inset-0 flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300 rounded-lg">
                <span className="tooltip fixed opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity duration-300 pointer-events-none bg-black/50 px-2 py-1 rounded whitespace-nowrap transform -translate-x-1/2 -translate-y-full z-50">
                  Click to Download
                </span>
              </div>
              <div className="h-full flex flex-col gap-2">
                {photoSet.map((photo, index) => (
                  <div 
                    key={index}
                    className="relative rounded-lg overflow-hidden flex-1 transition-all duration-300"
                    style={{
                      transform: `translateZ(${30}px)`,
                      opacity: 1 - (setIndex * 0.2),
                    }}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={photo}
                        alt={`Previous Photo ${index + 1} Set ${setIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div 
          ref={collageRef}
          className="relative bg-white rounded-lg p-2 shadow-lg transition-transform duration-300 ease-out hover:shadow-xl z-30"
          style={{ 
            width: `${baseWidth}px`,
            height: `${baseHeight}px`,
            transform,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="h-full flex flex-col gap-2">
            {photos.map((photo, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden flex-1"
                style={{
                  transform: `translateZ(${30}px)`,
                  transition: 'transform 0.3s ease-out',
                }}
              >
                <div className="absolute inset-0">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-full shadow-lg">
        <Button onClick={handleHome} variant="secondary" className="!p-0 w-12 h-12 rounded-full flex items-center justify-center">
          <Home2 width={20} height={20} />
        </Button>
        <Button onClick={handleDownload} variant="primary" className="!py-2 !px-4 rounded-full">
          Download
        </Button>
        <Button onClick={handleRetake} variant="secondary" className="!py-2 !px-4 rounded-full flex items-center gap-2">
          Another One ☝️
        </Button>
      </div>
    </div>
  );
};

export default PhotoCollage; 