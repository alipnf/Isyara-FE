'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function AdminSidebar() {
  const pathname = usePathname();
  const signOut = useAuthStore((s) => s.signOut);
  const items = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Lessons', href: '/admin/lessons', icon: BookOpen },
  ];
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r bg-background">
      <div className="h-16 flex items-center px-4 border-b text-xl font-bold">
        Isyara Admin
      </div>
      <nav className="p-3 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href;
          return (
            <Link key={it.name} href={it.href} className="block">
              <Button
                variant={active ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  active && 'bg-primary text-white'
                )}
              >
                <Icon className="h-4 w-4 mr-2" /> {it.name}
              </Button>
            </Link>
          );
        })}
        <div className="pt-2">
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" /> Keluar
          </Button>
        </div>
      </nav>
    </aside>
  );
}
