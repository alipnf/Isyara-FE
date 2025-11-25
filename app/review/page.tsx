'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CategorySelectionCard,
  LockedCategoryCard,
  ReviewSetupCard,
  ReviewCameraSection,
  ReviewControlPanel,
  ReviewCompletedCard,
  CategoryType,
} from '@/components/review';
import { useReviewLogic } from '@hooks/useReviewLogic';

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'huruf';

  const initialCategory =
    categoryParam === 'huruf' ||
    categoryParam === 'angka' ||
    categoryParam === 'kata'
      ? (categoryParam as CategoryType)
      : 'huruf';

  const {
    reviewState,
    selectedCategory,
    currentItemIndex,
    cameraEnabled,
    reviewItems,
    isDetecting,
    showLocked,
    currentConfidence,
    showHint,
    categoryStatus,
    rememberedCount,
    accuracy,
    selectCategory,
    startReview,
    skipItem,
    handleDetection,
    handleLiveUpdate,
    resetReview,
    toggleCamera,
    handleCameraError,
    toggleHint,
    setReviewState,
    setShowLocked,
    categories,
    perLessonProgress,
  } = useReviewLogic(initialCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Category Selection State */}
      {reviewState === 'category' && !showLocked && (
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Pilih Kategori</h2>
              <p className="text-muted-foreground">
                Pilih materi yang ingin Anda ingat kembali
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(categories || {}).map(([key, category]) => {
                const typedKey = key as CategoryType;
                const isUnlocked = !!categoryStatus[typedKey]?.unlocked;
                const progress = categoryStatus[typedKey]?.progress ?? 0;

                return (
                  <CategorySelectionCard
                    key={key}
                    categoryKey={typedKey}
                    category={category}
                    isUnlocked={isUnlocked}
                    progress={progress}
                    onSelect={selectCategory}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Locked Category State */}
      {showLocked && categories[selectedCategory] ? (
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <LockedCategoryCard
            category={categories[selectedCategory]!}
            categoryName={selectedCategory}
            userProgress={perLessonProgress as any}
            onBack={() => setShowLocked(false)}
          />
        </div>
      ) : null}

      {/* Setup State */}
      {reviewState === 'setup' && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-5xl">
            <ReviewSetupCard
              category={categories[selectedCategory]!}
              cameraEnabled={cameraEnabled}
              onToggleCamera={toggleCamera}
              onStart={startReview}
              onBack={() => setReviewState('category')}
              onCameraError={handleCameraError}
            />
          </div>
        </div>
      )}

      {/* Active Review State */}
      {reviewState === 'active' && (
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 min-h-screen flex items-center justify-center">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 items-stretch w-full">
            {/* Left: Camera (wider) */}
            <div className="lg:col-span-2">
              <ReviewCameraSection
                isDetecting={isDetecting}
                currentItem={reviewItems[currentItemIndex]?.item}
                confidence={currentConfidence}
                onDetection={handleDetection}
                onLiveUpdate={handleLiveUpdate}
                onSkip={skipItem}
                onExit={() => setReviewState('category')}
              />
            </div>

            {/* Right: Control Panel */}
            <div className="flex flex-col gap-4 h-full min-h-0">
              <ReviewControlPanel
                showHint={showHint}
                currentItem={reviewItems[currentItemIndex]?.item}
                selectedCategory={selectedCategory}
                currentIndex={currentItemIndex}
                totalItems={reviewItems.length}
                rememberedCount={rememberedCount}
                accuracy={accuracy}
                onToggleHint={toggleHint}
              />
            </div>
          </div>
        </div>
      )}

      {/* Completed State */}
      {reviewState === 'completed' && (
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <ReviewCompletedCard
            reviewItems={reviewItems}
            rememberedCount={rememberedCount}
            accuracy={accuracy}
            onReset={resetReview}
          />
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
      <ReviewPageContent />
    </Suspense>
  );
}
