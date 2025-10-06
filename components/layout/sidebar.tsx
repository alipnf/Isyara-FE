'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, RefreshCcw, Trophy, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Sidebar() {
  const pathname = usePathname();

  // Simulate authentication state (replace with actual auth logic)
  const isAuthenticated = true;

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
    {
      name: 'Profil',
      href: '/profile',
      icon: User,
    },
  ];

  const navigationItems = isAuthenticated
    ? authenticatedItems
    : unauthenticatedItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:left-0 bg-background border-r z-50">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Isyara</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isUnauthenticatedButton =
              !isAuthenticated && item.name === 'Mulai Belajar';
            return (
              <div key={item.name} className="mb-4">
                <Link href={item.href}>
                  <Button
                    variant={
                      isActive || isUnauthenticatedButton ? 'default' : 'ghost'
                    }
                    className={`w-full justify-start h-14 text-base ${
                      isActive || isUnauthenticatedButton
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </Button>
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-background border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">Isyara</span>
            </Link>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" color="black" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
