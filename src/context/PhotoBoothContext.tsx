'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, PhotoBoothContextType } from '@/types';

const PhotoBoothContext = createContext<PhotoBoothContextType | undefined>(undefined);

export const PhotoBoothProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [photos, setPhotos] = useState<string[]>([]);
  const [previousPhotoSets, setPreviousPhotoSets] = useState<string[][]>([]);
  const [currentPhoto, setCurrentPhoto] = useState(1);
  const [hasPermission, setHasPermission] = useState(false);

  return (
    <PhotoBoothContext.Provider
      value={{
        appState,
        setAppState,
        photos,
        setPhotos,
        previousPhotoSets,
        setPreviousPhotoSets,
        currentPhoto,
        setCurrentPhoto,
        hasPermission,
        setHasPermission,
      }}
    >
      {children}
    </PhotoBoothContext.Provider>
  );
};

export const usePhotoBooth = () => {
  const context = useContext(PhotoBoothContext);
  if (context === undefined) {
    throw new Error('usePhotoBooth must be used within a PhotoBoothProvider');
  }
  return context;
}; 