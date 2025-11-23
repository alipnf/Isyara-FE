import { fetchLessonsWithProgress } from '@/utils/supabase/learn';
import { supabase } from '@/utils/supabase/client';
import type { CategoryData, CategoryStatus } from '@type/review';

export type ReviewCategoryKey = 'huruf' | 'angka' | 'kata';

export type ReviewBuildResult = {
  categories: Partial<Record<ReviewCategoryKey, CategoryData>>;
  perLessonProgress: {
    lessons: Record<string, { completed: boolean; progress: number }>;
  };
  categoryStatus: Partial<Record<ReviewCategoryKey, CategoryStatus>>;
};

export async function fetchCategoryProgress(): Promise<
  Partial<
    Record<
      ReviewCategoryKey,
      { total: number; completed: number; progress: number; unlocked: boolean }
    >
  >
> {
  const { data, error } = await supabase.rpc('get_category_progress');
  if (error) throw error;
  const out: Partial<
    Record<
      ReviewCategoryKey,
      { total: number; completed: number; progress: number; unlocked: boolean }
    >
  > = {};
  for (const row of (data as any[]) || []) {
    const key = row.category as string as ReviewCategoryKey;
    if (key === 'huruf' || key === 'angka' || key === 'kata') {
      out[key] = {
        total: Number(row.total ?? 0),
        completed: Number(row.completed ?? 0),
        progress: Number(row.progress ?? 0),
        unlocked: !!row.unlocked,
      };
    }
  }
  return out;
}

export async function buildReviewData(): Promise<ReviewBuildResult> {
  const rows = await fetchLessonsWithProgress();

  const categories: Partial<Record<ReviewCategoryKey, CategoryData>> = {};
  const perLessonProgress: {
    lessons: Record<string, { completed: boolean; progress: number }>;
  } = {
    lessons: {},
  };
  const statusCounters: Record<
    ReviewCategoryKey,
    { total: number; completed: number }
  > = {
    huruf: { total: 0, completed: 0 },
    angka: { total: 0, completed: 0 },
    kata: { total: 0, completed: 0 },
  };

  // Helper to init a category
  function initCategory(key: ReviewCategoryKey) {
    if (!categories[key]) {
      categories[key] = {
        name: key === 'huruf' ? 'Huruf' : key === 'angka' ? 'Angka' : 'Kata',
        items: [],
        description:
          key === 'huruf'
            ? 'Alfabet BISINDO A-Z'
            : key === 'angka'
              ? 'Angka BISINDO 0-9'
              : 'Kata-kata dasar BISINDO',
        requiredLessons: [],
        requiredProgress: 100,
      } as CategoryData;
    }
  }

  for (const r of rows) {
    if (r.type !== 'lesson') continue;
    const payload = (r as any).payload || {};
    let key: ReviewCategoryKey | null = null;
    let items: string[] = [];

    if (Array.isArray(payload.hurufRange)) {
      key = 'huruf';
      items = payload.hurufRange as string[];
    } else if (Array.isArray(payload.numberRange)) {
      key = 'angka';
      items = payload.numberRange as string[];
    } else if (Array.isArray(payload.wordGroup)) {
      key = 'kata';
      items = payload.wordGroup as string[];
    }

    if (!key) continue;
    initCategory(key);

    // Aggregate items (unique)
    const target = categories[key]!;
    const set = new Set(target.items);
    for (const it of items) set.add(String(it));
    target.items = Array.from(set);

    // Required lessons list (use titles)
    if (!target.requiredLessons.includes((r as any).title)) {
      target.requiredLessons.push((r as any).title);
    }

    // Progress per lesson and counters
    const completed =
      ((r as any).user_lessons?.[0]?.status ?? 'in_progress') === 'completed';
    const progress = (r as any).user_lessons?.[0]?.progress ?? 0;
    perLessonProgress.lessons[(r as any).title] = { completed, progress };
    statusCounters[key].total += 1;
    if (completed) statusCounters[key].completed += 1;
  }

  // Prefer server-side category progress via RPC (gating), fallback to FE calculation
  let categoryStatus: Partial<Record<ReviewCategoryKey, CategoryStatus>> = {};
  try {
    const server = await fetchCategoryProgress();
    (Object.keys(categories) as ReviewCategoryKey[]).forEach((k) => {
      const sp = server[k];
      if (sp) {
        categoryStatus[k] = {
          unlocked: sp.unlocked,
          progress: sp.progress,
        } as CategoryStatus;
      }
    });
  } catch {
    (Object.keys(categories) as ReviewCategoryKey[]).forEach((k) => {
      const total = statusCounters[k].total || 0;
      const completed = statusCounters[k].completed || 0;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      categoryStatus[k] = {
        unlocked: progress >= 100,
        progress,
      } as CategoryStatus;
    });
  }

  return { categories, perLessonProgress, categoryStatus };
}
