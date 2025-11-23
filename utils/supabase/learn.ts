import { supabase } from '@/utils/supabase/client';
import type { LearningUnit as LearningUnitType, Lesson } from '@/types/learn';
import {
  LESSONS,
  getLessonByKey,
  getLessonsByUnit,
  getUnitMeta,
  UNITS,
} from '@/lib/lessonDefinitions';

// User progress type
export interface UserLessonProgress {
  lesson_key: string;
  status: 'in_progress' | 'completed';
  progress: number;
  completed_at: string | null;
}

/**
 * Fetch user's progress for all lessons
 * Returns a Map for O(1) lookups
 */
export async function fetchUserProgress(): Promise<
  Map<string, UserLessonProgress>
> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Map();

  const { data, error } = await supabase
    .from('user_lessons')
    .select('lesson_key, status, progress, completed_at')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching user progress:', error);
    return new Map();
  }

  return new Map(
    (data || []).map((p) => [p.lesson_key, p as UserLessonProgress])
  );
}

/**
 * Build learning units with user progress overlay
 * This combines static lesson definitions with user progress from DB
 */
export async function buildUnitsWithProgress(): Promise<LearningUnitType[]> {
  const progressMap = await fetchUserProgress();

  // Build units from static definitions
  const units = UNITS.map((unitMeta) => {
    const lessons = getLessonsByUnit(unitMeta.id).map((lessonDef, idx) => {
      const progress = progressMap.get(lessonDef.key);

      // Generate a numeric ID based on unit and order for compatibility
      const numericId = unitMeta.id * 100 + idx;

      return {
        id: numericId, // Numeric ID for type compatibility
        key: lessonDef.key, // Keep key for database operations
        title: lessonDef.title,
        type: lessonDef.type,
        completed: progress?.status === 'completed',
        progress: progress?.progress || 0,
        locked: false, // Will be computed below
        current: false, // Will be computed below
        ...lessonDef.payload, // Include hurufRange, etc.
      } as Lesson & { key: string };
    });

    const completedCount = lessons.filter((l) => l.completed).length;
    const progressPct = Math.round(
      (completedCount / Math.max(lessons.length, 1)) * 100
    );

    return {
      id: unitMeta.id,
      title: unitMeta.title,
      description: unitMeta.description,
      color: unitMeta.color,
      lessons,
      progress: progressPct,
    } as LearningUnitType;
  });

  // Apply locking rules
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    // Lock whole unit if previous unit not 100%
    const unitLocked = i > 0 && units[i - 1].progress < 100;
    if (unitLocked) {
      (unit as any).locked = true;
      unit.lessons = unit.lessons.map((ls) => ({ ...ls, locked: true }));
      continue;
    }

    // Within-unit locking: each lesson locked until previous completed
    const nonQuizCompleted = () =>
      unit.lessons.filter((l) => l.type === 'lesson' && l.completed).length;
    const nonQuizTotal = unit.lessons.filter((l) => l.type === 'lesson').length;

    unit.lessons = unit.lessons.map((ls, idx) => {
      let locked = false;
      if (ls.type === 'quiz') {
        // Quiz unlocked only if all non-quiz lessons completed
        locked = nonQuizCompleted() < nonQuizTotal;
      } else {
        // Non-quiz: require previous lesson completed
        if (idx === 0) locked = false;
        else locked = !unit.lessons[idx - 1].completed;
      }
      return { ...ls, locked } as Lesson;
    });

    // Mark current lesson (first not completed and not locked)
    const curIdx = unit.lessons.findIndex((ls) => !ls.completed && !ls.locked);
    if (curIdx >= 0) {
      unit.lessons = unit.lessons.map((ls, j) => ({
        ...ls,
        current: j === curIdx,
      }));
    }
  }

  return units;
}

/**
 * Build static learning units without user progress (fallback/offline mode)
 */
export function buildStaticUnits(): LearningUnitType[] {
  // Build units from static definitions
  const units = UNITS.map((unitMeta) => {
    const lessons = getLessonsByUnit(unitMeta.id).map((lessonDef, idx) => {
      // Generate a numeric ID based on unit and order for compatibility
      const numericId = unitMeta.id * 100 + idx;

      return {
        id: numericId,
        key: lessonDef.key,
        title: lessonDef.title,
        type: lessonDef.type,
        completed: false,
        progress: 0,
        locked: false, // Will be computed below
        current: false, // Will be computed below
        ...lessonDef.payload,
      } as Lesson & { key: string };
    });

    return {
      id: unitMeta.id,
      title: unitMeta.title,
      description: unitMeta.description,
      color: unitMeta.color,
      lessons,
      progress: 0,
    } as LearningUnitType;
  });

  // Apply locking rules (default: lock everything except first lesson of first unit)
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    // Lock whole unit if it's not the first one
    const unitLocked = i > 0;
    if (unitLocked) {
      (unit as any).locked = true;
      unit.lessons = unit.lessons.map((ls) => ({ ...ls, locked: true }));
      continue;
    }

    // Within first unit: lock all except first lesson
    unit.lessons = unit.lessons.map((ls, idx) => {
      return { ...ls, locked: idx > 0 } as Lesson;
    });

    // Mark first lesson as current
    if (unit.lessons.length > 0) {
      unit.lessons[0].current = true;
    }
  }

  return units;
}

