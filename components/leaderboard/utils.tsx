import { Crown, Medal } from 'lucide-react';

export const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return (
        <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
      );
  }
};

export const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/10 to-amber-700/10 border-amber-600/30';
    default:
      return '';
  }
};
