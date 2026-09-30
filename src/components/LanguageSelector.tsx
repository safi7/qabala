'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { withLocale, type Locale } from '@/lib/locales';

const LANGS: { id: Locale; label: string; native: string }[] = [
  { id: 'fa', label: 'Dari', native: 'دری' },
  { id: 'ps', label: 'Pashto', native: 'پښتو' },
  { id: 'en', label: 'English', native: 'English' },
];

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { locale } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
      {LANGS.map((item) => {
        const active = locale === item.id;
        return (
          <Link
            key={item.id}
            href={withLocale(pathname || `/${locale}`, item.id)}
            hrefLang={item.id}
            lang={item.id}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              active
                ? 'bg-[#C8972A] text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            style={item.id !== 'en' ? { fontFamily: 'var(--font-amiri-var), Amiri, serif' } : {}}
            title={item.label}
          >
            {compact ? item.native.slice(0, 2) : item.native}
          </Link>
        );
      })}
    </div>
  );
}
