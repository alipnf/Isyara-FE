import { useState, useEffect } from 'react';
import type { CategoryKey } from '@type/lesson';
import type { LessonSettings } from '@type/lesson';
import { categories } from '@components/lesson/lessonData';

export function useLessonLogic(
  selectedCategory: CategoryKey,
  groupParam: string
) {
  const [groupItems, setGroupItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(
    () => new Set()
  );
  const [showCompletion, setShowCompletion] = useState(false);
  const [settings, setSettings] = useState<LessonSettings>({
    showHandLandmarks: true,
    autoAdvance: true,
    holdDuration: [3],
    confidenceThreshold: [75],
    showPerformanceStats: false,
  });

  useEffect(() => {
    if (groupParam) {
      const items = groupParam.split(',');
      const validItems = items.filter((item) =>
        categories[selectedCategory].items.includes(item)
      );
      setGroupItems(validItems);
    } else {
      setGroupItems(categories[selectedCategory].items.slice(0, 5));
    }
  }, [selectedCategory, groupParam]);

  useEffect(() => {
    if (groupItems.length > 0 && !selectedItem) {
      setSelectedItem(groupItems[0]);
    }
  }, [groupItems, selectedItem]);

  const handleDetection = (label: string, detectedConfidence: number) => {
    setConfidence(detectedConfidence);
    const isMatch = label === selectedItem;
    setIsCorrect(isMatch);

    if (isMatch) {
      setCompletedItems((prev) => {
        const next = new Set(prev);
        next.add(selectedItem);
        return next;
      });

      if (settings.autoAdvance) {
        const currentIndex = groupItems.indexOf(selectedItem);
        const completedNow = new Set(completedItems);
        completedNow.add(selectedItem);

        let nextIncomplete: string | undefined = undefined;
        for (let i = 1; i <= groupItems.length; i++) {
          const idx = (currentIndex + i) % groupItems.length;
          const candidate = groupItems[idx];
          if (!completedNow.has(candidate)) {
            nextIncomplete = candidate;
            break;
          }
        }

        if (nextIncomplete) {
          setSelectedItem(nextIncomplete);
        } else {
          setShowCompletion(true);
        }

        setIsCorrect(null);
        setConfidence(0);
      }
    }
  };

  const handleLiveUpdate = (_label: string | null, confidencePct: number) => {
    setConfidence(confidencePct);
  };

  const handleCameraStatusChange = (
    status: 'inactive' | 'active' | 'error'
  ) => {
    if (status === 'active') {
      setIsCorrect(null);
      setConfidence(0);
    } else if (status === 'error') {
      setCameraEnabled(false);
      setIsDetecting(false);
    }
  };

  const toggleCamera = () => {
    const newState = !cameraEnabled;
    setCameraEnabled(newState);
    setIsDetecting(newState);
  };

  const resetSession = () => {
    setConfidence(0);
    setIsCorrect(null);
    setCompletedItems(new Set());
    setShowCompletion(false);
  };

  const goToNextItem = () => {
    const currentIndex = groupItems.indexOf(selectedItem);
    const nextIndex = (currentIndex + 1) % groupItems.length;
    setSelectedItem(groupItems[nextIndex]);
    setIsCorrect(null);
    setConfidence(0);
  };

  const goToPreviousItem = () => {
    const currentIndex = groupItems.indexOf(selectedItem);
    const prevIndex =
      (currentIndex - 1 + groupItems.length) % groupItems.length;
    setSelectedItem(groupItems[prevIndex]);
    setIsCorrect(null);
    setConfidence(0);
  };

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    setIsCorrect(null);
    setConfidence(0);
  };

  return {
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
  };
}
