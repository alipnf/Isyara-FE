export type ReviewState = 'category' | 'setup' | 'active' | 'completed';
export type CategoryType = 'huruf' | 'angka' | 'kata';
// Dynamic lesson key: use lesson title from DB
export type LessonKey = string;

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
