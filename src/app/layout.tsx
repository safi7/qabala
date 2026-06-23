import type { Metadata, Viewport } from 'next';
import { Amiri, Noto_Sans_Arabic } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import './globals.css';

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-amiri-var',
  display: 'swap',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-arabic-var',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'قباله — Qabala System',
  description: 'Generate official Afghan property and asset transfer deeds in Dari, Pashto, and English',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Qabala',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A3D22',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${amiri.variable} ${notoSansArabic.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#0A3D22] antialiased">
        <LanguageProvider>
          <ServiceWorkerRegistrar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
