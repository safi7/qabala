import { notFound } from 'next/navigation';
import QabalaWorkflow from '@/components/QabalaWorkflow';
import type { DocType } from '@/lib/types';

const VALID_TYPES: DocType[] = ['land', 'house', 'shop', 'vehicle', 'garden'];

export async function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }));
}

export default async function TypePage({ params }: PageProps<'/[type]'>) {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as DocType)) notFound();
  return <QabalaWorkflow docType={type as DocType} />;
}
