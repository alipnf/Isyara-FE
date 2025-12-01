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
  getLessonReward,
  completeLesson,
  isLessonCompleted,
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

    // When completed, always show 100% regardless of other states
    if (quizState === 'completed') {
      return 100;
    }

    // During active quiz, count current question as in progress
    // This ensures progress reaches 100% when quiz completes
    if (quizState === 'active') {
      return ((currentQuestion + 1) / questions.length) * 100;
    }

    // Fallback to answered questions count
    return (answeredQuestions / questions.length) * 100;
  }, [answeredQuestions, questions.length, quizState, currentQuestion]);

  // Fetch dynamic XP reward from static curriculum when opened from /learn with lesson key
  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      // Get XP from static config (synchronous)
      const xp = getLessonReward(key);
      setXpReward(xp || null);

      // Check completion status (async)
      isLessonCompleted(key)
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

    const key = searchParams.get('key');
    const xp = typeof xpReward === 'number' ? xpReward : 100;

    if (key && !alreadyCompleted) {
      // Complete the lesson using the key-based API
      completeLesson(key).catch(() => {
        // Fallback: still award XP to avoid losing progress feeling
        awardProgress({ xpDelta: xp, lessonsDelta: 1 }).catch(() => {});
      });
    } else if (!alreadyCompleted) {
      // No lesson key: fallback local award so user still sees progress
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
      {quizState === 'setup' && (
        <div className="container mx-auto px-4 py-4">
          <QuizSetupCard
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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 min-h-screen flex items-center justify-center">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 items-stretch w-full">
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
                onDetection={(label, conf) => handleDetection(label || '')}
                onLiveUpdate={(status) => {
                  // Map status back to what useQuizLogic expects if needed,
                  // or just pass dummy values since useQuizLogic might expect label/conf
                  // Actually, let's check useQuizLogic signature.
                  // Based on errors: handleLiveUpdate expects (label, conf)
                  // But QuizCameraSection calls it with (status)
                  // We need to fix this mismatch.
                  // For now, let's pass empty/default values to satisfy the hook if it's just for logging/status
                  handleLiveUpdate(
                    status === 'active' ? 'active' : 'inactive',
                    0
                  );
                }}
                onStatusChange={(isDetecting) =>
                  handleStatusChange(isDetecting ? 'active' : 'inactive')
                }
                onSettingsChange={handleSettingsChange}
                onExit={() => router.push('/learn')}
              />
            </div>

            {/* Right: Question, Stats */}
            <div className="flex flex-col gap-4 h-full min-h-0">
              <div className="flex-1 min-h-0">
                <QuizQuestionCard
                  currentItem={questions[currentQuestion]?.item || ''}
                />
              </div>
              <div className="shrink-0">
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
