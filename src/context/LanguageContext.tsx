'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '@/lib/types';
import { languageToLocale, type Locale } from '@/lib/locales';
import { t, type Translations } from '@/lib/translations';

interface LanguageContextValue {
  lang: Language;
  locale: Locale;
  tr: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'pashto',
  locale: 'ps',
  tr: t('pashto'),
});

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Language;
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState(initialLang);
  if (lang !== initialLang) setLang(initialLang);

  const tr = t(lang);

  useEffect(() => {
    document.documentElement.dir = tr.dir;
    document.documentElement.lang = tr.lang;
  }, [tr.dir, tr.lang]);

  return (
    <LanguageContext.Provider value={{ lang, locale: languageToLocale(lang), tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
