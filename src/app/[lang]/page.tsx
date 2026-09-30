import { notFound } from 'next/navigation';
import HomeClient from '@/components/HomeClient';
import { isLocale, LOCALES } from '@/lib/locales';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return buildMetadata(lang);
}

export default async function LangHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <HomeClient />;
}
