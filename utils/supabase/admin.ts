import { supabase } from '@/utils/supabase/client';

export type AdminLessonDef = {
  id: number;
  key: string;
  title: string;
  unit: number;
  type: 'lesson' | 'quiz';
  payload: any;
  order_index: number;
  xp_reward: number;
  created_at: string;
};

export async function fetchAllLessonDefs(): Promise<AdminLessonDef[]> {
  const { data, error } = await supabase
    .from('lesson_defs')
    .select('*')
    .order('unit', { ascending: true })
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as unknown as AdminLessonDef[];
}

// These RPCs require SQL setup in supabase.md (security definer + admin guard)
export async function adminUpsertLessonDef(input: {
  id?: number | null;
  key: string;
  title: string;
  unit: number;
  type: 'lesson' | 'quiz';
  payload: any;
  order_index: number;
  xp_reward: number;
}): Promise<void> {
  const { error } = await supabase.rpc('admin_upsert_lesson_def', {
    p_id: input.id ?? null,
    p_key: input.key,
    p_title: input.title,
    p_unit: input.unit,
    p_type: input.type,
    p_payload: input.payload,
    p_order_index: input.order_index,
    p_xp_reward: input.xp_reward,
  });
  if (error) throw error;
}

export async function adminDeleteLessonDefById(id: number): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_lesson_def', {
    p_id: id,
  });
  if (error) throw error;
}

export async function getIsAdmin(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const meta = user.user_metadata || {};
  if (meta.is_admin === true || meta.role === 'admin') return true;
  // Optional: also check users table if column exists
  try {
    const { data } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    if ((data as any)?.is_admin === true) return true;
  } catch {
    // ignore if column not present
  }
  return false;
}

