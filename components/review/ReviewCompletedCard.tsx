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
import { ReviewItem } from './types';

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
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Selesai!</CardTitle>
          <CardDescription>
            Anda telah berhasil menyelesaikan sesi ini. Ingatan Anda tentang
            materi ini:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Results Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {rememberedCount}
              </div>
              <div className="text-sm text-muted-foreground">Diingat</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Akurasi</div>
            </div>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {reviewItems.map((item, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                      item.remembered
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Ulangi Lagi
            </Button>
            <Button asChild className="flex-1">
              <Link href="/learn">
                <BookOpen className="h-4 w-4 mr-2" />
                Kembali Belajar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

