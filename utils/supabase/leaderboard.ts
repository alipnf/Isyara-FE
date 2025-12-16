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

  const { data, error } = await supabase.rpc('get_user_rank', {
    p_user_id: user.id,
  });

  if (error) throw error;
  // data is an array because RPC returns TABLE, but we expect one row for specific user
  const row = (data as any)?.[0];
  if (!row) return null;

  const mapped: LeaderboardUser = {
    rank: Number(row.rank),
    name: row.full_name || 'Pengguna',
    xp: row.xp ?? 0,
    level: row.level ?? 1,
    avatar: initials(row.full_name),
    streak: 0,
    lessonsCompleted: row.total_lessons_completed ?? 0,
    isCurrentUser: true,
  };
  return mapped;
}

export async function fetchLeaderboardStats(): Promise<StatsData> {
  const { data, error } = await supabase.rpc('get_leaderboard_stats');
  if (error) throw error;

  const stats = (data as any)?.[0] || {};

  return {
    totalUsers: stats.total_users ?? 0,
    highestXp: stats.highest_xp ?? 0,
    averageXp: stats.average_xp ?? 0,
  };
}
