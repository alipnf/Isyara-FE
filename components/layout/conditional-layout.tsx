'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Hide navbar and footer on auth pages, lesson page, and quiz page
  const isAuthPage = pathname.startsWith('/auth/');
  const isLessonPage = pathname.startsWith('/lesson');
  const isQuizPage = pathname.startsWith('/quiz');
  const shouldHideLayout = isAuthPage || isLessonPage || isQuizPage;

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main>
        {children}
        {!shouldHideLayout && <Footer />}
      </main>
    </>
  );
}
