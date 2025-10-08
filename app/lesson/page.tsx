'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import {
  CameraSection,
  ReferenceCard,
  CompletionDialog,
  categories,
  isCategoryKey,
  type CategoryKey,
} from '@/components/lesson';
import { useLessonLogic } from '@hooks/useLessonLogic';
import {
  completeLessonByKey,
  deriveLessonKey,
  fetchLessonRewardByKey,
  fetchUserLessonCompletedByKey,
} from '@/utils/supabase/learn';
import { awardProgress } from '@/utils/supabase/profile';

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
    handleItemSelect,
  } = useLessonLogic(selectedCategory, groupParam);

  const [xpReward, setXpReward] = useState<number | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState<boolean>(false);

  const progressValue = useMemo(() => {
    return groupItems.length
      ? (completedItems.size / groupItems.length) * 100
      : 0;
  }, [groupItems.length, completedItems.size]);

  // Fetch XP reward dynamically from lesson_defs via derived key
  useEffect(() => {
    const key = deriveLessonKey(selectedCategory, groupParam || '');
    if (!key) {
      setXpReward(null);
      setAlreadyCompleted(false);
      return;
    }
    Promise.all([
      fetchLessonRewardByKey(key).catch(() => null),
      fetchUserLessonCompletedByKey(key).catch(() => false),
    ])
      .then(([xp, done]) => {
        setXpReward(typeof xp === 'number' ? xp : null);
        setAlreadyCompleted(!!done);
      })
      .catch(() => {
        setXpReward(null);
        setAlreadyCompleted(false);
      });
  }, [selectedCategory, groupParam]);

  // Award XP and mark lesson completion once per session when all items done
  const prevCompletionRef = useRef(false);
  useEffect(() => {
    if (showCompletion && !prevCompletionRef.current) {
      prevCompletionRef.current = true;
      // Try to persist completion per-user in DB via RPC
      const key = deriveLessonKey(selectedCategory, groupParam || '');
      if (key && !alreadyCompleted) {
        completeLessonByKey(key).catch(() => {
          // Fallback: still award XP to avoid losing progress feeling
          const xp = typeof xpReward === 'number' ? xpReward : 50;
          awardProgress({ xpDelta: xp, lessonsDelta: 1 }).catch(() => {});
        });
      } else {
        // No key derivable (e.g., words category not seeded yet): fallback award
        if (!alreadyCompleted) {
          const xp = typeof xpReward === 'number' ? xpReward : 50;
          awardProgress({ xpDelta: xp, lessonsDelta: 1 }).catch(() => {});
        }
      }
    }
  }, [
    showCompletion,
    selectedCategory,
    groupParam,
    xpReward,
    alreadyCompleted,
  ]);

  const handlePrevious = () => {
    const currentIndex = groupItems.indexOf(selectedItem);
    if (currentIndex > 0) {
      handleItemSelect(groupItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = groupItems.indexOf(selectedItem);
    if (currentIndex < groupItems.length - 1) {
      handleItemSelect(groupItems[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Top header: Exit + Progress */}
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

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
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
            />
          </div>

          {/* Reference Card (includes pose + grid) - Right side */}
          <div className="space-y-3 sm:space-y-4">
            <ReferenceCard
              categoryName={categories[selectedCategory].name}
              selectedItem={selectedItem}
              selectedCategory={selectedCategory}
              groupItems={groupItems}
              completedItems={completedItems}
              onItemSelect={handleItemSelect}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>

      <CompletionDialog
        open={showCompletion}
        categoryName={selectedCategory}
        xpReward={alreadyCompleted ? 0 : xpReward}
      />
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
