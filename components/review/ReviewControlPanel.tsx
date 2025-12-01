import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Eye,
  EyeOff,
  CheckCircle,
  CheckCircle2,
  Target,
  BookOpen,
  BarChart2,
} from 'lucide-react';
import { CategoryType } from '@type/review';
import { cn } from '@/lib/utils';

interface ReviewControlPanelProps {
  showHint: boolean;
  currentItem: string;
  selectedCategory: CategoryType;
  currentIndex: number;
  totalItems: number;
  rememberedCount: number;
  accuracy: number;
  onToggleHint: () => void;
}

type Tab = 'guide' | 'stats';

export function ReviewControlPanel({
  showHint,
  currentItem,
  selectedCategory,
  currentIndex,
  totalItems,
  rememberedCount,
  accuracy,
  onToggleHint,
}: ReviewControlPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('guide');
  const progress = Math.min(
    100,
    ((currentIndex + 1) / Math.max(1, totalItems)) * 100
  );

  return (
    <div className="flex flex-col h-full bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-white/20 dark:border-white/5">
        <button
          onClick={() => setActiveTab('guide')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === 'guide'
              ? 'bg-white/50 dark:bg-white/10 text-primary'
              : 'text-muted-foreground hover:bg-white/20 dark:hover:bg-white/5'
          )}
        >
          <BookOpen className="w-4 h-4" />
          Panduan
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === 'stats'
              ? 'bg-white/50 dark:bg-white/10 text-primary'
              : 'text-muted-foreground hover:bg-white/20 dark:hover:bg-white/5'
          )}
        >
          <BarChart2 className="w-4 h-4" />
          Statistik
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'guide' ? (
          <div className="flex flex-col h-full gap-4">
            {/* Target Item Display - Only show when hint is hidden */}
            {!showHint && (
              <div className="text-center py-2">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-primary/5">
                  <span className="text-4xl font-bold text-primary">
                    {currentItem}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tunjukkan gerakan untuk{' '}
                  {selectedCategory === 'huruf'
                    ? 'huruf'
                    : selectedCategory === 'angka'
                      ? 'angka'
                      : 'kata'}{' '}
                  <span className="font-bold text-foreground">
                    "{currentItem}"
                  </span>
                </p>
              </div>
            )}

            {/* Hint Content */}
            <div className="flex-1 min-h-0 flex flex-col">
              {showHint ? (
                <div className="relative flex-1 w-full bg-muted rounded-lg overflow-hidden border border-border/50">
                  <img
                    src={`/hand/${currentItem}/body dot (1).jpg`}
                    alt={`Gerakan ${currentItem}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-hand.png';
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/5">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Posisi Jelas</p>
                      <p className="text-xs text-muted-foreground">
                        Pastikan tangan terlihat jelas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/5">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Tahan 2 Detik</p>
                      <p className="text-xs text-muted-foreground">
                        Tahan posisi saat terdeteksi
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hint Toggle Button */}
            <Button
              variant={showHint ? 'default' : 'outline'}
              className="w-full mt-auto"
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
        ) : (
          <div className="flex flex-col h-full gap-6">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Progres Sesi</span>
                <span className="font-bold">
                  {currentIndex + 1}{' '}
                  <span className="text-muted-foreground">/ {totalItems}</span>
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                <span className="text-2xl font-bold text-green-700 dark:text-green-400 leading-none">
                  {rememberedCount}
                </span>
                <span className="text-xs text-green-600/80 uppercase font-bold mt-1">
                  Diingat
                </span>
              </div>

              <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-400 leading-none">
                  {accuracy}%
                </span>
                <span className="text-xs text-blue-600/80 uppercase font-bold mt-1">
                  Akurasi
                </span>
              </div>
            </div>

            {/* Additional Info or Motivation could go here */}
            <div className="mt-auto p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
              <p className="text-sm text-muted-foreground">
                "Konsistensi adalah kunci menguasai bahasa isyarat."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
