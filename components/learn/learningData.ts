import { LearningUnit } from './types';

// Mock data for learning units
export const learningUnits: LearningUnit[] = [
  {
    id: 1,
    title: 'Dasar-dasar BISINDO',
    description: 'Pelajari huruf A-Z dalam bahasa isyarat',
    lessons: [
      {
        id: 1,
        title: 'Huruf A-E',
        completed: true,
        type: 'lesson' as const,
        hurufRange: ['A', 'B', 'C', 'D', 'E'],
        progress: 100,
      },
      {
        id: 2,
        title: 'Huruf F-J',
        completed: true,
        type: 'lesson' as const,
        hurufRange: ['F', 'G', 'H', 'I', 'J'],
        progress: 100,
      },
      {
        id: 3,
        title: 'Huruf K-O',
        completed: false,
        type: 'lesson' as const,
        current: true,
        hurufRange: ['K', 'L', 'M', 'N', 'O'],
        progress: 40,
      },
      {
        id: 4,
        title: 'Huruf P-T',
        completed: false,
        type: 'lesson' as const,
        // Unlocked: previously locked
        hurufRange: ['P', 'Q', 'R', 'S', 'T'],
        progress: 0,
      },
      {
        id: 5,
        title: 'Huruf U-Z',
        completed: false,
        type: 'lesson' as const,
        // Unlocked: previously locked
        hurufRange: ['U', 'V', 'W', 'X', 'Y', 'Z'],
        progress: 0,
      },
      {
        id: 6,
        title: 'Kuis Huruf',
        completed: false,
        type: 'quiz' as const,
        // Unlocked: previously locked
        progress: 0,
      },
    ],
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    progress: 40,
  },
  {
    id: 2,
    title: 'Angka & Bilangan',
    description: 'Belajar angka 0-9 dan bilangan dasar',
    lessons: [
      {
        id: 1,
        title: 'Angka 0-4',
        completed: false,
        type: 'lesson' as const,
        locked: true,
        numberRange: ['0', '1', '2', '3', '4'],
        progress: 0,
      },
      {
        id: 2,
        title: 'Angka 5-9',
        completed: false,
        type: 'lesson' as const,
        locked: true,
        numberRange: ['5', '6', '7', '8', '9'],
        progress: 0,
      },
      {
        id: 3,
        title: 'Kuis Angka',
        completed: false,
        type: 'quiz' as const,
        locked: true,
        progress: 0,
      },
    ],
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    progress: 0,
    locked: true,
  },
  {
    id: 3,
    title: 'Kata-kata Dasar',
    description: 'Pelajari kata-kata sehari-hari',
    lessons: [],
    color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    progress: 0,
    comingSoon: true,
  },
];
