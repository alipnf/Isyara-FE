'use client';

import { useEffect, useState } from 'react';
import {
  LeaderboardHeader,
  CurrentUserStatsCard,
  TopPodium,
  LeaderboardList,
  StatsCards,
  LeaderboardActions,
} from '@/components/leaderboard';
import type { LeaderboardUser, StatsData } from '@type/leaderboard';
import {
  fetchTop5Users,
  fetchCurrentUserRank,
  fetchLeaderboardStats,
} from '@/utils/supabase/leaderboard';
import { Spinner } from '@/components/ui/spinner';

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [top5, setTop5] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    highestXp: 0,
    averageXp: 0,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [t5, cu, st] = await Promise.all([
          fetchTop5Users(),
          fetchCurrentUserRank(),
          fetchLeaderboardStats(),
        ]);
        if (!mounted) return;
        setTop5(t5);
        setCurrentUser(cu);
        setStats(st);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Gagal memuat leaderboard');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <LeaderboardHeader />

        {loading && (
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Spinner className="h-4 w-4" /> Memuat leaderboard...
          </div>
        )}
        {!loading && error && (
          <div className="text-sm text-destructive mb-4">{error}</div>
        )}

        {!loading && currentUser && <CurrentUserStatsCard user={currentUser} />}

        {!loading && top5.length > 0 && <TopPodium users={top5} />}

        {!loading && top5.length > 0 && <LeaderboardList users={top5} />}

        {!loading && <StatsCards stats={stats} />}

        <LeaderboardActions />
      </div>
    </div>
  );
}
