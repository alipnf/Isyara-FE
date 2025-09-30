import { useState, useEffect } from 'react';
import {
  ReviewState,
  CategoryType,
  ReviewItem,
  CategoryStatus,
  LessonKey,
} from './types';
import { categories, userProgress } from './reviewData';

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
  const [categoryStatus, setCategoryStatus] = useState<{
    [key in CategoryType]: CategoryStatus;
  }>({
    huruf: { unlocked: false, progress: 0 },
    angka: { unlocked: false, progress: 0 },
    kata: { unlocked: false, progress: 0 },
  });

  // Check if category is unlocked based on user progress
  useEffect(() => {
    const newStatus = { ...categoryStatus };

    // Check Huruf category
    const hurufLessons = categories.huruf.requiredLessons as LessonKey[];
    const hurufProgress = hurufLessons.map(
      (lesson) => userProgress.lessons[lesson].progress
    );
    const hurufAvgProgress =
      hurufProgress.reduce((acc, val) => acc + val, 0) / hurufProgress.length;
    newStatus.huruf = {
      unlocked: hurufAvgProgress >= 50,
      progress: hurufAvgProgress,
    };

    // Check Angka category
    const angkaLessons = categories.angka.requiredLessons as LessonKey[];
    const angkaProgress = angkaLessons.map(
      (lesson) => userProgress.lessons[lesson].progress
    );
    const angkaAvgProgress =
      angkaProgress.reduce((acc, val) => acc + val, 0) / angkaProgress.length;
    newStatus.angka = {
      unlocked: angkaAvgProgress >= 50,
      progress: angkaAvgProgress,
    };

    // Check Kata category
    const kataLessons = categories.kata.requiredLessons as LessonKey[];
    const kataProgress = kataLessons.map(
      (lesson) => userProgress.lessons[lesson].progress
    );
    const kataAvgProgress =
      kataProgress.reduce((acc, val) => acc + val, 0) / kataProgress.length;
    newStatus.kata = {
      unlocked: kataAvgProgress >= 50,
      progress: kataAvgProgress,
    };

    setCategoryStatus(newStatus);
  }, []);

  // Handle category selection
  const selectCategory = (category: CategoryType) => {
    setSelectedCategory(category);

    if (categoryStatus[category].unlocked) {
      setReviewState('setup');
      setShowLocked(false);
    } else if (category === 'huruf') {
      setReviewState('setup');
      setShowLocked(false);
    } else {
      setShowLocked(true);
    }
  };

  // Generate review items
  const generateReviewItems = () => {
    const items = categories[selectedCategory].items;
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

  // Start review
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

  // Next item
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

  // Skip current item
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

  // Handle detection
  const handleDetection = (label: string, confidence: number) => {
    console.log(`Detected: ${label} with confidence ${confidence}%`);

    const isCorrect =
      reviewItems[currentItemIndex] &&
      label === reviewItems[currentItemIndex].item;
    nextItem(isCorrect);
  };

  // Handle live updates
  const handleLiveUpdate = (label: string | null, confidence: number) => {
    setCurrentConfidence(confidence);
    if (label) {
      setUserAnswer(label);
    }
  };

  // Reset review
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

  // Toggle camera
  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  // Handle camera error
  const handleCameraError = () => {
    setCameraEnabled(false);
    alert('Gagal mengaktifkan kamera. Harap periksa izin kamera Anda.');
  };

  // Toggle hint
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // Calculate results
  const rememberedCount = reviewItems.filter((item) => item.remembered).length;
  // Clean up resources when component unmounts
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
    categoryStatus,
    rememberedCount,
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
  };
}
