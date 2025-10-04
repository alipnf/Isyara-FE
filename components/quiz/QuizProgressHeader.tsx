'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface QuizProgressHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  correctAnswers: number;
  answeredQuestions: number;
}

export function QuizProgressHeader({
  currentQuestion,
  totalQuestions,
  timeLeft,
  correctAnswers,
  answeredQuestions,
}: QuizProgressHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Soal {currentQuestion + 1} dari {totalQuestions}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span
                className={`font-mono text-lg ${timeLeft <= 5 ? 'text-red-500' : ''}`}
              >
                {timeLeft}s
              </span>
            </div>
            {answeredQuestions > 0 && (
              <Badge variant="outline">
                {correctAnswers}/{answeredQuestions} benar
              </Badge>
            )}
          </div>
        </div>
        <Progress
          value={(currentQuestion / totalQuestions) * 100}
          className="h-2"
        />
      </CardHeader>
    </Card>
  );
}
