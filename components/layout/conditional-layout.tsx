'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Hide navbar and footer on auth pages
  const isAuthPage = pathname.startsWith('/auth/');

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? 'md:ml-64' : ''}>
        {children}
        {!isAuthPage && <Footer />}
      </main>
    </>
  );
}
