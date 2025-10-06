'use client';

import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { AuthLayout, AuthSeparator } from '@/components/auth/auth-layout';
import { useAuthStore } from '@/stores/authStore';

function RegisterForm() {
  const signUp = useAuthStore((state) => state.signUp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Daftar ke ISYARA"
      subtitle="Mulai belajar BISINDO dengan mudah"
      footerText="Sudah punya akun?"
      footerLinkText="Masuk di sini"
      footerLinkHref="/auth/login"
    >
      <GoogleSignInButton text="Daftar dengan Google" />

      <AuthSeparator />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
          Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi akun.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama lengkap"
            required
            disabled={loading}
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </Button>
      </form>
    </AuthLayout>
  );
}

// Loading fallback component for register page
function RegisterLoading() {
  return (
    <AuthLayout
      title="Daftar ke ISYARA"
      subtitle="Mulai belajar BISINDO dengan mudah"
      footerText="Sudah punya akun?"
      footerLinkText="Masuk di sini"
      footerLinkHref="/auth/login"
    >
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}
