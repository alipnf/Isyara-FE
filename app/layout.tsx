import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Isyara — Belajar Bahasa Isyarat Indonesia (BISINDO)',
    template: '%s — Isyara',
  },
  description:
    'ISYARA adalah aplikasi web untuk belajar Bahasa Isyarat Indonesia (BISINDO) dengan latihan real‑time, progres, kuis, dan leaderboard.',
  applicationName: 'Isyara',
  keywords: [
    'Isyara',
    'BISINDO',
    'Bahasa Isyarat Indonesia',
    'Bahasa Isyarat',
    'isyarat tangan',
    'belajar isyarat',
    'kuis',
    'leaderboard',
  ],
  authors: [{ name: 'Isyara Team' }],
  creator: 'Isyara',
  publisher: 'Isyara',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Isyara',
    title: 'Isyara — Belajar Bahasa Isyarat Indonesia (BISINDO)',
    description:
      'Belajar BISINDO dengan deteksi tangan real‑time, progres, kuis, dan leaderboard.',
    locale: 'id_ID',
    images: ['/favicon.ico'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@',
    creator: '@',
    title: 'Isyara — Belajar Bahasa Isyarat Indonesia (BISINDO)',
    description:
      'Belajar BISINDO dengan deteksi tangan real‑time, progres, kuis, dan leaderboard.',
    images: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24
          }
        `}</style>
        {/* MediaPipe Scripts */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-display`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer />
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
