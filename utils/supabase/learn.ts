import { supabase } from '@/utils/supabase/client';
import type { LearningUnit as LearningUnitType, Lesson } from '@type/learn';
import type { CategoryKey } from '@type/lesson';

type RawLessonRow = {
  id: number;
  key: string;
  title: string;
  unit: number;
  type: 'lesson' | 'quiz';
  payload: any;
  order_index: number;
  xp_reward: number;
  user_lessons?: { user_id: string; status: string; progress: number }[] | null;
};

export async function fetchLessonsWithProgress() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [] as RawLessonRow[];

  const { data, error } = await supabase
    .from('lesson_defs')
    .select(
      'id,key,title,unit,type,payload,order_index,xp_reward,' +
        'user_lessons!left(user_id,status,progress,completed_at)'
    )
    .order('unit', { ascending: true })
    .order('order_index', { ascending: true })
    .eq('user_lessons.user_id', user.id);

  if (error) throw error;
  return (data || []) as unknown as RawLessonRow[];
}

function getUnitMeta(unit: number) {
  if (unit === 1)
    return {
      title: 'Dasar-dasar BISINDO',
      description: 'Pelajari huruf A-Z dalam bahasa isyarat',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    };
  if (unit === 2)
    return {
      title: 'Angka & Bilangan',
      description: 'Belajar angka 0-9 dan bilangan dasar',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
    };
  return {
    title: `Unit ${unit}`,
    description: 'Materi pembelajaran lanjutan',
    color: 'bg-gradient-to-br from-slate-500 to-slate-600',
  };
}

export function buildUnits(rows: RawLessonRow[]): LearningUnitType[] {
  if (!rows?.length) return [];

  // group by unit and sort lessons by order_index
  const grouped = rows.reduce(
    (acc, r) => {
      (acc[r.unit] ||= []).push(r);
      return acc;
    },
    {} as Record<number, RawLessonRow[]>
  );

  const unitNumbers = Object.keys(grouped)
    .map((k) => Number(k))
    .sort((a, b) => a - b);

  // First pass: build units with lessons and progress
  const units = unitNumbers.map((u) => {
    const sorted = grouped[u]
      .slice()
      .sort((a, b) => a.order_index - b.order_index);
    const lessons: Lesson[] = sorted.map((l) => ({
      id: l.id,
      title: l.title,
      type: l.type,
      completed: (l.user_lessons?.[0]?.status ?? 'in_progress') === 'completed',
      progress: l.user_lessons?.[0]?.progress ?? 0,
      // locked/current computed later
      ...l.payload,
    }));

    const completedCount = lessons.filter((ls) => ls.completed).length;
    const progressPct = Math.round(
      (completedCount / Math.max(lessons.length, 1)) * 100
    );
    const meta = getUnitMeta(u);

    return {
      id: u,
      title: meta.title,
      description: meta.description,
      color: meta.color,
      lessons,
      progress: progressPct,
    } as LearningUnitType;
  });

  // Second pass: apply locking rules
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

export function deriveLessonKey(
  category: CategoryKey,
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
    // Not seeded in example
    return null;
  }
  return null;
}

export async function completeLessonByKey(key: string) {
  const { error } = await supabase.rpc('complete_lesson', {
    p_lesson_key: key,
  });
  if (error) throw error;
}

// Fetch xp reward for a lesson/quiz by its id
export async function fetchLessonRewardById(
  id: number
): Promise<number | null> {
  const { data, error } = await supabase
    .from('lesson_defs')
    .select('xp_reward')
    .eq('id', id)
    .single();
  if (error) throw error;
  return (data as any)?.xp_reward ?? null;
}

// Fetch xp reward by lesson key (e.g., 'huruf_k_o')
export async function fetchLessonRewardByKey(
  key: string
): Promise<number | null> {
  const { data, error } = await supabase
    .from('lesson_defs')
    .select('xp_reward')
    .eq('key', key)
    .single();
  if (error) throw error;
  return (data as any)?.xp_reward ?? null;
}

// Complete a lesson/quiz by its numeric id (lookup key then call RPC)
export async function completeLessonById(id: number) {
  const { data, error } = await supabase
    .from('lesson_defs')
    .select('key')
    .eq('id', id)
    .single();
  if (error) throw error;
  const key = (data as any)?.key as string | undefined;
  if (!key) throw new Error('Lesson key not found');
  const { error: rpcErr } = await supabase.rpc('complete_lesson', {
    p_lesson_key: key,
  });
  if (rpcErr) throw rpcErr;
}
