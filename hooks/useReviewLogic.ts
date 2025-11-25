import { useState, useEffect } from 'react';
import type {
  ReviewState,
  CategoryType,
  ReviewItem,
  CategoryStatus,
  CategoryData,
} from '@type/review';
import { buildReviewData } from '@/utils/supabase/review';
import { useLayoutStore } from '@/stores/layoutStore';

export function useReviewLogic(initialCategory: CategoryType) {
  const [reviewState, setReviewState] = useState<ReviewState>('category');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>(initialCategory);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showLocked, setShowLocked] = useState(false);
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [categories, setCategories] = useState<
    Partial<Record<CategoryType, CategoryData>>
  >({});
  const [categoryStatus, setCategoryStatus] = useState<
    Partial<Record<CategoryType, CategoryStatus>>
  >({});
  const [perLessonProgress, setPerLessonProgress] = useState<{
    lessons: Record<string, { completed: boolean; progress: number }>;
  }>({ lessons: {} });
  const { setNavbarHidden } = useLayoutStore();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await buildReviewData();
        if (!mounted) return;
        setCategories(
          res.categories as Partial<Record<CategoryType, CategoryData>>
        );
        setCategoryStatus(
          res.categoryStatus as Partial<Record<CategoryType, CategoryStatus>>
        );
        setPerLessonProgress(res.perLessonProgress);
      } catch (e) {
        if (!mounted) return;
        setCategories({});
        setCategoryStatus({});
        setPerLessonProgress({ lessons: {} });
      }
    }
    load();
    return () => {
      mounted = false;
      setNavbarHidden(false);
    };
  }, [setNavbarHidden]);

  useEffect(() => {
    if (reviewState === 'category') {
      setNavbarHidden(false);
    } else {
      setNavbarHidden(true);
    }
  }, [reviewState, setNavbarHidden]);

  const selectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    if (categoryStatus[category]?.unlocked) {
      setReviewState('setup');
      setShowLocked(false);
    } else {
      setShowLocked(true);
    }
  };

  const generateReviewItems = () => {
    const items = categories[selectedCategory]?.items || [];
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, items.length));
    const newItems = selected.map((item) => ({
      item,
      reviewed: false,
      remembered: false,
    }));
    setReviewItems(newItems);
    setCurrentItemIndex(0);
  };

  const startReview = () => {
    if (!cameraEnabled) {
      alert('Silakan aktifkan kamera terlebih dahulu');
      return;
    }
    generateReviewItems();
    setReviewState('active');
    setIsDetecting(true);
    setCurrentConfidence(0);
    setShowHint(false);
  };

  const nextItem = (remembered: boolean) => {
    const updatedItems = [...reviewItems];
    updatedItems[currentItemIndex] = {
      ...updatedItems[currentItemIndex],
      reviewed: true,
      remembered,
    };
    setReviewItems(updatedItems);
    if (currentItemIndex < reviewItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setUserAnswer(null);
      setCurrentConfidence(0);
      setShowHint(false);
    } else {
      setReviewState('completed');
      setIsDetecting(false);
    }
  };

  const skipItem = () => {
    if (currentItemIndex < reviewItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setUserAnswer(null);
      setCurrentConfidence(0);
      setShowHint(false);
    } else {
      nextItem(false);
    }
  };

  const handleDetection = (label: string, confidence: number) => {
    const isCorrect =
      reviewItems[currentItemIndex] &&
      label === reviewItems[currentItemIndex].item;
    nextItem(isCorrect);
  };

  const handleLiveUpdate = (label: string | null, confidence: number) => {
    setCurrentConfidence(confidence);
    if (label) {
      setUserAnswer(label);
    }
  };

  const resetReview = () => {
    setIsDetecting(false);
    setReviewState('category');
    setCurrentItemIndex(0);
    setReviewItems([]);
    setUserAnswer(null);
    setCurrentConfidence(0);
    setShowHint(false);
    setCameraEnabled(false);
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  const handleCameraError = () => {
    setCameraEnabled(false);
    alert('Gagal mengaktifkan kamera. Harap periksa izin kamera Anda.');
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const rememberedCount = reviewItems.filter((item) => item.remembered).length;
  const accuracy = reviewItems.length
    ? Math.round((rememberedCount / reviewItems.length) * 100)
    : 0;

  useEffect(() => {
    return () => {
      setIsDetecting(false);
      setCameraEnabled(false);
    };
  }, []);

  return {
    reviewState,
    selectedCategory,
    currentItemIndex,
    cameraEnabled,
    reviewItems,
    isDetecting,
    userAnswer,
    showLocked,
    currentConfidence,
    showHint,
    categoryStatus: categoryStatus as { [key in CategoryType]: CategoryStatus },
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
    categories: categories as Partial<Record<CategoryType, CategoryData>>,
    perLessonProgress,
  };
}
