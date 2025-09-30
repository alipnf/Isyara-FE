import { Trophy } from 'lucide-react';

export default function LeaderboardHeader() {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Leaderboard
        </h2>
      </div>
      <p className="text-sm sm:text-base text-muted-foreground px-4">
        Lihat peringkat pengguna terbaik berdasarkan XP yang dikumpulkan
      </p>
    </div>
  );
}

