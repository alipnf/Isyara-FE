'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import type { CategoryType } from '@type/quiz';
import { categories } from './quizData';

interface CategorySelectionCardProps {
  onSelectCategory: (category: CategoryType) => void;
}

export function CategorySelectionCard({
  onSelectCategory,
}: CategorySelectionCardProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Pilih Kategori Kuis</h2>
        <p className="text-muted-foreground">
          Pilih jenis latihan yang ingin Anda uji
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(categories).map(([key, category]) => (
          <Card
            key={key}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => onSelectCategory(key as CategoryType)}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="outline" className="mb-4">
                {category.items.length} soal tersedia
              </Badge>
              <p className="text-sm text-muted-foreground">
                {key === 'letters' && 'Alfabet A-Z'}
                {key === 'numbers' && 'Angka 0-9'}
                {key === 'words' && 'Kata-kata dasar'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
