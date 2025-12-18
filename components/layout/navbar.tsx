'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const signOut = useAuthStore((state) => state.signOut);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = !!user;

  const handleSignOut = async () => {
    await signOut();
  };

  // Navigation items for unauthenticated users
  const unauthenticatedItems = [
    {
      name: 'Belajar',
      href: '#', // Placeholder as per design, or keep existing logic? Design has #. I'll keep existing logic if possible, but design says "Belajar", "Review", "Leaderboard" are visible even when logged out in the HTML?
      // Actually, the HTML shows "Belajar", "Review", "Leaderboard" in the nav, and "Log In", "Sign Up" buttons.
      // I will stick to the design's visual structure but keep the auth logic for the "Log In" / "Sign Up" buttons.
    },
  ];

  const navLinks = [
    { name: 'Belajar', href: '/learn' }, // mapped to real routes
    { name: 'Kilas Balik', href: '/review' },
    { name: 'Peringkat', href: '/leaderboard' },
    {
      name: 'Survei',
      href: 'https://forms.gle/Gb6HWz3hG7JXv8yQ7',
      external: true,
    },
  ];

  return (
    <div className="relative z-50 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="w-full max-w-5xl pointer-events-auto">
        <header className="sticky top-0 z-50 flex items-center justify-between py-4 mt-4 backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-gray-200/50 dark:border-white/10 rounded-full px-6 transition-all duration-300">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative size-8">
                <Image
                  src="/favicon.ico"
                  alt="Isyara Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Isyara
              </h2>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated &&
              navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-20 h-10 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center justify-center rounded-full h-10 w-10 overflow-hidden border border-gray-200 dark:border-white/10 hover:opacity-80 transition-opacity outline-none">
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={user?.user_metadata?.avatar_url}
                        alt={
                          user?.user_metadata?.username ||
                          user?.user_metadata?.name ||
                          'User'
                        }
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {(
                          user?.user_metadata?.username ||
                          user?.user_metadata?.name ||
                          user?.email ||
                          'U'
                        )
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setLogoutOpen(true);
                    }}
                  >
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray-200/80 dark:bg-white/10 text-gray-800 dark:text-white text-sm font-bold leading-normal tracking-wide hover:bg-gray-300/80 dark:hover:bg-white/20 transition-colors">
                    <span className="truncate">Masuk</span>
                  </button>
                </Link>
                <Link href="/auth/register" className="hidden sm:block">
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors">
                    <span className="truncate">Daftar</span>
                  </button>
                </Link>
              </>
            )}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-200/80 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-300/80 dark:hover:bg-white/20 transition-colors"
            >
              {mounted ? (
                <>
                  <Moon className="h-5 w-5 dark:hidden" />
                  <Sun className="h-5 w-5 hidden dark:block" />
                </>
              ) : (
                <div className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-200/80 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-300/80 dark:hover:bg-white/20 transition-colors">
                    <Menu className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  {isAuthenticated && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="w-full">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold truncate">
                              {user?.user_metadata?.username ||
                                user?.user_metadata?.name ||
                                user?.email}
                            </span>
                            <span className="text-xs text-muted-foreground font-normal">
                              Lihat Profil
                            </span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {isAuthenticated &&
                    navLinks.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          rel={
                            item.external ? 'noopener noreferrer' : undefined
                          }
                        >
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  {isAuthenticated && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setLogoutOpen(true);
                        }}
                        className="text-red-500 focus:text-red-500"
                      >
                        Keluar
                      </DropdownMenuItem>
                    </>
                  )}
                  {!isAuthenticated && (
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register">Daftar</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      </div>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin keluar dari akun?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
