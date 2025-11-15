export type QuizState = 'setup' | 'active' | 'completed';

export interface QuizQuestion {
  item: string;
  answered: boolean;
  correct: boolean;
  timeSpent: number;
}
