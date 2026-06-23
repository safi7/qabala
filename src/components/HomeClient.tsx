'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { DocType } from '@/lib/types';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';

const CATEGORY_ICONS: Record<DocType, React.ReactNode> = {
  land: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <path d="M4 38L16 18L24 28L32 16L44 38H4Z" fill="currentColor" opacity="0.9" />
      <circle cx="36" cy="12" r="5" fill="#C8972A" />
    </svg>
  ),
  house: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <path d="M6 22L24 6L42 22V42H30V30H18V42H6V22Z" fill="currentColor" opacity="0.9" />
      <rect x="20" y="30" width="8" height="12" fill="#C8972A" opacity="0.7" />
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <rect x="6" y="20" width="36" height="22" fill="currentColor" opacity="0.9" rx="2" />
      <path d="M4 20L10 8H38L44 20H4Z" fill="currentColor" opacity="0.6" />
      <rect x="18" y="30" width="12" height="12" fill="#C8972A" opacity="0.8" rx="1" />
    </svg>
  ),
  vehicle: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <path d="M8 28L14 16H34L40 28V36H8V28Z" fill="currentColor" opacity="0.9" rx="2" />
      <path d="M6 28H42" stroke="#C8972A" strokeWidth="2.5" />
      <circle cx="14" cy="36" r="5" fill="#C8972A" />
      <circle cx="34" cy="36" r="5" fill="#C8972A" />
      <circle cx="14" cy="36" r="2" fill="white" />
      <circle cx="34" cy="36" r="2" fill="white" />
    </svg>
  ),
  garden: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <path d="M24 8C16 8 10 16 10 22C10 28 16 32 24 32C32 32 38 28 38 22C38 16 32 8 24 8Z" fill="currentColor" opacity="0.8" />
      <rect x="22" y="32" width="4" height="10" fill="#C8972A" />
      <path d="M14 28C10 26 6 20 8 14C10 8 18 8 20 16" fill="currentColor" opacity="0.5" />
      <path d="M34 28C38 26 42 20 40 14C38 8 30 8 28 16" fill="currentColor" opacity="0.5" />
    </svg>
  ),
};

const CATEGORY_COLORS: Record<DocType, string> = {
  land: 'from-emerald-900 to-emerald-800',
  house: 'from-green-900 to-teal-900',
  shop: 'from-teal-900 to-cyan-900',
  vehicle: 'from-slate-800 to-slate-700',
  garden: 'from-lime-900 to-green-900',
};

const ALL_TYPES: DocType[] = ['land', 'house', 'shop', 'vehicle', 'garden'];

