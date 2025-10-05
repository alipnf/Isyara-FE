'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface QuizStatsCardProps {
  correctAnswers: number;
  currentQuestion: number;
  timeLeft: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export function QuizStatsCard({
  correctAnswers,
  currentQuestion,
  timeLeft,
  totalQuestions,
}: QuizStatsCardProps) {
  const accuracy =
    currentQuestion > 0
      ? Math.round((correctAnswers / currentQuestion) * 100)
      : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Statistik Sementara</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Soal</span>
          <span className="text-sm font-medium">
            {currentQuestion + 1} dari {totalQuestions}
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Waktu</span>
          </div>
          <span
            className={`font-mono text-sm font-medium ${timeLeft <= 5 ? 'text-red-500' : ''}`}
          >
            {timeLeft}s
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Benar</span>
          <span className="text-sm font-medium">{correctAnswers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Salah</span>
          <span className="text-sm font-medium">
            {currentQuestion - correctAnswers}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Akurasi</span>
          <span className="text-sm font-medium">{accuracy}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
