import { UserData } from './types';

interface ProfileStatsCardProps {
  userData: UserData;
}

export default function ProfileStatsCard({ userData }: ProfileStatsCardProps) {
  return (
    <div className="mt-6 sm:mt-8 pt-6 border-t">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
        Statistik Anda
      </h3>
      <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-muted-foreground">
              Level:
            </span>
            <span className="text-base sm:text-lg font-semibold text-foreground">
              {userData.level}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-muted-foreground">
              Total XP:
            </span>
            <span className="text-base sm:text-lg font-semibold text-foreground">
              {userData.xp}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-muted-foreground">
              Pelajaran Selesai:
            </span>
            <span className="text-base sm:text-lg font-semibold text-foreground">
              {userData.totalLessonsCompleted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

