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
import {
  PerformanceRecorderInline,
  RecordedData,
} from '@/components/lesson/PerformanceRecorderInline';
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
  const [performanceData, setPerformanceData] = useState<RecordedData | null>(
    null
  );

  const progressValue = useMemo(() => {
    return groupItems.length
      ? (completedItems.size / groupItems.length) * 100
      : 0;
  }, [groupItems.length, completedItems.size]);

  // Fetch XP reward dynamically from static curriculum via derived key
  useEffect(() => {
    const key = deriveLessonKey(selectedCategory, groupParam || '');
    if (!key) {
      setXpReward(null);
      setAlreadyCompleted(false);
      return;
    }

    // Get XP from static config (synchronous)
    const xp = fetchLessonRewardByKey(key);
    setXpReward(xp || null);

    // Check completion status (async)
    fetchUserLessonCompletedByKey(key)
      .then((done) => {
        setAlreadyCompleted(!!done);
      })
      .catch(() => {
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

  // Determine if we should be recording
  // We record if:
  // 1. Performance stats setting is ON
  // 2. Camera is enabled
  // 3. Lesson is NOT completed yet
  const shouldRecord =
    settings.showPerformanceStats && cameraEnabled && !showCompletion;

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Background - Solid, no blobs */}

      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          <main className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4 lg:py-8">
            {/* Camera Feed Section */}
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

            {/* Instruction Panel (Reference Card) */}
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
          </main>
        </div>
      </div>

      <CompletionDialog
        open={showCompletion}
        categoryName={selectedCategory}
        xpReward={alreadyCompleted ? 0 : xpReward}
        performanceData={performanceData}
      />

      {/* Performance Recorder - Controlled Mode */}
      {settings.showPerformanceStats && (
        <PerformanceRecorderInline
          isRecording={shouldRecord}
          onRecordingComplete={(data) => setPerformanceData(data)}
        />
      )}
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
