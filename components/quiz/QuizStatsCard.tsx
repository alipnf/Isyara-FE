'use client';

import { Clock, CheckCircle2, XCircle, Target } from 'lucide-react';

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
    <div className="flex flex-col gap-3 p-4 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl h-full min-h-0">
      <h2 className="text-base font-semibold text-foreground">
        Statistik Sementara
      </h2>

      <div className="space-y-2">
        {/* Progress Info */}
        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-white/5 rounded-lg">
          <span className="text-xs text-muted-foreground">Soal</span>
          <span className="text-sm font-bold text-foreground">
            {currentQuestion + 1}{' '}
            <span className="text-muted-foreground">/ {totalQuestions}</span>
          </span>
        </div>

        {/* Timer */}
        <div
          className={`flex justify-between items-center p-2 rounded-lg border transition-colors ${
            timeLeft <= 5
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30'
              : 'bg-white/50 dark:bg-white/5 border-transparent'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock
              className={`h-3.5 w-3.5 ${timeLeft <= 5 ? 'text-red-500' : 'text-muted-foreground'}`}
            />
            <span
              className={`text-xs ${timeLeft <= 5 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}
            >
              Waktu
            </span>
          </div>
          <span
            className={`font-mono text-sm font-bold ${timeLeft <= 5 ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}
          >
            {timeLeft}s
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <span className="text-base font-bold text-green-700 dark:text-green-400 leading-none">
              {correctAnswers}
            </span>
            <span className="text-[9px] text-green-600/80 uppercase font-bold mt-0.5">
              Benar
            </span>
          </div>

          <div className="flex flex-col items-center p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
            <span className="text-base font-bold text-red-700 dark:text-red-400 leading-none">
              {currentQuestion - correctAnswers}
            </span>
            <span className="text-[9px] text-red-600/80 uppercase font-bold mt-0.5">
              Salah
            </span>
          </div>

          <div className="flex flex-col items-center p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <span className="text-base font-bold text-blue-700 dark:text-blue-400 leading-none">
              {accuracy}%
            </span>
            <span className="text-[9px] text-blue-600/80 uppercase font-bold mt-0.5">
              Akurasi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
