import {
  CategoryType,
  CategoryData,
  LessonKey,
  LessonProgress,
} from '@type/review';

export const categories: Record<CategoryType, CategoryData> = {
  huruf: {
    name: 'Huruf',
    items: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ],
    description: 'Alfabet BISINDO A-Z',
    requiredLessons: [
      'Huruf A-E',
      'Huruf F-J',
      'Huruf K-O',
      'Huruf P-T',
      'Huruf U-Z',
    ],
    requiredProgress: 100,
  },
  angka: {
    name: 'Angka',
    items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    description: 'Angka BISINDO 0-9',
    requiredLessons: ['Angka 0-4', 'Angka 5-9'],
    requiredProgress: 100,
  },
  kata: {
    name: 'Kata',
    items: [
      'HALO',
      'TERIMA KASIH',
      'MAAF',
      'TOLONG',
      'SELAMAT',
      'NAMA',
      'SAYA',
      'KAMU',
    ],
    description: 'Kata-kata dasar BISINDO',
    requiredLessons: ['Sapaan & Salam', 'Kata Ganti'],
    requiredProgress: 100,
  },
};

// Mock data untuk progress pembelajaran
// Dalam aplikasi nyata, ini akan diambil dari database atau state management
export const userProgress: {
  lessons: Record<LessonKey, LessonProgress>;
} = {
  lessons: {
    'Huruf A-E': { completed: true, progress: 100 },
    'Huruf F-J': { completed: true, progress: 100 },
    'Huruf K-O': { completed: false, progress: 40 },
    'Huruf P-T': { completed: false, progress: 0 },
    'Huruf U-Z': { completed: false, progress: 0 },
    'Angka 0-4': { completed: false, progress: 0 },
    'Angka 5-9': { completed: false, progress: 0 },
    'Sapaan & Salam': { completed: false, progress: 0 },
    'Kata Ganti': { completed: false, progress: 0 },
  },
};
