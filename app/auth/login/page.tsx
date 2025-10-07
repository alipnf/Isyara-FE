'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { AuthLayout, AuthSeparator } from '@/components/auth/auth-layout';
import { useAuthStore } from '@/stores/authStore';
import { useForm } from 'react-hook-form';

type LoginInputs = {
  email: string;
  password: string;
};

function LoginForm() {
  const signIn = useAuthStore((state) => state.signIn);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setLoading(true);
    setServerError(null);
    setSuccess(false);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('invalid login')) {
          setError('password', {
            type: 'server',
            message: 'Email atau kata sandi salah',
          });
        } else if (msg.includes('confirm')) {
          setError('email', {
            type: 'server',
            message: 'Email belum terverifikasi. Silakan cek email.',
          });
        } else {
          setServerError(error.message);
        }
      } else {
        setSuccess(true);
        router.push('/learn');
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

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {serverError}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            Berhasil masuk. Mengarahkan...
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Spinner className="mr-2" />}
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
