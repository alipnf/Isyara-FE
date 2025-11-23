'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  UserStatsHeader,
  LearningUnit,
  getLessonRoute,
} from '@/components/learn';
import type { LearningUnit as LearningUnitType } from '@type/learn';
import {
  buildUnitsWithProgress,
  buildStaticUnits,
} from '@/utils/supabase/learn';
import { getMyUser } from '@/utils/supabase/profile';
import { Spinner } from '@/components/ui/spinner';

export default function LearnPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [units, setUnits] = useState<LearningUnitType[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const u = await getMyUser();
        if (!mounted) return;
        setXp(u?.xp ?? 0);
        setLevel(u?.level ?? 1);
        try {
          // Load units from static curriculum + user progress
          const built = await buildUnitsWithProgress();
          if (!mounted) return;
          setUnits(built.length ? built : buildStaticUnits());
        } catch (_e) {
          // If schema not ready, fallback to mock
          setUnits(buildStaticUnits());
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Gagal memuat data belajar');
        // Fallback to mock for UI continuity
        setUnits(buildStaticUnits());
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const userStats = useMemo(() => ({ xp, level }), [xp, level]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Background Blobs Removed */}

      <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <main className="py-12">
            {loading ? (
              <div className="flex items-center gap-3 text-muted-foreground mb-6">
                <Spinner className="h-4 w-4" /> Memuat data...
              </div>
            ) : error ? (
              <div className="text-sm text-destructive mb-4">{error}</div>
            ) : (
              <UserStatsHeader stats={userStats} />
            )}

            {/* Learning Path */}
            <div className="flex flex-col gap-8">
              {units.map((unit, unitIndex) => (
                <LearningUnit
                  key={unit.id}
                  unit={unit}
                  unitIndex={unitIndex}
                  getLessonRoute={getLessonRoute}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
