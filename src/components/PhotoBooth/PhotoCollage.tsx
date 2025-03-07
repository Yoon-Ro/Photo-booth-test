'use client';

import React, { useEffect, useState } from 'react';
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

      // Calculate distance from center (normalized from -1 to 1)
      const x = (e.clientX - centerX) / (window.innerWidth / 2);
      const y = (e.clientY - centerY) / (window.innerHeight / 2);

      // Increase rotation to a maximum of 15 degrees for more dynamic movement
      const maxRotation = 15;
      setRotation({
        x: -y * maxRotation, // Inverted for natural feel
        y: x * maxRotation,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDownload = async () => {
    try {
      // Create a temporary div to render the photos
      const tempDiv = document.createElement('div');
      tempDiv.className = 'bg-white rounded-lg p-2';
      tempDiv.style.width = '200px';
      tempDiv.style.height = '70vh';
      tempDiv.style.display = 'flex';
      tempDiv.style.flexDirection = 'column';
      tempDiv.style.gap = '8px';
      tempDiv.style.boxSizing = 'border-box';

      // Create photo container
      const photoContainer = document.createElement('div');
      photoContainer.style.height = '100%';
      photoContainer.style.display = 'flex';
      photoContainer.style.flexDirection = 'column';
      photoContainer.style.gap = '8px';

      // Add photos to the container
      photos.forEach((photo) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.flex = '1';
        imgContainer.style.position = 'relative';
        imgContainer.style.borderRadius = '8px';
        imgContainer.style.overflow = 'hidden';

        const img = document.createElement('img');
        img.src = photo;
        img.style.position = 'absolute';
        img.style.inset = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        imgContainer.appendChild(img);
        photoContainer.appendChild(imgContainer);
      });

      tempDiv.appendChild(photoContainer);
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        width: tempDiv.offsetWidth,
        height: tempDiv.offsetHeight,
        useCORS: true
      });

      document.body.removeChild(tempDiv);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.download = 'photo-booth-collage.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error creating collage:', error);
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
      <div className="relative mb-20">
        {previousPhotoSets.map((photoSet, setIndex) => (
          <div 
            key={setIndex}
            className={`absolute bottom-0 bg-white rounded-lg p-2 shadow-lg cursor-pointer group transition-all duration-300
              ${setIndex === 0 ? 'w-[180px] h-[60vh] -right-[100px] scale-90 hover:-right-[160px] hover:rotate-[-5deg] z-20' : 
                setIndex === 1 ? 'w-[160px] h-[55vh] -right-[140px] scale-80 hover:-right-[200px] hover:rotate-[-3deg] z-10' :
                'w-[140px] h-[50vh] -right-[180px] scale-70 hover:-right-[240px] hover:rotate-[-2deg]'}`}
            style={{ 
              transform: `translateZ(${-50 * (3 - setIndex)}px) rotate(${2 * (3 - setIndex)}deg)`,
              transition: 'all 0.3s ease-out',
            }}
            onClick={async () => {
              try {
                // Create a temporary div to render the photos
                const tempDiv = document.createElement('div');
                tempDiv.className = 'bg-white rounded-lg p-2';
                tempDiv.style.width = setIndex === 0 ? '180px' : 
                                    setIndex === 1 ? '160px' : '140px';
                tempDiv.style.height = setIndex === 0 ? '60vh' : 
                                     setIndex === 1 ? '55vh' : '50vh';
                tempDiv.style.display = 'flex';
                tempDiv.style.flexDirection = 'column';
                tempDiv.style.gap = '8px';
                tempDiv.style.boxSizing = 'border-box';

                // Create photo container
                const photoContainer = document.createElement('div');
                photoContainer.style.height = '100%';
                photoContainer.style.display = 'flex';
                photoContainer.style.flexDirection = 'column';
                photoContainer.style.gap = '8px';

                // Add photos to the container
                photoSet.forEach((photo) => {
                  const imgContainer = document.createElement('div');
                  imgContainer.style.flex = '1';
                  imgContainer.style.position = 'relative';
                  imgContainer.style.borderRadius = '8px';
                  imgContainer.style.overflow = 'hidden';

                  const img = document.createElement('img');
                  img.src = photo;
                  img.style.position = 'absolute';
                  img.style.inset = '0';
                  img.style.width = '100%';
                  img.style.height = '100%';
                  img.style.objectFit = 'cover';

                  imgContainer.appendChild(img);
                  photoContainer.appendChild(imgContainer);
                });

                tempDiv.appendChild(photoContainer);
                document.body.appendChild(tempDiv);

                const canvas = await html2canvas(tempDiv, {
                  backgroundColor: '#ffffff',
                  scale: 2,
                  logging: false,
                  width: tempDiv.offsetWidth,
                  height: tempDiv.offsetHeight,
                  useCORS: true
                });

                document.body.removeChild(tempDiv);

                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg', 1.0);
                link.download = `photo-booth-collage-${setIndex + 1}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch (error) {
                console.error('Error downloading previous collage:', error);
              }
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
          >
            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300 rounded-lg">
              <span className="tooltip absolute opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity duration-300 pointer-events-none bg-black/50 px-2 py-1 rounded whitespace-nowrap transform -translate-y-1/2 z-50">
                Click to Download
              </span>
            </div>
            <div className="h-full flex flex-col gap-2">
              {photoSet.map((photo, index) => (
                <div 
                  key={index}
                  className={`relative rounded-lg overflow-hidden flex-1 transition-all duration-300 group-hover:opacity-100 
                    ${setIndex === 0 ? 'opacity-70' : 
                      setIndex === 1 ? 'opacity-50' : 
                      'opacity-30'}`}
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
        ))}
        <div 
          ref={collageRef}
          className="relative w-[220px] h-[70vh] bg-white rounded-lg p-2 shadow-lg transition-transform duration-300 ease-out hover:shadow-xl z-30"
          style={{ 
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