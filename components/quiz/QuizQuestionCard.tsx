'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CategoryType } from './types';

interface QuizQuestionCardProps {
  selectedCategory: CategoryType;
  currentItem: string;
}

export function QuizQuestionCard({
  selectedCategory,
  currentItem,
}: QuizQuestionCardProps) {
  const getCategoryLabel = () => {
    switch (selectedCategory) {
      case 'letters':
        return 'huruf';
      case 'numbers':
        return 'angka';
      case 'words':
        return 'kata';
      default:
        return 'item';
    }
  };

  return (
    <Card className="text-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Tunjukkan{' '}
          {selectedCategory === 'letters'
            ? 'Huruf'
            : selectedCategory === 'numbers'
              ? 'Angka'
              : 'Kata'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl font-bold text-primary">{currentItem}</span>
        </div>
        <h3 className="text-xl font-bold">{currentItem}</h3>
        <p className="text-sm text-muted-foreground">
          Tunjukkan gerakan tangan untuk {getCategoryLabel()} ini
        </p>
      </CardContent>
    </Card>
  );
}
