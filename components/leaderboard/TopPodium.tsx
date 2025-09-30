import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardUser } from './types';
import { getRankIcon, getRankColor } from './utils';

interface TopPodiumProps {
  users: LeaderboardUser[];
}

export default function TopPodium({ users }: TopPodiumProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-10 mb-8">
      {users.slice(0, 3).map((user, index) => (
        <Card
          key={user.rank}
          className={`text-center ${getRankColor(user.rank)} ${index === 0 ? 'order-2 sm:scale-110' : index === 1 ? 'order-1' : 'order-3'}`}
        >
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="mb-2 sm:mb-4">{getRankIcon(user.rank)}</div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">
                {user.avatar}
              </span>
            </div>
            <h3 className="font-bold text-foreground mb-1 text-xs sm:text-sm md:text-base">
              {user.name}
            </h3>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-1">
              {user.xp}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">XP</p>
            <Badge variant="outline" className="mt-1 sm:mt-2 text-xs">
              Level {user.level}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

