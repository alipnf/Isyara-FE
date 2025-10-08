'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trophy, Target, RotateCcw, TrendingUp, Award } from 'lucide-react';
import type { QuizQuestion } from '@type/quiz';

interface QuizCompletedCardProps {
  questions: QuizQuestion[];
  onReset: () => void;
  xpReward?: number | null;
}

export function QuizCompletedCard({
  questions,
  onReset,
  xpReward,
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
    <div className="h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                accuracy >= 70 ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {accuracy >= 70 ? (
                <Trophy className="h-5 w-5 text-green-600" />
              ) : (
                <Target className="h-5 w-5 text-red-600" />
              )}
            </div>
            <CardTitle className="text-lg">
              {accuracy >= 70 ? 'Selamat! Anda Lulus!' : 'Belum Berhasil'}
            </CardTitle>
            <CardDescription className="text-sm">
              {accuracy >= 70
                ? 'Kemampuan BISINDO Anda sudah baik!'
                : 'Terus berlatih untuk meningkatkan kemampuan Anda'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {/* Results Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {correctAnswers}
                </div>
                <div className="text-xs text-muted-foreground">Benar</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {accuracy}%
                </div>
                <div className="text-xs text-muted-foreground">Akurasi</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {averageTime}s
                </div>
                <div className="text-xs text-muted-foreground">Rata-rata</div>
              </div>
            </div>

            {/* Reward XP (shown when passed) */}
            {accuracy >= 70 && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-4 rounded-lg text-center">
                <div className="relative inline-block">
                  <Award
                    className="h-12 w-12 text-yellow-500 mx-auto mb-2 fill-yellow-400 stroke-yellow-600 drop-shadow-lg"
                    strokeWidth={2}
                  />
                </div>
                <p className="font-bold text-lg text-yellow-700 mb-0.5">
                  +{typeof xpReward === 'number' ? xpReward : 50} XP Diperoleh
                </p>
                <p className="text-xs text-yellow-600/80 font-medium">
                  Mantap! Pertahankan performa belajarmu
                </p>
              </div>
            )}

            {/* Detailed Results */}
            <div className="bg-muted/30 rounded-lg p-3">
              <h3 className="text-sm font-medium mb-2">Detail Jawaban</h3>
              <div className="grid grid-cols-5 gap-1">
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
            <div className="flex gap-2 pt-1">
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
    </div>
  );
}
