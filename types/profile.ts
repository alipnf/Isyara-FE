export interface UserData {
  name: string;
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalLessonsCompleted: number;
  joinDate: string;
  avatar: string | null;
}

export interface EditData {
  username: string;
}
