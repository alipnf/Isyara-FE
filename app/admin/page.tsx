'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle, BarChart3, Type } from 'lucide-react';
import {
  fetchAllLessonDefs,
  getIsAdmin,
  AdminLessonDef,
} from '@/utils/supabase/admin';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminLessonDef[]>([]);

  const units = useMemo(() => {
    const s = new Set<number>();
    rows.forEach((r) => s.add(r.unit));
    return Array.from(s).sort((a, b) => a - b);
  }, [rows]);

  const stats = useMemo(() => {
    const total = rows.length;
    const lessons = rows.filter((r) => r.type === 'lesson').length;
    const quizzes = rows.filter((r) => r.type === 'quiz').length;
    const unitCount = units.length;
    return { total, lessons, quizzes, unitCount };
  }, [rows, units]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push('/');
          return;
        }
        const admin = await getIsAdmin();
        if (!mounted) return;
        setIsAdmin(admin);
        if (!admin) {
          setLoading(false);
          return;
        }
        const data = await fetchAllLessonDefs();
        if (!mounted) return;
        setRows(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Gagal memuat data admin');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading && rows.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        <Spinner className="h-5 w-5 mr-2" /> Memuat...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Akses ditolak.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button asChild>
          <Link href="/admin/lessons">Kelola Lessons</Link>
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertTriangle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Total Items</div>
                <div className="text-xl font-bold">{stats.total}</div>
              </div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Lessons</div>
                <div className="text-xl font-bold">{stats.lessons}</div>
              </div>
              <Type className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Quizzes</div>
                <div className="text-xl font-bold">{stats.quizzes}</div>
              </div>
              <Type className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Units</div>
                <div className="text-xl font-bold">{stats.unitCount}</div>
              </div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Kelola konten pelajaran di menu "Lessons". Anda dapat menambah,
          mengubah, menghapus lesson, mengatur urutan, dan menetapkan XP reward.
        </CardContent>
      </Card>
    </div>
  );
}
