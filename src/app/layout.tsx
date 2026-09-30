import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Amiri } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import { isLocale, SITE_URL } from '@/lib/locales';
import './globals.css';

const GA_ID = 'G-20298ZC24T';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-amiri-var',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'نمونه قباله',
    template: '%s',
  },
  description:
    'قباله آنلاین: نمونه قباله زمین، خانه، دکان و موتر برای چاپ و امضا در افغانستان. سند دولتی نیست.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'قباله',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const requested = headerList.get('x-locale') ?? 'ps';
  const lang = isLocale(requested) ? requested : 'ps';
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  return (
    <html lang={lang} dir={dir} className={amiri.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[#0A3D22] antialiased">
        <ServiceWorkerRegistrar />
        {children}
        {process.env.NODE_ENV === 'production' && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
