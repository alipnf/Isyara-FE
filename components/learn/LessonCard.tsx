import Link from 'next/link';
import { Lesson } from '@type/learn';

interface LessonCardProps {
  lesson: Lesson;
  getLessonRoute: (lesson: Lesson) => string;
}

export function LessonCard({ lesson, getLessonRoute }: LessonCardProps) {
  // Determine card styling based on lesson status
  const getCardStyle = () => {
    if (lesson.completed) {
      return 'bg-gradient-to-br from-green-500 to-teal-600';
    }
    if (lesson.current) {
      return 'bg-gradient-to-br from-blue-500 to-indigo-600 transform scale-105 ring-4 ring-blue-400/50 dark:ring-blue-600/50';
    }
    if (lesson.locked) {
      return 'bg-gray-300/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/10 opacity-70';
    }
    return 'bg-gradient-to-br from-gray-400 to-gray-500';
  };

  const getIconName = () => {
    if (lesson.completed) return 'check_circle';
    if (lesson.current) return 'play_circle';
    if (lesson.locked) return 'lock';
    return 'book';
  };

  const getStatusText = () => {
    if (lesson.completed) return 'Selesai';
    if (lesson.current) return 'Mulai';
    if (lesson.locked) return 'Terkunci';
    return 'Tersedia';
  };

  const getStatusColor = () => {
    if (lesson.completed)
      return 'text-green-600 dark:text-green-400 font-medium';
    if (lesson.current) return 'text-blue-600 dark:text-blue-400 font-bold';
    if (lesson.locked) return 'text-gray-500 dark:text-gray-400 font-medium';
    return 'text-gray-600 dark:text-gray-400 font-medium';
  };

  const CardContent = (
    <div className="flex flex-col items-center text-center shrink-0 w-40">
      <div
        className={`relative ${getCardStyle()} rounded-xl p-4 w-full aspect-square flex items-center justify-center text-white shadow-lg transition-transform duration-200 ease-in-out ${
          !lesson.locked ? 'hover:scale-105' : ''
        }`}
      >
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xl font-bold">
            {lesson.title.replace('Lesson ', '')}
          </span>
        </div>
      </div>
      <p className={`mt-2 text-sm ${getStatusColor()} flex items-center gap-1`}>
        <span className="material-symbols-outlined filled !text-base">
          {getIconName()}
        </span>
        {getStatusText()}
      </p>
    </div>
  );

  if (lesson.locked) {
    return <div className="cursor-not-allowed">{CardContent}</div>;
  }

  return (
    <Link href={getLessonRoute(lesson)} className="cursor-pointer">
      {CardContent}
    </Link>
  );
}
