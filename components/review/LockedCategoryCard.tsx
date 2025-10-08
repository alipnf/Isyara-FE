import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lock, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { CategoryData, LessonKey, LessonProgress } from '@type/review';

interface LockedCategoryCardProps {
  category: CategoryData;
  categoryName: string;
  userProgress: { lessons: Record<LessonKey, LessonProgress> };
  onBack: () => void;
}

export function LockedCategoryCard({
  category,
  categoryName,
  userProgress,
  onBack,
}: LockedCategoryCardProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Belum Tersedia</CardTitle>
          <CardDescription>
            Selesaikan 100% materi {categoryName} terlebih dahulu untuk
            mengakses mode ini.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Syarat Akses Review
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Mode review akan terbuka setelah seluruh pelajaran{' '}
                  {category.name}
                  selesai (100%).
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Pembelajaran Yang Diperlukan:</p>
            <div className="space-y-2">
              {category.requiredLessons.map((lesson) => {
                const typedLesson = lesson as LessonKey;
                const lessonProgress =
                  userProgress.lessons[typedLesson].progress;
                const isCompleted = lessonProgress >= 100;

                return (
                  <div
                    key={lesson}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border border-muted-foreground rounded-full" />
                      )}
                      <span className="text-sm">{lesson}</span>
                    </div>
                    <Progress value={lessonProgress} className="w-24 h-1.5" />
                  </div>
                );
              })}
            </div>
          </div>

          <Button onClick={onBack} size="lg" className="w-full">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
