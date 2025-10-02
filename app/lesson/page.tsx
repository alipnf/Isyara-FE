'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CameraSection,
  ReferenceCard,
  ItemGrid,
  CompletionDialog,
  useLessonLogic,
  categories,
  isCategoryKey,
  type CategoryKey,
} from '@/components/lesson';

function LessonPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'huruf';
  const groupParam = searchParams.get('group') || '';

  const [selectedCategory] = useState<CategoryKey>(
    isCategoryKey(categoryParam) ? categoryParam : 'huruf'
  );

  const {
    groupItems,
    selectedItem,
    isDetecting,
    cameraEnabled,
    confidence,
    isCorrect,
    completedItems,
    showCompletion,
    settings,
    setSettings,
    handleDetection,
    handleLiveUpdate,
    handleCameraStatusChange,
    toggleCamera,
    resetSession,
    goToNextItem,
    goToPreviousItem,
    handleItemSelect,
  } = useLessonLogic(selectedCategory, groupParam);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera Feed Section */}
          <div className="lg:col-span-2 space-y-6">
            <CameraSection
              cameraEnabled={cameraEnabled}
              isDetecting={isDetecting}
              settings={settings}
              confidence={confidence}
              isCorrect={isCorrect}
              selectedItem={selectedItem}
              completedItemsSize={completedItems.size}
              groupItemsLength={groupItems.length}
              onToggleCamera={toggleCamera}
              onSettingsChange={setSettings}
              onDetection={handleDetection}
              onLiveUpdate={handleLiveUpdate}
              onStatusChange={handleCameraStatusChange}
              onReset={resetSession}
            />
          </div>

          {/* Selection & Instructions */}
          <div className="space-y-6">
            <ReferenceCard
              categoryName={categories[selectedCategory].name}
              selectedItem={selectedItem}
              selectedCategory={selectedCategory}
              onPrevious={goToPreviousItem}
              onNext={goToNextItem}
            />

            <ItemGrid
              groupItems={groupItems}
              selectedItem={selectedItem}
              completedItems={completedItems}
              selectedCategory={selectedCategory}
              onItemSelect={handleItemSelect}
            />
          </div>
        </div>
      </div>

      <CompletionDialog open={showCompletion} categoryName={selectedCategory} />
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
      <LessonPageContent />
    </Suspense>
  );
}
