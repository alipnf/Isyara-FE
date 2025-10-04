'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import {
  CameraSection,
  ReferenceCard,
  CompletionDialog,
  useLessonLogic,
  categories,
  isCategoryKey,
  type CategoryKey,
} from '@/components/lesson';

function LessonPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
    handleItemSelect,
  } = useLessonLogic(selectedCategory, groupParam);

  const progressValue = useMemo(() => {
    return groupItems.length
      ? (completedItems.size / groupItems.length) * 100
      : 0;
  }, [groupItems.length, completedItems.size]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Top header: Exit + Progress */}
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera Feed Section */}
          <div className="lg:col-span-2">
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

          {/* Reference Card (includes pose + grid) - Right side */}
          <div className="space-y-6">
            <ReferenceCard
              categoryName={categories[selectedCategory].name}
              selectedItem={selectedItem}
              selectedCategory={selectedCategory}
              groupItems={groupItems}
              completedItems={completedItems}
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
