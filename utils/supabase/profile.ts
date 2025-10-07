import { supabase } from '@/utils/supabase/client';

export type DbUser = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  level: number | null;
  xp: number | null;
  total_lessons_completed: number | null;
  created_at: string;
  updated_at: string;
};

export async function getMyUser(): Promise<DbUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data as DbUser;
}

export async function updateMyUser(patch: {
  username?: string;
  avatar_url?: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('users')
    .update({ ...patch })
    .eq('id', user.id);

  if (error) throw error;

  // Best-effort: keep auth.user.user_metadata in sync for navbar display
  if (patch.username || patch.avatar_url) {
    try {
      await supabase.auth.updateUser({
        data: { ...patch, username: patch.username },
      });
    } catch {
      // ignore non-fatal metadata sync errors
    }
  }
}

export function computeXpToNextLevel(level: number | null | undefined) {
  // Simple progression formula; adjust if backend defines differently
  const lvl = Math.max(1, Number(level ?? 1));
  return 500 * lvl; // e.g., 500, 1000, 1500, ...
}

export async function awardProgress({
  xpDelta = 0,
  lessonsDelta = 0,
}: {
  xpDelta?: number;
  lessonsDelta?: number;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) throw error;

  const currentLevel = Number((data as any)?.level ?? 1);
  let currentXp = Number((data as any)?.xp ?? 0);
  let level = isNaN(currentLevel) || currentLevel < 1 ? 1 : currentLevel;
  let xp = isNaN(currentXp) || currentXp < 0 ? 0 : currentXp;

  xp += xpDelta;

  // Level up while exceeding threshold; carry remainder XP forward
  let threshold = computeXpToNextLevel(level);
  while (xp >= threshold) {
    xp -= threshold;
    level += 1;
    threshold = computeXpToNextLevel(level);
  }

  const totalLessons = Number((data as any)?.total_lessons_completed ?? 0);
  const newTotalLessons = totalLessons + lessonsDelta;

  const { error: upErr } = await supabase
    .from('users')
    .update({
      level,
      xp,
      total_lessons_completed: newTotalLessons,
    })
    .eq('id', user.id);

  if (upErr) throw upErr;
}
