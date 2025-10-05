'use client';

import { Suspense, useMemo } from 'react';
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
  useQuizLogic,
} from '@/components/quiz';

function QuizPageContent() {
  const router = useRouter();
  
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
    return questions.length ? (answeredQuestions / questions.length) * 100 : 0;
  }, [answeredQuestions, questions.length]);

  return (
    <>
      {/* Top header: Exit + Progress - only show during active quiz */}
      {quizState === 'active' && (
        <div className="mb-6 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/learn')}
            className="h-6 w-6 p-0"
            aria-label="Kembali ke belajar"
          >
            <X className="h-3 w-3" />
          </Button>
          <Progress value={progressValue} className="h-3 flex-1" />
        </div>
      )}

      {quizState === 'setup' && (
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
      )}

      {quizState === 'active' && (
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
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
          <div className="space-y-4 sm:space-y-6">
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
      )}

      {quizState === 'completed' && (
        <QuizCompletedCard questions={questions} onReset={resetQuiz} />
      )}
    </>
  );
}

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
          <QuizPageContent />
        </Suspense>
      </div>
    </div>
  );
}
