import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock, Clock } from 'lucide-react';
import { LearningUnit as LearningUnitType, Lesson } from './types';
import { LessonCard } from './LessonCard';

interface LearningUnitProps {
  unit: LearningUnitType;
  unitIndex: number;
  getLessonRoute: (lesson: Lesson) => string;
}

export function LearningUnit({
  unit,
  unitIndex,
  getLessonRoute,
}: LearningUnitProps) {
  return (
    <div className="relative">
      {/* Unit Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${unit.color} md:flex items-center justify-center shadow-lg hidden ${
              unit.locked || unit.comingSoon ? 'grayscale opacity-70' : ''
            }`}
          >
            {unit.locked ? (
              <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            ) : unit.comingSoon ? (
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-white">
                {unitIndex + 1}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                {unit.title}
              </h3>
              <div className="flex-shrink-0">
                {unit.progress === 100 && (
                  <Badge className="bg-secondary text-secondary-foreground text-xs">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Selesai
                  </Badge>
                )}
                {unit.comingSoon && (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground text-xs"
                  >
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Segera Hadir
                  </Badge>
                )}
                {unit.locked && (
                  <Badge
                    variant="outline"
                    className="bg-muted/50 text-muted-foreground text-xs"
                  >
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Terkunci
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              {unit.description}
            </p>
            {!unit.locked && !unit.comingSoon && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    Progress
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {unit.progress}%
                  </span>
                </div>
                <Progress
                  value={unit.progress}
                  className="h-2 w-full sm:w-48"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lessons Grid or Coming Soon Message */}
      {unit.comingSoon ? (
        <div className="sm:ml-20">
          <Card className="bg-muted/30 border-dashed border-2">
            <CardContent className="p-6 sm:p-8 text-center">
              <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Akan Segera Ditambahkan
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground">
                Unit pembelajaran ini sedang dalam pengembangan dan akan
                tersedia dalam update mendatang.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 sm:ml-20">
          {unit.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              getLessonRoute={getLessonRoute}
            />
          ))}
        </div>
      )}
    </div>
  );
}

