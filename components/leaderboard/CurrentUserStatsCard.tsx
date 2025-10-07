import { Card, CardContent } from '@/components/ui/card';
import { LeaderboardUser } from '@type/leaderboard';

interface CurrentUserStatsCardProps {
  user: LeaderboardUser;
}

export default function CurrentUserStatsCard({
  user,
}: CurrentUserStatsCardProps) {
  return (
    <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">
                {user.avatar}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-lg truncate max-w-[200px] sm:max-w-[260px]">
                {user.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                #{user.rank}
              </div>
              <p className="text-xs text-muted-foreground">Peringkat</p>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {user.xp}
              </div>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {user.level}
              </div>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
