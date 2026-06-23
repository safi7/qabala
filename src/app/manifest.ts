import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Qabala — Afghan Deed System',
    short_name: 'قباله',
    description: 'Generate and print official Afghan property deeds in Dari, Pashto, and English',
    start_url: '/',
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
