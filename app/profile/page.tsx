'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  ProfileHeader,
  LevelProgressCard,
  ProfileStatsCard,
  EditProfileForm,
} from '@/components/profile';
import type { UserData } from '@type/profile';
import { computeXpToNextLevel, getMyUser, updateMyUser } from '@/utils/profile';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from '@/components/ui/spinner';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbUser, setDbUser] = useState<{
    id: string;
    username: string | null;
    avatar_url: string | null;
    level: number | null;
    xp: number | null;
    total_lessons_completed: number | null;
    created_at: string;
    updated_at: string;
  } | null>(null);

  const user = useAuthStore((s) => s.user);

  const userData: UserData | null = useMemo(() => {
    if (!dbUser) return null;
    const level = dbUser.level ?? 1;
    const xp = dbUser.xp ?? 0;
    const xpToNextLevel = computeXpToNextLevel(level);

    const authMeta = (user?.user_metadata || {}) as any;
    const email = user?.email || '';
    const local = email.includes('@') ? email.split('@')[0] : email;

    const name =
      authMeta.full_name ||
      authMeta.name ||
      dbUser.username ||
      local ||
      'Pengguna';
    const username = dbUser.username || local || 'pengguna';
    const avatar =
      dbUser.avatar_url || authMeta.avatar_url || authMeta.picture || null;

    return {
      name,
      username,
      level,
      xp,
      xpToNextLevel,
      totalLessonsCompleted: dbUser.total_lessons_completed ?? 0,
      joinDate: dbUser.created_at,
      avatar,
    };
  }, [dbUser, user]);

  const [editData, setEditData] = useState({ username: '' });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyUser();
        if (!mounted) return;
        setDbUser(data);
        setEditData({ username: data?.username || '' });
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Gagal memuat profil');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    // Only load when authenticated
    if (user) load();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSaveProfile = async () => {
    if (!userData) return;
    setError(null);
    try {
      await updateMyUser({
        username: editData.username.trim() || null || undefined,
      });
      const fresh = await getMyUser();
      setDbUser(fresh);
      setIsEditing(false);
    } catch (e: any) {
      // Unique violation for username typically "23505"
      const msg = e?.code === '23505' ? 'Username sudah digunakan' : e?.message;
      setError(msg || 'Gagal menyimpan profil');
    }
  };

  const handleCancelEdit = () => {
    if (dbUser) setEditData({ username: dbUser.username || '' });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <Card>
          <CardContent className="p-4 sm:p-6 md:p-8">
            {loading && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Spinner className="h-4 w-4" /> Memuat profil...
              </div>
            )}

            {!loading && error && (
              <div className="text-sm text-destructive mb-4">{error}</div>
            )}

            {!loading && userData && !isEditing && (
              <>
                <ProfileHeader
                  userData={userData}
                  onEditClick={() => setIsEditing(true)}
                />

                <LevelProgressCard userData={userData} />

                <ProfileStatsCard userData={userData} />
              </>
            )}

            {!loading && userData && isEditing && (
              <EditProfileForm
                userData={userData}
                editData={editData}
                onEditDataChange={setEditData}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            )}

            {!loading && !userData && !error && (
              <div className="text-sm text-muted-foreground">
                Profil tidak ditemukan.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
