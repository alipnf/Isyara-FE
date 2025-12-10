import { supabase } from '@/utils/supabase/client';
import type { LeaderboardUser, StatsData } from '@type/leaderboard';

function initials(input: string | null | undefined) {
  const s = (input || '').trim();
  if (!s) return 'U';
  const parts = s.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export async function fetchLeaderboard(limit = 50): Promise<LeaderboardUser[]> {
  const { data, error } = await supabase.rpc('get_leaderboard', {
    p_limit: limit,
  });

  if (error) throw error;

  const top = (data || []).map((row: any, idx: number) => ({
    rank: row.rank,
    name: row.full_name || 'Pengguna',
    xp: row.xp ?? 0,
    level: row.level ?? 1,
    avatar: initials(row.full_name),
    streak: 0,
    lessonsCompleted: row.total_lessons_completed ?? 0,
    isCurrentUser: false,
    // Keep internal id for identifying current user later (not in type)
    _id: row.user_id,
  })) as (LeaderboardUser & { _id: string })[];

  // Mark current user if present in top 5
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    for (const u of top) {
      if (u._id === user.id) {
        (u as any).isCurrentUser = true;
        break;
      }
    }
  }

  // Strip _id before returning
  return top.map(({ _id, ...rest }) => rest);
}

export async function fetchCurrentUserRank(): Promise<LeaderboardUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, level, xp, total_lessons_completed')
    .eq('id', user.id)
    .single();
  if (error) throw error;
  if (!data) return null;

  const userXp = data.xp ?? 0;
  const { count, error: countErr } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .gt('xp', userXp);
  if (countErr) throw countErr;

  const rank = (count ?? 0) + 1;
  const mapped: LeaderboardUser = {
    rank,
    name: data.full_name || 'Pengguna',
    xp: data.xp ?? 0,
    level: data.level ?? 1,
    avatar: initials(data.full_name),
    streak: 0,
    lessonsCompleted: data.total_lessons_completed ?? 0,
    isCurrentUser: true,
  };
  return mapped;
}

export async function fetchLeaderboardStats(): Promise<StatsData> {
  // totalUsers
  const { count, error: countErr } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true });
  if (countErr) throw countErr;

  // highestXp
  const { data: highRow, error: highErr } = await supabase
    .from('users')
    .select('xp')
    .order('xp', { ascending: false })
    .limit(1)
    .single();
  if (highErr) throw highErr;

  // averageXp (simple client average)
  const { data: allXp, error: avgErr } = await supabase
    .from('users')
    .select('xp');
  if (avgErr) throw avgErr;
  const arr = (allXp || []).map((r: any) => Number(r.xp ?? 0));
  const sum = arr.reduce((a, b) => a + b, 0);
  const avg = arr.length ? Math.round(sum / arr.length) : 0;

  return {
    totalUsers: count ?? 0,
    highestXp: (highRow?.xp as number) ?? 0,
    averageXp: avg,
  };
}
