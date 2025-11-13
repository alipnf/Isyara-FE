'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

function CallbackInner() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } catch {}
      // Clean URL to remove sensitive params
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      window.history.replaceState({}, '', url.toString());

      // Redirect to learn page after successful authentication
      router.replace('/learn');
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Mengautentikasi...
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
      <CallbackInner />
    </Suspense>
  );
}
