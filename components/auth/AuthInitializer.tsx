'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

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
          // Redirect to learn page after successful OAuth
          router.replace('/learn');
        } catch (e) {
          // Leave as is if exchange fails; user can retry
        }
      })();
    }
  }, [router]);

  // If already authenticated and on root, redirect immediately to learn page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loading) return;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path !== '/') return;
    if (!user) return;
    router.replace('/learn');
  }, [user, loading, router]);

  return null;
}
