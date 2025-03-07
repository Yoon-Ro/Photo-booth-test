'use client';

import { PhotoBoothProvider } from '@/context/PhotoBoothContext';
import WelcomeScreen from '@/components/PhotoBooth/WelcomeScreen';
import CameraPermission from '@/components/PhotoBooth/CameraPermission';
import PhotoCapture from '@/components/PhotoBooth/PhotoCapture';
import PhotoCollage from '@/components/PhotoBooth/PhotoCollage';
import { usePhotoBooth } from '@/context/PhotoBoothContext';

const PhotoBoothApp = () => {
  const { appState } = usePhotoBooth();

  switch (appState) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'permission':
      return <CameraPermission />;
    case 'capture':
      return <PhotoCapture />;
    case 'collage':
      return <PhotoCollage />;
    default:
      return <WelcomeScreen />;
  }
};

export default function Home() {
  return (
    <PhotoBoothProvider>
      <PhotoBoothApp />
    </PhotoBoothProvider>
  );
} 