'use client';

import {
  LeaderboardHeader,
  CurrentUserStatsCard,
  TopPodium,
  LeaderboardList,
  StatsCards,
  LeaderboardActions,
  leaderboardData,
  statsData,
} from '@/components/leaderboard';

export default function LeaderboardPage() {
  const currentUser = leaderboardData.find((user) => user.isCurrentUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <LeaderboardHeader />

        {currentUser && <CurrentUserStatsCard user={currentUser} />}

        <TopPodium users={leaderboardData} />

        <LeaderboardList users={leaderboardData} />

        <StatsCards stats={statsData} />

        <LeaderboardActions />
      </div>
    </div>
  );
}
