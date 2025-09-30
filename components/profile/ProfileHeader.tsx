import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';
import { UserData } from './types';

interface ProfileHeaderProps {
  userData: UserData;
  onEditClick: () => void;
}

export default function ProfileHeader({
  userData,
  onEditClick,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center">
          {userData.avatar ? (
            <img
              src={userData.avatar || '/placeholder.svg'}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl sm:text-4xl font-bold text-primary-foreground">
              {userData.name.charAt(0)}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
          {userData.name}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          @{userData.username}
        </p>
      </div>
      <div className="w-full sm:w-auto">
        <Button
          onClick={onEditClick}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profil
        </Button>
      </div>
    </div>
  );
}

