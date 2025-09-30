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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{currentItem}</CardTitle>
            <CardDescription>
              {categoryName} {currentIndex + 1} dari {totalItems}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-base px-4 py-2">
              {rememberedCount} diingat
            </Badge>
            <Button
              variant={showHint ? 'default' : 'outline'}
              size="lg"
              onClick={onToggleHint}
            >
              {showHint ? (
                <EyeOff className="h-5 w-5 mr-2" />
              ) : (
                <Eye className="h-5 w-5 mr-2" />
              )}
              {showHint ? 'Sembunyikan' : 'Hint'}
            </Button>
          </div>
        </div>
        <Progress
          value={(currentIndex / totalItems) * 100}
          className="h-2 mt-4"
        />
      </CardHeader>
    </Card>
  );
}
