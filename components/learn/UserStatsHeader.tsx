'use client';

import { UserStats } from '@type/learn';
import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';

interface UserStatsHeaderProps {
  stats: UserStats;
}

export function UserStatsHeader({ stats }: UserStatsHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const username =
    user?.user_metadata?.username ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Pengguna';
  const avatarUrl = user?.user_metadata?.avatar_url || '/favicon.ico';

  return (
    <div className="w-full bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 flex-shrink-0">
          <Image
            src={avatarUrl}
            alt="User Avatar"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Selamat Datang, {username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lanjutkan perjalanan belajarmu.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
            <span className="material-symbols-outlined filled text-yellow-500">
              military_tech
            </span>
            <span>{stats.level}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
        </div>
        <div className="w-px h-10 bg-gray-300 dark:bg-white/20"></div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-orange-500 dark:text-orange-400">
            <span className="material-symbols-outlined filled text-orange-500">
              local_fire_department
            </span>
            <span>{stats.xp}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">XP</p>
        </div>
      </div>
    </div>
  );
}
