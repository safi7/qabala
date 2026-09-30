import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'نمونه قباله',
    short_name: 'قباله',
    description: 'نمونه قباله برای چاپ و امضا در افغانستان. سند دولتی نیست.',
    start_url: '/ps',
    display: 'standalone',
    background_color: '#0A3D22',
    theme_color: '#0A3D22',
    orientation: 'portrait',
    categories: ['utilities', 'productivity'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
