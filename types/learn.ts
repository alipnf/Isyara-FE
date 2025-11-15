// Type definitions for learning components
export interface BaseLesson {
  id: number;
  key: string;
  title: string;
  completed: boolean;
  type: 'lesson' | 'quiz';
  progress: number;
  current?: boolean;
  locked?: boolean;
}

export interface HurufLesson extends BaseLesson {
  type: 'lesson';
  hurufRange: string[];
}

export interface NumberLesson extends BaseLesson {
  type: 'lesson';
  numberRange: string[];
}

export interface WordLesson extends BaseLesson {
  type: 'lesson';
  wordGroup: string[];
}

export interface QuizLesson extends BaseLesson {
  type: 'quiz';
}

export type Lesson = HurufLesson | NumberLesson | WordLesson | QuizLesson;

export interface LearningUnit {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  color: string;
  progress: number;
  locked?: boolean;
  comingSoon?: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
}