/**
 * Complete a lesson and award XP
 * @param lessonKey - The lesson key (e.g., 'huruf_a_e')
 */
export async function completeLesson(lessonKey: string): Promise<void> {
  const lesson = getLessonByKey(lessonKey);
  if (!lesson) {
    throw new Error(`Invalid lesson key: ${lessonKey}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Mark lesson as completed in user_lessons
  const { error } = await supabase.from('user_lessons').upsert(
    {
      user_id: user.id,
      lesson_key: lessonKey,
      status: 'completed',
      progress: 100,
      completed_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,lesson_key',
    }
  );

  if (error) throw error;

  // Award XP using existing function
  const { awardProgress } = await import('@/utils/supabase/profile');
  await awardProgress({
    xpDelta: lesson.xp,
    lessonsDelta: 1,
  });
}

/**
 * Get XP reward for a lesson by key
 */
export function getLessonReward(lessonKey: string): number {
  const lesson = getLessonByKey(lessonKey);
  return lesson?.xp || 0;
}

/**
 * Check if user has completed a lesson
 */
export async function isLessonCompleted(lessonKey: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('user_lessons')
    .select('status')
    .eq('user_id', user.id)
    .eq('lesson_key', lessonKey)
    .maybeSingle();

  if (error) {
    console.error('Error checking lesson completion:', error);
    return false;
  }

  return data?.status === 'completed';
}

/**
 * Update lesson progress (for partial completion)
 */
export async function updateLessonProgress(
  lessonKey: string,
  progress: number
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.from('user_lessons').upsert(
    {
      user_id: user.id,
      lesson_key: lessonKey,
      status: progress >= 100 ? 'completed' : 'in_progress',
      progress: Math.min(100, Math.max(0, progress)),
      completed_at: progress >= 100 ? new Date().toISOString() : null,
    },
    {
      onConflict: 'user_id,lesson_key',
    }
  );

  if (error) throw error;
}

/**
 * Legacy function for backward compatibility
 * Derives lesson key from category and group params
 */
export function deriveLessonKey(
  category: 'huruf' | 'angka' | 'kata',
  groupParam: string
): string | null {
  const norm = (s: string) => s.trim().toLowerCase();
  const parts = groupParam.split(',').map(norm).filter(Boolean);
  if (!parts.length) return null;

  if (category === 'huruf') {
    const start = parts[0];
    const end = parts[parts.length - 1];
    if (start && end) return `huruf_${start}_${end}`;
  } else if (category === 'angka') {
    const start = parts[0];
    const end = parts[parts.length - 1];
    if (start && end) return `angka_${start}_${end}`;
  } else if (category === 'kata') {
    return null; // Not yet implemented
  }
  return null;
}

// Legacy exports for backward compatibility
export const fetchLessonRewardByKey = getLessonReward;
export const fetchLessonRewardById = (id: number) => {
  // For quiz page compatibility - just return default XP
  // In the new system, we don't use numeric IDs for lookups
  return 50;
};
export const completeLessonByKey = completeLesson;
export const completeLessonById = async (id: number) => {
  // For quiz page compatibility - this won't work with numeric IDs
  // Quiz page should be updated to use keys instead
  throw new Error(
    'completeLessonById is deprecated. Use completeLesson(key) instead.'
  );
};
export const fetchUserLessonCompletedByKey = isLessonCompleted;
export const fetchUserLessonCompletedById = async (id: number) => {
  // For quiz page compatibility - always return false
  return false;
};

// For review page compatibility
export async function fetchLessonsWithProgress() {
  // This returns raw data for review page
  const progressMap = await fetchUserProgress();

  return LESSONS.map((lesson, idx) => {
    const progress = progressMap.get(lesson.key);
    return {
      id: lesson.unit * 100 + idx,
      key: lesson.key,
      title: lesson.title,
      unit: lesson.unit,
      type: lesson.type,
      payload: lesson.payload,
      order_index: lesson.order,
      xp_reward: lesson.xp,
      user_lessons: progress
        ? [
            {
              user_id: '', // Not needed for review
              status: progress.status,
              progress: progress.progress,
            },
          ]
        : null,
    };
  });
}
