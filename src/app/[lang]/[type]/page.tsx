import { notFound } from 'next/navigation';
import QabalaWorkflow from '@/components/QabalaWorkflow';
import { DOC_TYPES, isDocType, isLocale, LOCALES } from '@/lib/locales';
import { buildMetadata } from '@/lib/seo';
import type { DocType } from '@/lib/types';

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => DOC_TYPES.map((type) => ({ lang, type })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; type: string }> }) {
  const { lang, type } = await params;
  if (!isLocale(lang) || !isDocType(type)) return {};
  return buildMetadata(lang, type);
}

export default async function TypePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; type: string }>;
  searchParams: Promise<{ demo?: string }>;
}) {
  const { lang, type } = await params;
  const { demo } = await searchParams;
  if (!isLocale(lang) || !isDocType(type)) notFound();
  return <QabalaWorkflow docType={type as DocType} isDemo={demo === '1'} />;
}
