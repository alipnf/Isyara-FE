'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Hide navbar and footer on auth pages and lesson page
  const isAuthPage = pathname.startsWith('/auth/');
  const isLessonPage = pathname.startsWith('/lesson');
  const shouldHideLayout = isAuthPage || isLessonPage;

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className={!shouldHideLayout ? 'md:ml-64' : ''}>
        {children}
        {!shouldHideLayout && <Footer />}
      </main>
    </>
  );
}
