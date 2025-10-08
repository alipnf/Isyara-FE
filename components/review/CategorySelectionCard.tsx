import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CategoryType, CategoryData } from '@type/review';

interface CategorySelectionCardProps {
  categoryKey: CategoryType;
  category: CategoryData;
  isUnlocked: boolean;
  progress: number;
  onSelect: (category: CategoryType) => void;
}

export function CategorySelectionCard({
  categoryKey,
  category,
  isUnlocked,
  progress,
  onSelect,
}: CategorySelectionCardProps) {
  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 ${!isUnlocked ? 'opacity-80' : ''}`}
      onClick={() => onSelect(categoryKey)}
    >
      <CardHeader className="text-center">
        <div
          className={`w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 ${!isUnlocked ? 'bg-muted/30' : ''}`}
        >
          <span
            className={`text-2xl font-bold ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}
          >
            {category.items.length}
          </span>
        </div>
        <CardTitle className="text-xl">{category.name}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Badge variant="outline" className="mb-4">
          {category.items.length} item tersedia
        </Badge>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">
              Progress Pembelajaran
            </span>
            <span className="text-xs font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <p className="text-sm text-muted-foreground">
          {categoryKey === 'huruf' && 'Alfabet A-Z'}
          {categoryKey === 'angka' && 'Angka 0-9'}
          {categoryKey === 'kata' && 'Kata-kata dasar'}
        </p>

        {!isUnlocked && (
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-red-500">
            <span>Selesaikan 100% materi untuk membuka</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
