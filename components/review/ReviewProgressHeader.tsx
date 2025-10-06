import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff } from 'lucide-react';

interface ReviewProgressHeaderProps {
  currentItem: string;
  currentIndex: number;
  totalItems: number;
  rememberedCount: number;
  showHint: boolean;
  categoryName: string;
  onToggleHint: () => void;
}

export function ReviewProgressHeader({
  currentItem,
  currentIndex,
  totalItems,
  rememberedCount,
  showHint,
  categoryName,
  onToggleHint,
}: ReviewProgressHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-xl sm:text-2xl">{currentItem}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {categoryName} {currentIndex + 1} dari {totalItems}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge
              variant="outline"
              className="inline-flex items-center h-9 px-3 sm:px-4 text-sm sm:text-base"
            >
              {rememberedCount} diingat
            </Badge>
            <Button
              variant={showHint ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleHint}
              aria-label={showHint ? 'Sembunyikan hint' : 'Tampilkan hint'}
            >
              {showHint ? (
                <EyeOff className="h-5 w-5 mr-0 sm:mr-2" />
              ) : (
                <Eye className="h-5 w-5 mr-0 sm:mr-2" />
              )}
              <span className="hidden sm:inline">
                {showHint ? 'Sembunyikan' : 'Hint'}
              </span>
            </Button>
          </div>
        </div>
        <Progress
          value={Math.max(
            0,
            Math.min(100, ((currentIndex + 1) / Math.max(1, totalItems)) * 100)
          )}
          className="h-3 w-full sm:h-2 mt-3 sm:mt-4"
        />
      </CardHeader>
    </Card>
  );
}
