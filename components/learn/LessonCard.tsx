import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Play, Lock, Zap, Award, BookOpen } from 'lucide-react';
import { Lesson } from '@type/learn';

interface LessonCardProps {
  lesson: Lesson;
  getLessonRoute: (lesson: Lesson) => string;
}

export function LessonCard({ lesson, getLessonRoute }: LessonCardProps) {
  return (
    <Card
      className={`relative transition-all duration-300 ${!lesson.locked ? 'hover:scale-105' : ''} cursor-pointer ${
        lesson.completed
          ? 'bg-secondary/10 border-secondary shadow-lg'
          : lesson.current
            ? 'bg-primary/10 border-primary shadow-lg animate-pulse-glow'
            : lesson.locked
              ? 'bg-muted/50 border-muted opacity-80 cursor-not-allowed'
              : 'bg-card hover:shadow-lg'
      }`}
    >
      <Link
        href={getLessonRoute(lesson)}
        className={lesson.locked ? 'pointer-events-none' : ''}
      >
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="mb-3 sm:mb-4">
            {lesson.completed ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-foreground" />
              </div>
            ) : lesson.current ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Play className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
            ) : lesson.locked ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                {lesson.type === 'quiz' ? (
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                ) : (
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                )}
              </div>
            )}
          </div>

          <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2">
            {lesson.title}
          </h4>

          {lesson.type === 'quiz' && (
            <Badge variant="outline" className="text-[10px] sm:text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Kuis
            </Badge>
          )}

          {lesson.progress > 0 && lesson.progress < 100 && (
            <div className="mt-2 sm:mt-3">
              <Progress value={lesson.progress} className="h-1.5" />
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                {lesson.progress}% selesai
              </p>
            </div>
          )}

          {lesson.current && !lesson.locked && (
            <Button
              size="sm"
              className="mt-2 sm:mt-3 w-full text-xs sm:text-sm"
            >
              Lanjutkan
            </Button>
          )}

          {lesson.completed && (
            <p className="text-[10px] sm:text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Selesai
            </p>
          )}

          {lesson.locked && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Selesaikan level sebelumnya
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

