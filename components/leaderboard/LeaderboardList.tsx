import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { LeaderboardUser } from '@type/leaderboard';
import { getRankIcon } from './utils';

interface LeaderboardListProps {
  users: LeaderboardUser[];
}

export default function LeaderboardList({ users }: LeaderboardListProps) {
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          Semua Peringkat
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {users.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors ${
                user.isCurrentUser
                  ? 'bg-primary/5 border-l-4 border-primary'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="w-6 sm:w-8 flex justify-center">
                  {getRankIcon(user.rank)}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm sm:text-base">
                    {user.avatar}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                    <span className="font-semibold text-foreground text-sm sm:text-base truncate max-w-[140px] sm:max-w-[220px]">
                      {user.name}
                    </span>
                    {user.isCurrentUser && (
                      <span className="text-primary text-xs sm:text-sm flex-shrink-0">
                        (Anda)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>Level {user.level}</span>
                    <span className="hidden sm:inline">
                      {user.lessonsCompleted} pelajaran
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl font-bold text-primary">
                  {user.xp}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">XP</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
