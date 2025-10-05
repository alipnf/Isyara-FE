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
  answeredQuestions,
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
          <span className="text-muted-foreground">Soal</span>
          <span className="font-medium">{currentQuestion + 1} dari {totalQuestions}</span>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Waktu</span>
          </div>
          <span className={`font-mono font-medium ${timeLeft <= 5 ? 'text-red-500' : ''}`}>
            {timeLeft}s
          </span>
        </div>
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
