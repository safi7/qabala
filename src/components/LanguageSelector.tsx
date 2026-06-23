'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/lib/types';

const LANGS: { id: Language; label: string; native: string }[] = [
  { id: 'dari', label: 'Dari', native: 'دری' },
  { id: 'pashto', label: 'Pashto', native: 'پښتو' },
  { id: 'english', label: 'English', native: 'English' },
];

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
      {LANGS.map((l) => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            lang === l.id
              ? 'bg-[#C8972A] text-white shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          style={l.id !== 'english' ? { fontFamily: 'var(--font-amiri-var), Amiri, serif' } : {}}
          title={l.label}
        >
          {compact ? l.native.slice(0, 2) : l.native}
        </button>
      ))}
    </div>
  );
}
