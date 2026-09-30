import type { MetadataRoute } from 'next';
import { DOC_TYPES, LOCALES, SITE_URL } from '@/lib/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: {
        ps: `${SITE_URL}/ps`,
        fa: `${SITE_URL}/fa`,
        en: `${SITE_URL}/en`,
      },
    },
  }));

  for (const type of DOC_TYPES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/${type}`,
        changeFrequency: 'monthly',
        priority: type === 'land' || type === 'vehicle' ? 0.8 : 0.6,
        alternates: {
          languages: {
            ps: `${SITE_URL}/ps/${type}`,
            fa: `${SITE_URL}/fa/${type}`,
            en: `${SITE_URL}/en/${type}`,
          },
        },
      });
    }
  }

  return entries;
}
