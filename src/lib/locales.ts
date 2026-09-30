import type { DocType, Language } from './types';

export const SITE_URL = 'https://qabala.angyza.com';

export const LOCALES = ['ps', 'fa', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DOC_TYPES: DocType[] = ['land', 'house', 'shop', 'vehicle', 'garden'];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isDocType(value: string): value is DocType {
  return (DOC_TYPES as readonly string[]).includes(value);
}

export function localeToLanguage(locale: Locale): Language {
  if (locale === 'ps') return 'pashto';
  if (locale === 'fa') return 'dari';
  return 'english';
}

export function languageToLocale(lang: Language): Locale {
  if (lang === 'pashto') return 'ps';
  if (lang === 'dari') return 'fa';
  return 'en';
}

export function withLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0 || !isLocale(segments[0])) {
    segments.unshift(locale);
  } else {
    segments[0] = locale;
  }
  return `/${segments.join('/')}`;
}
