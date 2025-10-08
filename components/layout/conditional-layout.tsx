'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { AdminLayout } from './admin-layout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Hide navbar and footer on auth pages, lesson page, and quiz page
  const isAuthPage = pathname.startsWith('/auth/');
  const isLessonPage = pathname.startsWith('/lesson');
  const isQuizPage = pathname.startsWith('/quiz');
  const isAdminPage = pathname.startsWith('/admin');
  const shouldHideLayout = isAuthPage || isLessonPage || isQuizPage;

  return (
    <>
      {isAdminPage ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <>
          {!shouldHideLayout && <Navbar />}
          <main>
            {children}
            {!shouldHideLayout && <Footer />}
          </main>
        </>
      )}
    </>
  );
}
