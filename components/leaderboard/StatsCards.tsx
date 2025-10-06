import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Zap } from 'lucide-react';
import { StatsData } from '@type/leaderboard';

interface StatsCardsProps {
  stats: StatsData;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
      <Card>
        <CardContent className="p-4 sm:p-6 text-center">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
          <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            {stats.totalUsers}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Total Pengguna
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 sm:p-6 text-center">
          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2 sm:mb-3" />
          <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            {stats.highestXp.toLocaleString()}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            XP Tertinggi
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 sm:p-6 text-center">
          <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mx-auto mb-2 sm:mb-3" />
          <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            {stats.averageXp.toLocaleString()}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Rata-rata XP
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
