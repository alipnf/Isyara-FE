'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { AuthLayout, AuthSeparator } from '@/components/auth/auth-layout';

function LoginForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic di-nonaktifkan sementara; hanya UI
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

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@contoh.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <Button type="submit" className="w-full">
          Masuk
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
