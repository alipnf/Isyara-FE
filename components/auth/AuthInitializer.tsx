'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { getIsAdmin } from '@/utils/supabase/admin';

export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();
  // avoid Next.js hooks (usePathname/useSearchParams) to prevent suspense requirement

  // Initialize auth state on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle OAuth callback without requiring refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      (async () => {
        try {
          await supabase.auth.exchangeCodeForSession(window.location.href);
          // Clean URL (remove code param) to avoid re-exchange
          const url = new URL(window.location.href);
          url.searchParams.delete('code');
          window.history.replaceState({}, '', url.toString());
          // Route based on role
          const isAdmin = await getIsAdmin();
          router.replace(isAdmin ? '/admin' : '/learn');
        } catch (e) {
          // Leave as is if exchange fails; user can retry
        }
      })();
    }
  }, [router]);

  // If already authenticated and on root, redirect immediately based on role
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loading) return;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path !== '/') return;
    if (!user) return;
    (async () => {
      const isAdmin =
        (user.user_metadata as any)?.is_admin === true ||
        (user.user_metadata as any)?.role === 'admin' ||
        (await getIsAdmin());
      router.replace(isAdmin ? '/admin' : '/learn');
    })();
  }, [user, loading, router]);

  return null;
}
