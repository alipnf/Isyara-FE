'use client';

import { Button } from '@/components/ui/button';
import {
  Trophy,
  Target,
  RotateCcw,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
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
  const passed = accuracy >= 70;
  const hasReward = typeof xpReward === 'number' && xpReward > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ${passed
                ? 'bg-green-100 text-green-600 ring-green-50 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-900/10'
                : 'bg-red-100 text-red-600 ring-red-50 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-900/10'
              }`}
          >
            {passed ? (
              <Trophy className="h-8 w-8" />
            ) : (
              <Target className="h-8 w-8" />
            )}
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            {passed ? 'Selamat! Anda Lulus!' : 'Belum Berhasil'}
          </h1>
          <p className="text-muted-foreground">
            {passed
              ? 'Kemampuan BISINDO Anda sudah baik!'
              : 'Terus berlatih untuk meningkatkan kemampuan Anda'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
              <span className="text-xl font-bold text-primary">
                {correctAnswers}
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Benar
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
              <span className="text-xl font-bold text-primary">
                {accuracy}%
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Akurasi
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
              <span className="text-xl font-bold text-primary">
                {averageTime}s
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rata-rata
              </span>
            </div>
          </div>

          {/* Reward Section */}
          {passed && hasReward && (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl" />
              <Award className="h-10 w-10 text-yellow-500 mx-auto mb-2 drop-shadow-sm" />
              <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-1">
                +{xpReward} XP Diperoleh
              </p>
              <p className="text-sm text-yellow-600/80 dark:text-yellow-500/80 font-medium">
                Mantap! Pertahankan performa belajarmu
              </p>
            </div>
          )}

          {/* Answer Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Detail Jawaban
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold border ${question.correct
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                    }`}
                  title={`Soal ${index + 1}: ${question.item}`}
                >
                  {question.item}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button
              onClick={onReset}
              variant="outline"
              className="h-12 rounded-full border-slate-200 dark:border-white/10 hover:bg-muted dark:hover:bg-white/5"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
            <Button
              asChild
              className="h-12 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40"
            >
              <a href="/learn">
                <TrendingUp className="h-4 w-4 mr-2" />
                Kembali ke Belajar
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
