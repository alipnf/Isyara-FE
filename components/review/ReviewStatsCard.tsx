import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, CheckCircle2, Target } from 'lucide-react';

interface ReviewStatsCardProps {
  currentItem: string;
  currentIndex: number;
  totalItems: number;
  rememberedCount: number;
  accuracy: number;
  showHint: boolean;
  onToggleHint: () => void;
}

export function ReviewStatsCard({
  currentItem,
  currentIndex,
  totalItems,
  rememberedCount,
  accuracy,
  showHint,
  onToggleHint,
}: ReviewStatsCardProps) {
  const progress = Math.min(
    100,
    ((currentIndex + 1) / Math.max(1, totalItems)) * 100
  );

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl h-full min-h-0">
      <h2 className="text-base font-semibold text-foreground">
        Statistik Sesi
      </h2>

      <div className="space-y-4">
        {/* Progress Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progres</span>
            <span className="font-bold">
              {currentIndex + 1}{' '}
              <span className="text-muted-foreground">/ {totalItems}</span>
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <CheckCircle2 className="h-4 w-4 text-green-600 mb-1" />
            <span className="text-xl font-bold text-green-700 dark:text-green-400 leading-none">
              {rememberedCount}
            </span>
            <span className="text-[10px] text-green-600/80 uppercase font-bold mt-0.5">
              Diingat
            </span>
          </div>

          <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <Target className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xl font-bold text-blue-700 dark:text-blue-400 leading-none">
              {accuracy}%
            </span>
            <span className="text-[10px] text-blue-600/80 uppercase font-bold mt-0.5">
              Akurasi
            </span>
          </div>
        </div>

        {/* Hint Toggle */}
        <Button
          variant={showHint ? 'default' : 'outline'}
          className="w-full"
          onClick={onToggleHint}
        >
          {showHint ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Sembunyikan Hint
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Lihat Hint
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
