// Type definitions for lesson domain
export interface LessonSettings {
  showHandLandmarks: boolean;
  audioFeedback: boolean;
  autoAdvance: boolean;
  holdDuration: [number];
  showPerformanceStats: boolean;
}

export interface Category {
  name: string;
  items: string[];
  description: string;
  color: string;
}

export type CategoryKey = 'huruf' | 'angka' | 'kata';

export interface LessonState {
  selectedItem: string;
  completedItems: Set<string>;
  confidence: number;
  isCorrect: boolean | null;
  cameraEnabled: boolean;
  isDetecting: boolean;
}
