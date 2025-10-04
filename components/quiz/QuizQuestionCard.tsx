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
      <CardHeader>
        <CardTitle>
          Tunjukkan{' '}
          {selectedCategory === 'letters'
            ? 'Huruf'
            : selectedCategory === 'numbers'
              ? 'Angka'
              : 'Kata'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl font-bold text-primary">{currentItem}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">{currentItem}</h3>
        <p className="text-muted-foreground">
          Tunjukkan gerakan tangan untuk {getCategoryLabel()} ini
        </p>
      </CardContent>
    </Card>
  );
}
