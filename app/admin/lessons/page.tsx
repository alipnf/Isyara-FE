'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Plus,
  Save,
  Trash2,
  RotateCcw,
  Filter,
  Search,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  AdminLessonDef,
  fetchAllLessonDefs,
  adminUpsertLessonDef,
  adminDeleteLessonDefById,
  getIsAdmin,
} from '@/utils/supabase/admin';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type PayloadCategory = 'huruf' | 'angka' | 'kata' | 'custom';

export default function AdminLessonsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminLessonDef[]>([]);
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'lesson' | 'quiz'>(
    'all'
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminLessonDef | null>(null);

  const [form, setForm] = useState({
    id: null as number | null,
    key: '',
    title: '',
    unit: 1,
    type: 'lesson' as 'lesson' | 'quiz',
    order_index: 1,
    xp_reward: 50,
    payloadCategory: 'huruf' as PayloadCategory,
    payloadItems: '',
    payloadRaw: '{}',
  });

  const payloadPreview = useMemo(() => {
    try {
      if (form.payloadCategory === 'custom') {
        return JSON.parse(form.payloadRaw || '{}');
      }
      const list = form.payloadItems
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (form.payloadCategory === 'huruf') return { hurufRange: list };
      if (form.payloadCategory === 'angka') return { numberRange: list };
      if (form.payloadCategory === 'kata') return { wordGroup: list };
    } catch (_) {}
    return {};
  }, [form.payloadCategory, form.payloadItems, form.payloadRaw]);

  const units = useMemo(() => {
    const s = new Set<number>();
    rows.forEach((r) => s.add(r.unit));
    return Array.from(s).sort((a, b) => a - b);
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (filterUnit !== 'all' && r.unit !== filterUnit) return false;
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !(
            r.key.toLowerCase().includes(q) ||
            r.title.toLowerCase().includes(q) ||
            String(r.unit).includes(q)
          )
        )
          return false;
      }
      return true;
    });
  }, [rows, filterUnit, filterType, search]);

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

  const resetForm = () =>
    setForm({
      id: null,
      key: '',
      title: '',
      unit: 1,
      type: 'lesson',
      order_index: 1,
      xp_reward: 50,
      payloadCategory: 'huruf',
      payloadItems: '',
      payloadRaw: '{}',
    });

  const handleEdit = (row: AdminLessonDef) => {
    let payloadCategory: PayloadCategory = 'custom';
    let payloadItems = '';
    const p = row.payload || {};
    if (Array.isArray(p.hurufRange)) {
      payloadCategory = 'huruf';
      payloadItems = p.hurufRange.join(',');
    } else if (Array.isArray(p.numberRange)) {
      payloadCategory = 'angka';
      payloadItems = p.numberRange.join(',');
    } else if (Array.isArray(p.wordGroup)) {
      payloadCategory = 'kata';
      payloadItems = p.wordGroup.join(',');
    } else {
      payloadCategory = 'custom';
    }
    setForm({
      id: row.id,
      key: row.key,
      title: row.title,
      unit: row.unit,
      type: row.type,
      order_index: row.order_index,
      xp_reward: row.xp_reward,
      payloadCategory,
      payloadItems,
      payloadRaw: JSON.stringify(row.payload || {}, null, 2),
    });
  };

  const [deleteOpenLocal, setDeleteOpenLocal] = useState(false);
  useEffect(() => setDeleteOpenLocal(deleteOpen), [deleteOpen]);

  const doDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    setError(null);
    try {
      await adminDeleteLessonDefById(deleteTarget.id);
      const data = await fetchAllLessonDefs();
      setRows(data);
      resetForm();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (e: any) {
      setError(e?.message || 'Gagal menghapus lesson');
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-2xl font-bold">Lessons</h2>
        <Button variant="outline" onClick={() => resetForm()}>
          <RotateCcw className="h-4 w-4 mr-2" /> Reset Form
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertTriangle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit Lesson' : 'Tambah Lesson'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError(null);
                try {
                  await adminUpsertLessonDef({
                    id: form.id ?? null,
                    key: form.key,
                    title: form.title,
                    unit: Number(form.unit),
                    type: form.type,
                    order_index: Number(form.order_index),
                    xp_reward: Number(form.xp_reward),
                    payload: payloadPreview,
                  });
                  const data = await fetchAllLessonDefs();
                  setRows(data);
                  resetForm();
                } catch (e: any) {
                  setError(
                    (e?.message || 'Gagal menyimpan').replace(
                      /admin_upsert_lesson_def|rpc/i,
                      ''
                    )
                  );
                } finally {
                  setLoading(false);
                }
              }}
              className="grid sm:grid-cols-2 gap-4"
            >
              <div>
                <Label>Key</Label>
                <Input
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  placeholder="huruf_a_e"
                  required
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Huruf A-E"
                  required
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Input
                  type="number"
                  value={form.unit}
                  onChange={(e) =>
                    setForm({ ...form, unit: Number(e.target.value) })
                  }
                  min={1}
                  required
                />
              </div>
              <div>
                <Label>Tipe</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as any })
                  }
                >
                  <option value="lesson">lesson</option>
                  <option value="quiz">quiz</option>
                </select>
              </div>
              <div>
                <Label>Order Index</Label>
                <Input
                  type="number"
                  value={form.order_index}
                  onChange={(e) =>
                    setForm({ ...form, order_index: Number(e.target.value) })
                  }
                  min={0}
                  required
                />
              </div>
              <div>
                <Label>XP Reward</Label>
                <Input
                  type="number"
                  value={form.xp_reward}
                  onChange={(e) =>
                    setForm({ ...form, xp_reward: Number(e.target.value) })
                  }
                  min={0}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Payload Category</Label>
                <div className="flex gap-2 mt-1">
                  {(
                    ['huruf', 'angka', 'kata', 'custom'] as PayloadCategory[]
                  ).map((c) => (
                    <Button
                      key={c}
                      type="button"
                      variant={
                        form.payloadCategory === c ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setForm({ ...form, payloadCategory: c })}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>

              {form.payloadCategory === 'custom' ? (
                <div className="sm:col-span-2">
                  <Label>Payload (JSON)</Label>
                  <Textarea
                    className="font-mono text-xs"
                    rows={6}
                    value={form.payloadRaw}
                    onChange={(e) =>
                      setForm({ ...form, payloadRaw: e.target.value })
                    }
                  />
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <Label>
                    Items (pisahkan dengan koma) — akan disimpan ke{' '}
                    {form.payloadCategory === 'huruf'
                      ? 'hurufRange'
                      : form.payloadCategory === 'angka'
                        ? 'numberRange'
                        : 'wordGroup'}
                  </Label>
                  <Input
                    placeholder={
                      form.payloadCategory === 'huruf'
                        ? 'A,B,C,D,E'
                        : form.payloadCategory === 'angka'
                          ? '0,1,2,3,4'
                          : 'HALO,TERIMA KASIH,MAAF'
                    }
                    value={form.payloadItems}
                    onChange={(e) =>
                      setForm({ ...form, payloadItems: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="sm:col-span-2 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Preview payload: {JSON.stringify(payloadPreview)}
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" /> Simpan
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" /> Baru
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between mb-3">
              <div className="flex gap-2 items-center flex-1">
                <div className="relative flex-1 min-w-[160px]">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari title/key/unit..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={filterUnit}
                    onChange={(e) =>
                      setFilterUnit(
                        e.target.value === 'all'
                          ? 'all'
                          : Number(e.target.value)
                      )
                    }
                  >
                    <option value="all">All Units</option>
                    {units.map((u) => (
                      <option key={u} value={u}>
                        Unit {u}
                      </option>
                    ))}
                  </select>
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                  >
                    <option value="all">All Types</option>
                    <option value="lesson">Lesson</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {filteredRows.length} item ditampilkan
              </div>
            </div>

            <div className="overflow-x-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="py-2 px-3">Unit</th>
                    <th className="py-2 px-3">Order</th>
                    <th className="py-2 px-3">Tipe</th>
                    <th className="py-2 px-3">Key</th>
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">XP</th>
                    <th className="py-2 px-3">Payload</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => {
                    const p = r.payload || {};
                    let tag = '-';
                    if (Array.isArray(p.hurufRange)) tag = 'hurufRange';
                    else if (Array.isArray(p.numberRange)) tag = 'numberRange';
                    else if (Array.isArray(p.wordGroup)) tag = 'wordGroup';
                    return (
                      <tr key={r.id} className="border-t hover:bg-muted/20">
                        <td className="py-2 px-3">{r.unit}</td>
                        <td className="py-2 px-3">{r.order_index}</td>
                        <td className="py-2 px-3">
                          <Badge
                            variant={
                              r.type === 'lesson' ? 'secondary' : 'outline'
                            }
                          >
                            {r.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 font-mono text-xs">{r.key}</td>
                        <td className="py-2 px-3">{r.title}</td>
                        <td className="py-2 px-3">{r.xp_reward}</td>
                        <td className="py-2 px-3">
                          <Badge variant="outline" className="text-foreground">
                            {tag}
                          </Badge>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(r)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setDeleteTarget(r);
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Lesson "{deleteTarget?.title}
              " akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={doDelete}
              className="bg-destructive text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
