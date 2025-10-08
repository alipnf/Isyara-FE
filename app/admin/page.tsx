"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, Plus, Save, Trash2, RotateCcw } from "lucide-react";
import {
  AdminLessonDef,
  fetchAllLessonDefs,
  adminUpsertLessonDef,
  adminDeleteLessonDefById,
  getIsAdmin,
} from "@/utils/supabase/admin";
import { supabase } from "@/utils/supabase/client";

type PayloadCategory = "huruf" | "angka" | "kata" | "custom";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminLessonDef[]>([]);

  const [form, setForm] = useState({
    id: null as number | null,
    key: "",
    title: "",
    unit: 1,
    type: "lesson" as "lesson" | "quiz",
    order_index: 1,
    xp_reward: 50,
    payloadCategory: "huruf" as PayloadCategory,
    payloadItems: "", // comma-separated values for huruf/angka/kata
    payloadRaw: "{}",
  });

  const payloadPreview = useMemo(() => {
    try {
      if (form.payloadCategory === "custom") {
        return JSON.parse(form.payloadRaw || "{}");
      }
      const list = form.payloadItems
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (form.payloadCategory === "huruf") return { hurufRange: list };
      if (form.payloadCategory === "angka") return { numberRange: list };
      if (form.payloadCategory === "kata") return { wordGroup: list };
    } catch (_) {}
    return {};
  }, [form.payloadCategory, form.payloadItems, form.payloadRaw]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/");
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
        setError(e?.message || "Gagal memuat data admin");
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
      key: "",
      title: "",
      unit: 1,
      type: "lesson",
      order_index: 1,
      xp_reward: 50,
      payloadCategory: "huruf",
      payloadItems: "",
      payloadRaw: "{}",
    });

  const handleEdit = (row: AdminLessonDef) => {
    // Infer payload category
    let payloadCategory: PayloadCategory = "custom";
    let payloadItems = "";
    const p = row.payload || {};
    if (Array.isArray(p.hurufRange)) {
      payloadCategory = "huruf";
      payloadItems = p.hurufRange.join(",");
    } else if (Array.isArray(p.numberRange)) {
      payloadCategory = "angka";
      payloadItems = p.numberRange.join(",");
    } else if (Array.isArray(p.wordGroup)) {
      payloadCategory = "kata";
      payloadItems = p.wordGroup.join(",");
    } else {
      payloadCategory = "custom";
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

  const handleDelete = async (row: AdminLessonDef) => {
    if (!confirm(`Hapus lesson '${row.title}'?`)) return;
    setLoading(true);
    setError(null);
    try {
      await adminDeleteLessonDefById(row.id);
      const data = await fetchAllLessonDefs();
      setRows(data);
      resetForm();
    } catch (e: any) {
      setError(e?.message || "Gagal menghapus lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        (e?.message || "Gagal menyimpan").replace(
          /admin_upsert_lesson_def|rpc/i,
          ""
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && rows.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Spinner className="h-5 w-5 mr-2" /> Memuat...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Akses Ditolak</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Anda bukan admin. Hubungi administrator untuk mendapatkan akses.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin: Lesson Definitions</h2>
          <Button variant="outline" onClick={() => resetForm()}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset Form
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "Edit Lesson" : "Tambah Lesson"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
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
                  onChange={(e) => setForm({ ...form, unit: Number(e.target.value) })}
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
                  {(["huruf", "angka", "kata", "custom"] as PayloadCategory[]).map(
                    (c) => (
                      <Button
                        key={c}
                        type="button"
                        variant={form.payloadCategory === c ? "default" : "outline"}
                        size="sm"
                        onClick={() => setForm({ ...form, payloadCategory: c })}
                      >
                        {c}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {form.payloadCategory === "custom" ? (
                <div className="sm:col-span-2">
                  <Label>Payload (JSON)</Label>
                  <Textarea
                    className="font-mono text-xs"
                    rows={6}
                    value={form.payloadRaw}
                    onChange={(e) => setForm({ ...form, payloadRaw: e.target.value })}
                  />
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <Label>
                    Items (pisahkan dengan koma) — akan disimpan ke
                    {" "}
                    {form.payloadCategory === "huruf"
                      ? "hurufRange"
                      : form.payloadCategory === "angka"
                      ? "numberRange"
                      : "wordGroup"}
                  </Label>
                  <Input
                    placeholder={
                      form.payloadCategory === "huruf"
                        ? "A,B,C,D,E"
                        : form.payloadCategory === "angka"
                        ? "0,1,2,3,4"
                        : "HALO,TERIMA KASIH,MAAF"
                    }
                    value={form.payloadItems}
                    onChange={(e) => setForm({ ...form, payloadItems: e.target.value })}
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-2">Unit</th>
                    <th className="py-2 pr-2">Order</th>
                    <th className="py-2 pr-2">Tipe</th>
                    <th className="py-2 pr-2">Key</th>
                    <th className="py-2 pr-2">Title</th>
                    <th className="py-2 pr-2">XP</th>
                    <th className="py-2 pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-muted/30">
                      <td className="py-2 pr-2">{r.unit}</td>
                      <td className="py-2 pr-2">{r.order_index}</td>
                      <td className="py-2 pr-2 uppercase">{r.type}</td>
                      <td className="py-2 pr-2 font-mono text-xs">{r.key}</td>
                      <td className="py-2 pr-2">{r.title}</td>
                      <td className="py-2 pr-2">{r.xp_reward}</td>
                      <td className="py-2 pr-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(r)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

