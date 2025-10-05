'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizProgressHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function QuizProgressHeader({
  currentQuestion,
  totalQuestions,
}: QuizProgressHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Soal {currentQuestion + 1} dari {totalQuestions}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
