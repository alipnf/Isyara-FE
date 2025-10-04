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
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="text-center">
        <CardHeader>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              accuracy >= 70 ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {accuracy >= 70 ? (
              <Trophy className="h-8 w-8 text-green-600" />
            ) : (
              <Target className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {accuracy >= 70 ? 'Selamat! Anda Lulus!' : 'Belum Berhasil'}
          </CardTitle>
          <CardDescription>
            {accuracy >= 70
              ? 'Kemampuan BISINDO Anda sudah baik!'
              : 'Terus berlatih untuk meningkatkan kemampuan Anda'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Results Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Benar</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Akurasi</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {averageTime}s
              </div>
              <div className="text-sm text-muted-foreground">Rata-rata</div>
            </div>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Jawaban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                      question.correct
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {question.item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
            <Button asChild className="flex-1">
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
