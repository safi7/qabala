import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    const types = ['land', 'house', 'shop', 'vehicle', 'garden'];
    return [
      { source: '/', destination: '/ps', permanent: true },
      ...types.map((type) => ({
        source: `/${type}`,
        destination: `/ps/${type}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