export default function HomeClient() {
  const { lang, tr } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061A0F] via-[#0A3D22] to-[#0D4A2A] relative overflow-hidden">
      {/* Islamic geometric background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8972A' fill-opacity='1'%3E%3Cpath d='M30 0l8.66 15L30 30 21.34 15z'/%3E%3Cpath d='M0 30l15-8.66L30 30 15 38.66z'/%3E%3Cpath d='M30 30l15 8.66L30 60 15 38.66z'/%3E%3Cpath d='M30 30l8.66-15L60 30 38.66 38.66z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="no-print relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div dir="rtl" className="flex items-center gap-3">
          {/* Afghan emblem-inspired icon */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8972A] to-[#A07A20] flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
            ق
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
              {tr.appName}
            </p>
            <p className="text-white/50 text-xs">{tr.appSubtitle}</p>
          </div>
        </div>
        <LanguageSelector />
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-4 pt-10 pb-16">
        {/* Bismillah + title */}
        <div className="text-center mb-10">
          <p
            className="text-[#C8972A] text-2xl md:text-3xl mb-3"
            style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}
          >
            بسم الله الرحمن الرحیم
          </p>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-16 bg-gradient-to-l from-[#C8972A] to-transparent" />
            <div className="w-2 h-2 bg-[#C8972A] rotate-45" />
            <div className="h-px w-16 bg-gradient-to-r from-[#C8972A] to-transparent" />
          </div>
          <h1
            className="text-white text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}
          >
            {lang === 'english' ? 'Qabala' : lang === 'pashto' ? 'قباله' : 'قباله'}
          </h1>
          <p className="text-white/60 text-sm md:text-base mt-1">{tr.appSubtitle}</p>
          <p className="text-white/40 text-xs mt-2">
            {lang !== 'dari' && 'سیستم قباله · '}
            {lang !== 'pashto' && 'د قباله سیستم · '}
            {lang !== 'english' && 'Qabala System'}
          </p>
        </div>

        {/* Select label */}
        <p className="text-[#C8972A] text-sm font-semibold uppercase tracking-widest mb-6">
          {tr.selectCategory}
        </p>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
          {ALL_TYPES.map((type) => (
            <div
              key={type}
              className={`group relative bg-gradient-to-br ${CATEGORY_COLORS[type]} rounded-2xl p-6 border border-white/10 hover:border-[#C8972A]/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C8972A]/10 overflow-hidden transition-all duration-200`}
            >
              {/* Corner ornament */}
              <div className="absolute top-3 right-3 text-[#C8972A]/30 text-lg" style={{ fontFamily: 'serif' }}>✦</div>

              {/* Icon */}
              <div className="text-white/80 group-hover:text-white mb-4 transition-colors">
                {CATEGORY_ICONS[type]}
              </div>

              {/* Name */}
              <h2
                className="text-white text-2xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}
              >
                {tr.categories[type]}
              </h2>

              {/* Description */}
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                {tr.categoryDesc[type]}
              </p>

              {/* Other language names */}
              <div className="flex flex-wrap gap-1 mb-4">
                {lang !== 'dari' && (
                  <span className="text-[#C8972A]/70 text-xs px-2 py-0.5 rounded-full border border-[#C8972A]/20 bg-[#C8972A]/5"
                    style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
                    {({ land:'زمین', house:'خانه', shop:'دکان', vehicle:'موتر', garden:'باغ' })[type]}
                  </span>
                )}
                {lang !== 'pashto' && (
                  <span className="text-[#C8972A]/70 text-xs px-2 py-0.5 rounded-full border border-[#C8972A]/20 bg-[#C8972A]/5"
                    style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
                    {({ land:'ځمکه', house:'کور', shop:'دوکان', vehicle:'موټر', garden:'باغ' })[type]}
                  </span>
                )}
                {lang !== 'english' && (
                  <span className="text-[#C8972A]/70 text-xs px-2 py-0.5 rounded-full border border-[#C8972A]/20 bg-[#C8972A]/5">
                    {({ land:'Land', house:'House', shop:'Shop', vehicle:'Vehicle', garden:'Garden' })[type]}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className={`flex items-center gap-2 ${lang !== 'english' ? 'flex-row-reverse' : ''}`}>
                <Link
                  href={`/${type}`}
                  className="flex items-center gap-1 bg-[#C8972A] hover:bg-[#B8872A] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                >
                  <svg className={`w-3.5 h-3.5 ${lang !== 'english' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{lang === 'english' ? 'Create' : lang === 'pashto' ? 'جوړول' : 'ایجاد'}</span>
                </Link>
                <Link
                  href={`/${type}?demo=1`}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all border border-white/20"
                  style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{lang === 'english' ? 'Sample' : lang === 'pashto' ? 'نمونه' : 'نمونه'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-2">
          <p className="text-white/25 text-xs text-center max-w-md leading-relaxed">
            {lang === 'english'
              ? 'All documents are generated locally. No data is sent to any server.'
              : lang === 'pashto'
              ? 'ټول اسناد په محلي توګه جوړیږي. هیڅ معلومات سرور ته نه لیږل کیږي.'
              : 'تمام اسناد به صورت محلی تهیه می‌شوند. هیچ اطلاعاتی به سرور ارسال نمی‌شود.'}
          </p>
          <p className="text-white/20 text-xs text-center">
            {lang === 'english'
              ? 'Developed by'
              : lang === 'pashto'
              ? 'جوړونکی'
              : 'توسعه‌دهنده'}
            {' '}
            <span className="text-[#C8972A]/50 font-semibold" style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
              Q. Safi
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
