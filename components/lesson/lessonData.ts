import { Category, CategoryKey } from './types';

// Define categories object
export const categories: Record<CategoryKey, Category> = {
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
    color: 'bg-blue-500',
  },
  angka: {
    name: 'Angka',
    items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    description: 'Angka 0-9 dalam BISINDO',
    color: 'bg-green-500',
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
      'BAIK',
      'BURUK',
    ],
    description: 'Kata-kata dasar BISINDO',
    color: 'bg-purple-500',
  },
};

// Type guard function for checking if a string is a valid category
export function isCategoryKey(key: string): key is CategoryKey {
  return key === 'huruf' || key === 'angka' || key === 'kata';
}
