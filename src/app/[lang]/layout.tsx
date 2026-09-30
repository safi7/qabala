import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { isLocale, localeToLanguage } from '@/lib/locales';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LanguageProvider initialLang={localeToLanguage(lang)}>{children}</LanguageProvider>;
}
