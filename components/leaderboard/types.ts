export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  streak: number;
  lessonsCompleted: number;
  isCurrentUser: boolean;
}

export interface StatsData {
  totalUsers: number;
  highestXp: number;
  averageXp: number;
}

