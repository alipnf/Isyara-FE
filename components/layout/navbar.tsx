'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  GraduationCap,
  RefreshCcw,
  Trophy,
  User,
  Menu,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
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

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const signOut = useAuthStore((state) => state.signOut);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const isAuthenticated = !!user;

  const handleSignOut = async () => {
    await signOut();
  };

  // Navigation items for unauthenticated users
  const unauthenticatedItems = [
    {
      name: 'Mulai Belajar',
      href: '/auth/login',
      icon: GraduationCap,
    },
  ];

  // Navigation items for authenticated users
  const authenticatedItems = [
    {
      name: 'Belajar',
      href: '/learn',
      icon: GraduationCap,
    },
    {
      name: 'Review',
      href: '/review',
      icon: RefreshCcw,
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: Trophy,
    },
  ];

  const navigationItems = isAuthenticated
    ? authenticatedItems
    : unauthenticatedItems;

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Isyara</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            ) : (
              navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isUnauthenticatedButton =
                  !isAuthenticated && item.name === 'Mulai Belajar';
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={
                        isActive || isUnauthenticatedButton
                          ? 'default'
                          : 'ghost'
                      }
                      className={cn(
                        'flex items-center space-x-2',
                        isActive || isUnauthenticatedButton
                          ? 'bg-primary text-white'
                          : 'text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })
            )}

            {/* User Profile Dropdown */}
            {!loading && isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.user_metadata?.full_name || user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center space-x-2"
                    onSelect={(e) => {
                      e.preventDefault();
                      setLogoutOpen(true);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" disabled={loading}>
                  <Menu className="h-5 w-5" color="black" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {loading ? (
                  <DropdownMenuItem disabled>
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Loading...</span>
                    </div>
                  </DropdownMenuItem>
                ) : (
                  <>
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      const isUnauthenticatedButton =
                        !isAuthenticated && item.name === 'Mulai Belajar';
                      return (
                        <DropdownMenuItem asChild key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              'w-full flex items-center space-x-2',
                              isActive || isUnauthenticatedButton
                                ? 'text-primary bg-primary/10'
                                : 'text-foreground'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}

                    {/* Mobile Sign Out */}
                    {isAuthenticated && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="flex items-center space-x-2"
                          onSelect={(e) => {
                            e.preventDefault();
                            setLogoutOpen(true);
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Keluar</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Global Logout Alert Dialog */}
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
              className={cn(
                'bg-destructive text-white hover:bg-destructive/90'
              )}
            >
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
