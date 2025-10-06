'use client';

import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { AuthLayout, AuthSeparator } from '@/components/auth/auth-layout';
import { useAuthStore } from '@/stores/authStore';

function LoginForm() {
  const signIn = useAuthStore((state) => state.signIn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Masuk ke ISYARA"
      subtitle="Belajar Bahasa Isyarat Indonesia dengan mudah"
      footerText="Belum punya akun?"
      footerLinkText="Daftar di sini"
      footerLinkHref="/auth/register"
    >
      <GoogleSignInButton text="Masuk dengan Google" />

      <AuthSeparator />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@contoh.com"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>
    </AuthLayout>
  );
}

// Loading fallback component for login page
function LoginLoading() {
  return (
    <AuthLayout
      title="Masuk ke ISYARA"
      subtitle="Belajar Bahasa Isyarat Indonesia dengan mudah"
      footerText="Belum punya akun?"
      footerLinkText="Daftar di sini"
      footerLinkHref="/auth/register"
    >
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
