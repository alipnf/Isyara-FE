'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import {
  QuizSetupCard,
  QuizCameraSection,
  QuizQuestionCard,
  QuizStatsCard,
  QuizCompletedCard,
} from '@/components/quiz';
import { useQuizLogic } from '@hooks/useQuizLogic';
import { useSearchParams } from 'next/navigation';
import {
  fetchLessonRewardById,
  completeLessonById,
  fetchUserLessonCompletedById,
} from '@/utils/supabase/learn';
import { awardProgress } from '@/utils/supabase/profile';

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [xpReward, setXpReward] = useState<number | null>(null);
  const completionHandledRef = useRef(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState<boolean>(false);

  const {
    quizState,
    selectedCategory,
    currentQuestion,
    timeLeft,
    questions,
    isDetecting,
    correctAnswers,
    answeredQuestions,
    cameraEnabled,
    confidence,
    isCorrect,
    settings,
    startQuiz,
    resetQuiz,
    goBack,
    toggleCamera,
    handleDetection,
    handleLiveUpdate,
    handleStatusChange,
    handleSettingsChange,
  } = useQuizLogic();

  const progressValue = useMemo(() => {
    if (!questions.length) return 0;

    // During active quiz, count current question as in progress
    // This ensures progress reaches 100% when quiz completes
    if (quizState === 'active') {
      return ((currentQuestion + 1) / questions.length) * 100;
    }

    // When completed, show 100%
    if (quizState === 'completed') {
      return 100;
    }

    // Fallback to answered questions count
    return (answeredQuestions / questions.length) * 100;
  }, [answeredQuestions, questions.length, quizState, currentQuestion]);

  // Fetch dynamic XP reward from static curriculum when opened from /learn with lesson id
  useEffect(() => {
    const idParam = searchParams.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!isNaN(id)) {
      // Get XP from static config (synchronous)
      const xp = fetchLessonRewardById(id);
      setXpReward(xp || null);

      // Check completion status (async)
      fetchUserLessonCompletedById(id)
        .then((done) => {
          setAlreadyCompleted(!!done);
        })
        .catch(() => {
          setAlreadyCompleted(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On quiz completed (and passed), mark as completed in DB to unlock next
  useEffect(() => {
    if (quizState !== 'completed' || completionHandledRef.current) return;

    const total = questions.length;
    const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
    const passed = accuracy >= 70; // unlock/award only on pass

    if (!passed) return;

    completionHandledRef.current = true;

    const idParam = searchParams.get('id');
    const id = idParam ? Number(idParam) : NaN;
    const xp = typeof xpReward === 'number' ? xpReward : 100;

    if (!isNaN(id) && !alreadyCompleted) {
      completeLessonById(id).catch(() => {
        // Fallback: still award XP to avoid losing progress feeling
        awardProgress({ xpDelta: xp, lessonsDelta: 1 }).catch(() => {});
      });
    } else if (!alreadyCompleted) {
      // No lesson id: fallback local award so user still sees progress
      awardProgress({ xpDelta: xp, lessonsDelta: 1 }).catch(() => {});
    }
  }, [
    quizState,
    questions.length,
    correctAnswers,
    searchParams,
    xpReward,
    alreadyCompleted,
  ]);

  return (
    <>
      {/* Top header: Exit + Progress - only show during active quiz */}
      {quizState === 'active' && (
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="mb-3 sm:mb-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/learn')}
              className="h-6 w-6 p-0"
              aria-label="Kembali ke belajar"
            >
              <X className="h-3 w-3" />
            </Button>
            <Progress value={progressValue} className="h-2 sm:h-3 flex-1" />
          </div>
        </div>
      )}

      {quizState === 'setup' && (
        <div className="container mx-auto px-4 py-4">
          <QuizSetupCard
            selectedCategory={selectedCategory}
            cameraEnabled={cameraEnabled}
            onBack={goBack}
            onStartQuiz={startQuiz}
            onToggleCamera={toggleCamera}
            onDetection={handleDetection}
            onLiveUpdate={handleLiveUpdate}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}

      {quizState === 'active' && (
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left: Camera & Detection (wider) */}
            <div className="lg:col-span-2">
              <QuizCameraSection
                cameraEnabled={cameraEnabled}
                isDetecting={isDetecting}
                confidence={confidence}
                isCorrect={isCorrect}
                expectedLabel={questions[currentQuestion]?.item || ''}
                settings={settings}
                onToggleCamera={toggleCamera}
                onDetection={handleDetection}
                onLiveUpdate={handleLiveUpdate}
                onStatusChange={handleStatusChange}
                onSettingsChange={handleSettingsChange}
              />
            </div>

            {/* Right: Question, Stats */}
            <div className="space-y-3 sm:space-y-4">
              <QuizQuestionCard
                selectedCategory={selectedCategory}
                currentItem={questions[currentQuestion]?.item || ''}
              />
              <QuizStatsCard
                correctAnswers={correctAnswers}
                currentQuestion={currentQuestion}
                timeLeft={timeLeft}
                totalQuestions={questions.length}
                answeredQuestions={answeredQuestions}
              />
            </div>
          </div>
        </div>
      )}

      {quizState === 'completed' && (
        <QuizCompletedCard
          questions={questions}
          onReset={resetQuiz}
          xpReward={alreadyCompleted ? 0 : xpReward}
        />
      )}
    </>
  );
}

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
        <QuizPageContent />
      </Suspense>
    </div>
  );
}
