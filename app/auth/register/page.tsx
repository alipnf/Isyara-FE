'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { AuthLayout, AuthSeparator } from '@/components/auth/auth-layout';

function RegisterForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic di-nonaktifkan sementara; hanya UI
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

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama lengkap"
            required
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Daftar
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
