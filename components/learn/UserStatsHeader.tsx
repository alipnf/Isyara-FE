import { Zap, Trophy } from 'lucide-react';
import { UserStats } from '@type/learn';

interface UserStatsHeaderProps {
  stats: UserStats;
}

export function UserStatsHeader({ stats }: UserStatsHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Selamat datang kembali!
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Lanjutkan perjalanan belajar BISINDO Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-sm border border-border">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-sm text-foreground">
              {stats.xp} XP
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-sm border border-border">
            <Trophy className="h-4 w-4 text-purple-500" />
            <span className="font-semibold text-sm text-foreground">
              Level {stats.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
