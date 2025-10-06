'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CategorySelectionCard,
  LockedCategoryCard,
  ReviewSetupCard,
  ReviewProgressHeader,
  ReviewCameraSection,
  ReviewHintSection,
  ReviewCompletedCard,
  useReviewLogic,
  categories,
  userProgress,
  CategoryType,
} from '@/components/review';

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
  } = useReviewLogic(initialCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Category Selection State */}
        {reviewState === 'category' && !showLocked && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Pilih Kategori</h2>
              <p className="text-muted-foreground">
                Pilih materi yang ingin Anda ingat kembali
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(categories).map(([key, category]) => {
                const typedKey = key as CategoryType;
                const isUnlocked =
                  categoryStatus[typedKey].unlocked || key === 'huruf';
                const progress = categoryStatus[typedKey].progress;

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
        )}

        {/* Locked Category State */}
        {showLocked && (
          <LockedCategoryCard
            category={categories[selectedCategory]}
            categoryName={selectedCategory}
            userProgress={userProgress}
            onBack={() => setShowLocked(false)}
          />
        )}

        {/* Setup State */}
        {reviewState === 'setup' && (
          <ReviewSetupCard
            category={categories[selectedCategory]}
            cameraEnabled={cameraEnabled}
            onToggleCamera={toggleCamera}
            onStart={startReview}
            onBack={() => setReviewState('category')}
            onCameraError={handleCameraError}
          />
        )}

        {/* Active Review State */}
        {reviewState === 'active' && (
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            <ReviewProgressHeader
              currentItem={reviewItems[currentItemIndex]?.item}
              currentIndex={currentItemIndex}
              totalItems={reviewItems.length}
              rememberedCount={rememberedCount}
              showHint={showHint}
              categoryName={categories[selectedCategory].name}
              onToggleHint={toggleHint}
            />

            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <ReviewCameraSection
                isDetecting={isDetecting}
                currentItem={reviewItems[currentItemIndex]?.item}
                confidence={currentConfidence}
                onDetection={handleDetection}
                onLiveUpdate={handleLiveUpdate}
                onSkip={skipItem}
              />

              <ReviewHintSection
                showHint={showHint}
                currentItem={reviewItems[currentItemIndex]?.item}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        )}

        {/* Completed State */}
        {reviewState === 'completed' && (
          <ReviewCompletedCard
            reviewItems={reviewItems}
            rememberedCount={rememberedCount}
            accuracy={accuracy}
            onReset={resetReview}
          />
        )}
      </div>
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
