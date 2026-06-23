'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '@/lib/types';
import { t, type Translations } from '@/lib/translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  tr: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'pashto',
  setLang: () => {},
  tr: t('pashto'),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('pashto');

  useEffect(() => {
    const stored = localStorage.getItem('qabala-lang') as Language | null;
    if (stored && ['dari', 'pashto', 'english'].includes(stored)) {
      setLangState(stored);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('qabala-lang', l);
  };

  const tr = t(lang);

  useEffect(() => {
    document.documentElement.dir = tr.dir;
    document.documentElement.lang = tr.lang;
  }, [tr.dir, tr.lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
