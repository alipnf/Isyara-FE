'use client';

import {
  QuizSetupCard,
  QuizProgressHeader,
  QuizCameraSection,
  QuizQuestionCard,
  QuizStatsCard,
  QuizTipsCard,
  QuizCompletedCard,
  useQuizLogic,
} from '@/components/quiz';

export default function QuizPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Camera & Detection */}
            <div className="lg:col-span-2 space-y-6">
              <QuizProgressHeader
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                timeLeft={timeLeft}
                correctAnswers={correctAnswers}
                answeredQuestions={answeredQuestions}
              />
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

            {/* Question & Instructions */}
            <div className="space-y-6">
              <QuizQuestionCard
                selectedCategory={selectedCategory}
                currentItem={questions[currentQuestion]?.item || ''}
              />
              <QuizStatsCard
                correctAnswers={correctAnswers}
                currentQuestion={currentQuestion}
              />
              <QuizTipsCard />
            </div>
          </div>
        )}

        {quizState === 'completed' && (
          <QuizCompletedCard questions={questions} onReset={resetQuiz} />
        )}
      </div>
    </div>
  );
}
