import { Progress } from '@/components/ui/progress';
import { UserData } from '@type/profile';

interface LevelProgressCardProps {
  userData: UserData;
}

export default function LevelProgressCard({
  userData,
}: LevelProgressCardProps) {
  const levelProgress = (userData.xp / userData.xpToNextLevel) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Level {userData.level}
        </span>
        <span className="text-sm text-muted-foreground">
          {userData.xp}/{userData.xpToNextLevel} XP
        </span>
      </div>
      <Progress value={levelProgress} className="h-3" />
      <p className="text-xs text-muted-foreground mt-1">
        {userData.xpToNextLevel - userData.xp} XP lagi untuk Level{' '}
        {userData.level + 1}
      </p>
    </div>
  );
}
