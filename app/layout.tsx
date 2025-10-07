import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { AuthInitializer } from '@/components/auth/AuthInitializer';

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
