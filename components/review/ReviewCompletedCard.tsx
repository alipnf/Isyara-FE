import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trophy, RotateCcw, BookOpen } from 'lucide-react';
import { ReviewItem } from '@type/review';

interface ReviewCompletedCardProps {
  reviewItems: ReviewItem[];
  rememberedCount: number;
  accuracy: number;
  onReset: () => void;
}

export function ReviewCompletedCard({
  reviewItems,
  rememberedCount,
  accuracy,
  onReset,
}: ReviewCompletedCardProps) {
  return (
    <div className="max-w-md mx-auto w-full">
      <Card className="text-center border-none shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <CardHeader className="pb-2 pt-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-green-50 dark:ring-green-900/10">
            <Trophy className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
            Selesai!
          </CardTitle>
          <CardDescription className="text-base">
            Sesi latihan telah berakhir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          {/* Results Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
              <span className="text-3xl font-bold text-green-700 dark:text-green-400 leading-none mb-1">
                {rememberedCount}
              </span>
              <span className="text-xs font-bold text-green-600/80 uppercase">
                Diingat
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <span className="text-3xl font-bold text-blue-700 dark:text-blue-400 leading-none mb-1">
                {accuracy}%
              </span>
              <span className="text-xs font-bold text-blue-600/80 uppercase">
                Akurasi
              </span>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>Detail Hasil</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {reviewItems.map((item, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border ${
                    item.remembered
                      ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50'
                      : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50'
                  }`}
                  title={item.remembered ? 'Diingat' : 'Belum diingat'}
                >
                  {item.item}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="w-full font-bold shadow-lg shadow-primary/20"
            >
              <Link href="/learn">
                <BookOpen className="h-5 w-5 mr-2" />
                Kembali Belajar
              </Link>
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              size="lg"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Ulangi Sesi Ini
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
