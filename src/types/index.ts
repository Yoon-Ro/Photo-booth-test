import { ReactNode } from 'react';

export type AppState = 'welcome' | 'permission' | 'capture' | 'collage';

export interface PhotoBoothContextType {
  appState: AppState;
  setAppState: (state: AppState) => void;
  photos: string[];
  setPhotos: (photos: string[]) => void;
  previousPhotoSets: string[][];
  setPreviousPhotoSets: (photos: string[][] | ((prev: string[][]) => string[][])) => void;
  currentPhoto: number;
  setCurrentPhoto: (photo: number) => void;
  hasPermission: boolean;
  setHasPermission: (permission: boolean) => void;
}

export interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export interface CountdownProps {
  onComplete: () => void;
  isActive: boolean;
} 