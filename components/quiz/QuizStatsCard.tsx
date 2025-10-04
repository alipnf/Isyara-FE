'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizStatsCardProps {
  correctAnswers: number;
  currentQuestion: number;
}

export function QuizStatsCard({
  correctAnswers,
  currentQuestion,
}: QuizStatsCardProps) {
  const accuracy =
    currentQuestion > 0
      ? Math.round((correctAnswers / currentQuestion) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Sementara</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Benar</span>
          <span className="font-medium">{correctAnswers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Salah</span>
          <span className="font-medium">
            {currentQuestion - correctAnswers}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Akurasi</span>
          <span className="font-medium">{accuracy}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
