'use client';

import { useState } from 'react';
import {
  UserStatsHeader,
  LearningUnit,
  learningUnits,
  getLessonRoute,
} from '@/components/learn';

export default function LearnPage() {
  const [userStats] = useState({
    xp: 1250,
    level: 3,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
        <UserStatsHeader stats={userStats} />

        {/* Learning Path */}
        <div className="space-y-6 sm:space-y-8">
          {learningUnits.map((unit, unitIndex) => (
            <LearningUnit
              key={unit.id}
              unit={unit}
              unitIndex={unitIndex}
              getLessonRoute={getLessonRoute}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
