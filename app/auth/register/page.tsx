'use client';

import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { AuthLayout, AuthSeparator } from '@/components/auth/auth-layout';
import { useAuthStore } from '@/stores/authStore';
import { useForm } from 'react-hook-form';

type RegisterInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterForm() {
  const signUp = useAuthStore((state) => state.signUp);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = handleSubmit(async ({ username, email, password }) => {
    setLoading(true);
    setServerError(null);
    setSuccess(false);
    try {
      const { error } = await signUp(email, password, username);
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('duplicate')) {
          setError('email', {
            type: 'server',
            message: 'Email sudah terdaftar',
          });
        } else {
          setServerError(error.message);
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setServerError(
        'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  });

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
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="nama"
            required
            disabled={loading}
            aria-invalid={!!errors.username}
            {...register('username', {
              required: 'Username wajib diisi',
              minLength: { value: 3, message: 'Minimal 3 karakter' },
              maxLength: { value: 20, message: 'Maksimal 20 karakter' },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Hanya huruf, angka, dan underscore (_)',
              },
            })}
          />
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@contoh.com"
            required
            disabled={loading}
            aria-invalid={!!errors.email}
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: {
                value:
                  /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/,
                message: 'Format email tidak valid',
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi</Label>
          <PasswordInput
            id="password"
            placeholder="******"
            required
            disabled={loading}
            aria-invalid={!!errors.password}
            {...register('password', {
              required: 'Kata sandi wajib diisi',
              minLength: {
                value: 6,
                message: 'Kata sandi minimal 6 karakter',
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="******"
            required
            disabled={loading}
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Konfirmasi kata sandi wajib diisi',
              validate: (value) =>
                value === watch('password') ||
                'Kata sandi dan konfirmasi tidak cocok',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {serverError}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi akun.
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Spinner className="mr-2" />}
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
