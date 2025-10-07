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
