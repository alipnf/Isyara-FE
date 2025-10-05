'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trophy, Target, RotateCcw, TrendingUp } from 'lucide-react';
import type { QuizQuestion } from './types';

interface QuizCompletedCardProps {
  questions: QuizQuestion[];
  onReset: () => void;
}

export function QuizCompletedCard({
  questions,
  onReset,
}: QuizCompletedCardProps) {
  const correctAnswers = questions.filter((q) => q.correct).length;
  const accuracy =
    questions.length > 0
      ? Math.round((correctAnswers / questions.length) * 100)
      : 0;
  const averageTime =
    questions.length > 0
      ? Math.round(
          questions.reduce((sum, q) => sum + q.timeSpent, 0) / questions.length
        )
      : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              accuracy >= 70 ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {accuracy >= 70 ? (
              <Trophy className="h-6 w-6 text-green-600" />
            ) : (
              <Target className="h-6 w-6 text-red-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {accuracy >= 70 ? 'Selamat! Anda Lulus!' : 'Belum Berhasil'}
          </CardTitle>
          <CardDescription className="text-sm">
            {accuracy >= 70
              ? 'Kemampuan BISINDO Anda sudah baik!'
              : 'Terus berlatih untuk meningkatkan kemampuan Anda'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {/* Results Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-primary">
                {correctAnswers}
              </div>
              <div className="text-xs text-muted-foreground">Benar</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-primary">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Akurasi</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-primary">
                {averageTime}s
              </div>
              <div className="text-xs text-muted-foreground">Rata-rata</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Detail Jawaban</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${
                    question.correct
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {question.item}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 bg-transparent"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
            <Button asChild className="flex-1" size="sm">
              <a href="/learn">
                <TrendingUp className="h-4 w-4 mr-2" />
                Kembali ke Belajar
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
