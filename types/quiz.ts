export type QuizState = 'category' | 'setup' | 'active' | 'completed';
export type CategoryType = 'letters' | 'numbers' | 'words';

export interface QuizQuestion {
  item: string;
  answered: boolean;
  correct: boolean;
  timeSpent: number;
}

export interface CategoryData {
  name: string;
  items: string[];
  description: string;
}
