import { LearningUnit as LearningUnitType, Lesson } from '@type/learn';
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
    <div className="flex flex-col gap-8">
      {/* Unit Banner - always show */}
      <div className="relative p-6 bg-gradient-to-br from-purple-500 to-primary rounded-xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between text-white shadow-lg">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold">{unit.title}</h3>
          <p className="mt-2 opacity-90 text-lg">{unit.description}</p>
        </div>
        <div className="absolute -right-8 -bottom-8 text-white/20 hidden md:block">
          <span className="material-symbols-outlined filled text-[180px]!">
            school
          </span>
        </div>
      </div>

      {/* Lesson Path */}
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Jalur Pelajaran:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
          {unit.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              getLessonRoute={getLessonRoute}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
