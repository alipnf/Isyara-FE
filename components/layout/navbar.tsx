'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  GraduationCap,
  RefreshCcw,
  Trophy,
  User,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Beranda',
      href: '/',
      icon: Home,
    },
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

  return (
    <>
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">Planify</span>
            </Link>

            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`flex items-center space-x-2 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
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
                    return (
                      <DropdownMenuItem asChild key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'w-full flex items-center space-x-2',
                            isActive
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
        </div>
      </header>
    </>
  );
}
