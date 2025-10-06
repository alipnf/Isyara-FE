'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { QuizState, CategoryType, QuizQuestion } from '@type/quiz';
import type { LessonSettings } from '@type/lesson';
import { categories } from '@components/quiz/quizData';

export function useQuizLogic() {
  const [quizState, setQuizState] = useState<QuizState>('category');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>('letters');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<
    'inactive' | 'active' | 'error'
  >('inactive');

  const [settings, setSettings] = useState<LessonSettings>({
    showHandLandmarks: true,
    audioFeedback: false,
    autoAdvance: true,
    holdDuration: [2],
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('category');
    const valid = ['letters', 'numbers', 'words'];
    if (cat && valid.includes(cat)) {
      setSelectedCategory(cat as CategoryType);
      setQuizState('setup');
    } else {
      setSelectedCategory('letters');
      setQuizState('setup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    setQuizState('setup');
  };

  const generateQuiz = () => {
    const items = categories[selectedCategory].items;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, items.length));
    const newQuestions = selected.map((item) => ({
      item,
      answered: false,
      correct: false,
      timeSpent: 0,
    }));
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setTimeLeft(15);
  };

  const startQuiz = () => {
    generateQuiz();
    setQuizState('active');
    setIsDetecting(true);
    setCameraEnabled(true);
  };

  useEffect(() => {
    if (quizState === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizState === 'active' && timeLeft === 0) {
      nextQuestion(false);
    }
  }, [quizState, timeLeft]);

  const nextQuestion = (correct: boolean) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      answered: true,
      correct,
      timeSpent: 15 - timeLeft,
    };
    setQuestions(updatedQuestions);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(15);
      setUserAnswer(null);
      setIsCorrect(null);
      setConfidence(0);
    } else {
      setQuizState('completed');
      setIsDetecting(false);
      setCameraEnabled(false);
    }
  };

  const correctAnswers = questions.filter((q) => q.correct).length;
  const answeredQuestions = questions.filter((q) => q.answered).length;

  const resetQuiz = () => {
    setQuizState('setup');
    setCurrentQuestion(0);
    setTimeLeft(15);
    setQuestions([]);
    setIsDetecting(false);
    setUserAnswer(null);
    setCameraEnabled(false);
    setConfidence(0);
    setIsCorrect(null);
    setDetectionStatus('inactive');
  };

  const goBack = () => {
    window.location.href = '/learn';
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  const handleDetection = (label: string) => {
    const currentItem = questions[currentQuestion]?.item;
    const correct = label === currentItem;
    setIsCorrect(correct);
    if (correct) {
      setTimeout(() => {
        nextQuestion(true);
      }, 1000);
    }
  };

  const handleLiveUpdate = (label: string | null, confidencePct: number) => {
    setConfidence(confidencePct);
    setUserAnswer(label);
  };

  const handleStatusChange = (status: 'inactive' | 'active' | 'error') => {
    setDetectionStatus(status);
  };

  const handleManualAnswer = (correct: boolean) => {
    nextQuestion(correct);
  };

  const handleReset = () => {
    setIsCorrect(null);
    setConfidence(0);
    setUserAnswer(null);
  };

  const handleSettingsChange = (newSettings: LessonSettings) => {
    setSettings(newSettings);
  };

  return {
    quizState,
    selectedCategory,
    currentQuestion,
    timeLeft,
    questions,
    isDetecting,
    userAnswer,
    correctAnswers,
    answeredQuestions,
    cameraEnabled,
    confidence,
    isCorrect,
    detectionStatus,
    settings,
    selectCategory,
    startQuiz,
    nextQuestion,
    resetQuiz,
    goBack,
    toggleCamera,
    handleDetection,
    handleLiveUpdate,
    handleStatusChange,
    handleManualAnswer,
    handleReset,
    handleSettingsChange,
  };
}
