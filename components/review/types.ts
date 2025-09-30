export type ReviewState = 'category' | 'setup' | 'active' | 'completed';
export type CategoryType = 'huruf' | 'angka' | 'kata';
export type LessonKey =
  | 'Huruf A-E'
  | 'Huruf F-J'
  | 'Huruf K-O'
  | 'Huruf P-T'
  | 'Huruf U-Z'
  | 'Angka 0-4'
  | 'Angka 5-9'
  | 'Sapaan & Salam'
  | 'Kata Ganti';

export interface ReviewItem {
  item: string;
  reviewed: boolean;
  remembered: boolean;
}

export interface LessonProgress {
  completed: boolean;
  progress: number;
}

export interface CategoryData {
  name: string;
  items: string[];
  description: string;
  requiredLessons: string[];
  requiredProgress: number;
}

export interface CategoryStatus {
  unlocked: boolean;
  progress: number;
}
