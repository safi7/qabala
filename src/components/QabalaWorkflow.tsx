'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { DocType, QabalaFormData } from '@/lib/types';
import { getSchema, fieldsForStep } from '@/lib/schemas';
import { sampleFor } from '@/lib/sampleData';
import { formatShamsiNumeric, describeDeedDate } from '@/lib/hijri';
import { downloadBlob, sharePdfFile } from '@/lib/pdf';
import LanguageSelector from './LanguageSelector';
import PersonSection from './forms/PersonSection';
import PropertySection from './forms/PropertySection';
import WitnessSection from './forms/WitnessSection';
import QabalaDocument from './documents/QabalaDocument';
import { FormField, Input, Select, Textarea } from './forms/FormField';

interface QabalaWorkflowProps {
  docType: DocType;
  isDemo?: boolean;
}

const TOTAL_STEPS = 5;

function StepIndicator({ current, labels, dir }: { current: number; labels: readonly string[]; dir: 'rtl' | 'ltr' }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1" dir={dir}>
      {labels.slice(0, TOTAL_STEPS - 1).map((label, i) => (
        <div key={i} className="flex items-center shrink-0">
          <div className={`flex flex-col items-center gap-1 ${i < current ? 'opacity-70' : i === current ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < current ? 'bg-[#C8972A] border-[#C8972A] text-white' :
              i === current ? 'bg-[#0A3D22] border-[#C8972A] text-white' :
              'bg-white/10 border-white/30 text-white/50'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className="text-[10px] text-white/70 hidden sm:block text-center max-w-[70px] leading-tight">{label}</span>
          </div>
          {i < labels.length - 2 && (
            <div className={`w-6 sm:w-10 h-px mx-1 ${i < current ? 'bg-[#C8972A]' : 'bg-white/20'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function QabalaWorkflowInner({ docType, isDemo = false }: QabalaWorkflowProps) {
  const { lang, locale, tr } = useLanguage();
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<'download' | 'whatsapp' | null>(null);
  const [pdfError, setPdfError] = useState('');
  const docRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(() => getSchema(docType, lang), [docType, lang]);

  const { register, trigger, reset, getValues, setValue, watch, clearErrors, control, formState: { errors } } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      documentNumber: '',
      date: formatShamsiNumeric(new Date()),
      amount: '',
      amountWords: '',
      currency: tr.options.currencies[0],
      sellers: [{ fullName: '', fatherName: '', grandfatherName: '', tazkiraNumber: '' }],
      buyers: [{ fullName: '', fatherName: '', grandfatherName: '', tazkiraNumber: '' }],
      property: { areaUnit: tr.options.areaUnits[0], areaJerib: '', areaBiswa: '' },
      witnesses: [{ fullName: '', fatherName: '' }, { fullName: '', fatherName: '' }],
      declarationText: '',
      notes: '',
    },
    mode: 'onBlur',
  });

  const { fields: sellerFields, append: appendSeller, remove: removeSeller } = useFieldArray({
    control,
    name: 'sellers' as never,
  });

  const { fields: buyerFields, append: appendBuyer, remove: removeBuyer } = useFieldArray({
    control,
    name: 'buyers' as never,
  });

  const { fields: witnessFields, append: appendWitness, remove: removeWitness } = useFieldArray({
    control,
    name: 'witnesses' as never,
  });

  useEffect(() => {
    if (isDemo) {
      reset(sampleFor(lang, docType) as Parameters<typeof reset>[0]);
      setPreview(true);
    }
    setTimeout(() => {
      setValue('declarationText' as never, tr.document.sellerDeclaration as never);
    }, 0);
    clearErrors();
  }, [lang, docType, isDemo, tr.document.sellerDeclaration, setValue, clearErrors, reset]);

  const handleNext = async () => {
    const fields = fieldsForStep(docType, step);
    const ok = await trigger(fields as Parameters<typeof trigger>[0]);
    if (ok) setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => {
    if (preview) { setPreview(false); return; }
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleGeneratePreview = async () => {
    const fields = fieldsForStep(docType, 3);
    const ok = await trigger(fields as Parameters<typeof trigger>[0]);
    if (ok) setPreview(true);
  };

  const handlePrint = useReactToPrint({
    contentRef: docRef,
    documentTitle: `qabala-${docType}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 0; }
      body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #FFFCF0; }
    `,
    onBeforePrint: () => { setSaving(true); return Promise.resolve(); },
    onAfterPrint: () => setSaving(false),
  });

  const handlePdf = async (mode: 'download' | 'whatsapp') => {
    setPdfError('');
    const ok = await trigger();
    if (!ok) {
      for (const candidate of [0, 1, 2, 3]) {
        const fields = fieldsForStep(docType, candidate);
        const stepOk = await trigger(fields as Parameters<typeof trigger>[0]);
        if (!stepOk) {
          setPreview(false);
          setStep(candidate);
          return;
        }
      }
      setPreview(false);
      setStep(2);
      return;
    }
    setPdfBusy(mode);
    try {
      const [{ pdf }, { QabalaPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./documents/QabalaPdf'),
      ]);
      const blob = await pdf(
        <QabalaPdf data={getValues() as QabalaFormData} docType={docType} tr={tr} />,
      ).toBlob();
      const filename = `qabala-${docType}.pdf`;
      if (mode === 'whatsapp') await sharePdfFile(blob, filename, tr.shareText);
      else downloadBlob(blob, filename);
    } catch {
      setPdfError(tr.pdfError);
    } finally {
      setPdfBusy(null);
    }
  };

  const formData = getValues() as QabalaFormData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061A0F] via-[#0A3D22] to-[#0D4A2A]">
      {/* Header */}
      <header className="no-print sticky top-0 z-20 bg-[#0A3D22]/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3" dir={tr.dir}>
          <Link href={`/${locale}`} className="text-white/60 hover:text-white transition-colors text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold" style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
            {tr.document.titles[docType]}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/25 text-[10px] hidden sm:block">Q. Safi</span>
          <LanguageSelector compact />
        </div>
      </header>

      <main className={`${preview ? '' : 'no-print '}max-w-3xl mx-auto px-4 py-6`}>
        {!preview ? (
          <>
            <div className="mb-4 space-y-2" dir={tr.dir}>
              <p className="text-white/75 text-sm leading-relaxed">{tr.categoryDesc[docType]}</p>
              <p className="text-[#E0B84A] text-xs leading-relaxed">{tr.disclaimer}</p>
            </div>
            <div className="mb-6">
              <StepIndicator current={step} labels={tr.steps} dir={tr.dir} />
            </div>

            {/* Step card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
              <div className="flex items-start justify-between mb-5" dir={tr.dir}>
                <h2 className="text-xl font-bold text-[#0A3D22]"
                  style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
                  {tr.steps[step]}
                </h2>
              </div>

              <div dir={tr.dir}>
                {step === 0 && (
                  <PersonSection
                    role="sellers"
                    fields={sellerFields}
                    register={register}
                    errors={errors}
                    onAppend={() => appendSeller({ fullName: '', fatherName: '', grandfatherName: '', tazkiraNumber: '' } as never)}
                    onRemove={removeSeller}
                    title={tr.sections.seller}
                    addLabel={lang === 'english' ? 'Add Seller' : lang === 'pashto' ? 'پلورونکی اضافه کړئ' : 'اضافه کردن فروشنده'}
                  />
                )}
                {step === 1 && (
                  <PersonSection
                    role="buyers"
                    fields={buyerFields}
                    register={register}
                    errors={errors}
                    onAppend={() => appendBuyer({ fullName: '', fatherName: '', grandfatherName: '', tazkiraNumber: '' } as never)}
                    onRemove={removeBuyer}
                    title={tr.sections.buyer}
                    addLabel={lang === 'english' ? 'Add Buyer' : lang === 'pashto' ? 'اخیستونکی اضافه کړئ' : 'اضافه کردن خریدار'}
                  />
                )}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Document info */}
                    <div>
                      <h3 className="text-lg font-bold text-[#0A3D22] border-b-2 border-[#C8972A] pb-2 mb-4"
                        style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
                        {tr.sections.docInfo}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label={tr.fields.documentNumber} error={errors.documentNumber as { message?: string }}>
                          <Input {...register('documentNumber')} error={!!errors.documentNumber} />
                        </FormField>
                        <FormField label={tr.hijriLabel} error={errors.date as { message?: string }}>
                          <Input
                            type="text"
                            inputMode="numeric"
                            dir="ltr"
                            placeholder="1405/07/08"
                            {...register('date')}
                            error={!!errors.date}
                          />
                          {describeDeedDate(String(watch('date') ?? ''), lang) && (
                            <p className="text-xs text-gray-500 mt-1">{describeDeedDate(String(watch('date') ?? ''), lang)}</p>
                          )}
                        </FormField>
                      </div>
                    </div>

                    {/* Property details */}
                    <PropertySection
                      docType={docType}
                      register={register}
                      errors={errors}
                      setValue={setValue}
                      getValues={getValues}
                    />

                    {/* Transaction */}
                    <div>
                      <h3 className="text-lg font-bold text-[#0A3D22] border-b-2 border-[#C8972A] pb-2 mb-4"
                        style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
                        {tr.sections.transaction}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField label={tr.fields.amount} error={errors.amount as { message?: string }}>
                          <Input type="text" inputMode="decimal" {...register('amount')} error={!!errors.amount} />
                        </FormField>
                        <FormField label={tr.fields.currency} error={errors.currency as { message?: string }}>
                          <Select options={tr.options.currencies as unknown as string[]} {...register('currency')} />
                        </FormField>
                        <FormField label={tr.fields.amountWords} className="sm:col-span-3" error={errors.amountWords as { message?: string }}>
                          <Input {...register('amountWords')} error={!!errors.amountWords}
                            placeholder={lang === 'english' ? 'e.g. One Million Afghani' : lang === 'pashto' ? 'مثال: یو ملیون افغاني' : 'مثال: یک میلیون افغانی'} />
                        </FormField>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <FormField label={lang === 'english' ? 'Notes (optional)' : lang === 'pashto' ? 'یادداشتونه (اختیاري)' : 'ملاحظات (اختیاری)'} required={false} error={errors.notes as { message?: string }}>
                        <Textarea
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...register('notes' as any)}
                          error={!!(errors as Record<string, unknown>).notes}
                          placeholder={lang === 'english' ? 'Any additional notes about the property...' : lang === 'pashto' ? 'د ملکیت د اړه اضافي یادداشتونه...' : 'یادداشت‌های اضافی درباره ملک...'}
                        />
                      </FormField>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-6">
                    <WitnessSection
                      fields={witnessFields}
                      register={register}
                      errors={errors}
                      onAppend={() => appendWitness({ fullName: '', fatherName: '' } as never)}
                      onRemove={removeWitness}
                    />

                    {/* Declaration text */}
                    <div>
                      <FormField
                        label={lang === 'english' ? 'Declaration Text' : lang === 'pashto' ? 'د اعلان متن' : 'متن اعلان'}
                        error={errors.declarationText as { message?: string }}
                      >
                        <Textarea
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...register('declarationText' as any)}
                          error={!!(errors as Record<string, unknown>).declarationText}
                          rows={4}
                        />
                      </FormField>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {pdfError && step === 3 && (
              <p className="mt-4 text-sm text-amber-200 text-center" dir={tr.dir}>{pdfError}</p>
            )}

            {/* Navigation buttons */}
            <div className={`flex mt-5 gap-3 flex-wrap ${tr.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all font-medium text-sm"
                >
                  {tr.buttons.back}
                </button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#C8972A] text-white hover:bg-[#B8882A] transition-all font-semibold text-sm shadow-lg shadow-[#C8972A]/20"
                >
                  {tr.buttons.next}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleGeneratePreview}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all font-medium text-sm"
                  >
                    {tr.buttons.preview}
                  </button>
                  <button
                    onClick={() => handlePdf('whatsapp')}
                    disabled={pdfBusy !== null}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#128C7E] text-white hover:bg-[#0E6F64] transition-all font-semibold text-sm disabled:opacity-60"
                  >
                    {pdfBusy === 'whatsapp' ? '...' : tr.buttons.whatsapp}
                  </button>
                  <button
                    onClick={() => handlePdf('download')}
                    disabled={pdfBusy !== null}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8972A] text-white hover:bg-[#B8882A] transition-all font-semibold text-sm shadow-lg shadow-[#C8972A]/20 disabled:opacity-60"
                  >
                    {pdfBusy === 'download' ? '...' : tr.buttons.download}
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          /* Preview mode */
          <div>
            {/* Action bar */}
            <div className={`no-print flex items-center gap-3 mb-5 flex-wrap ${tr.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-sm"
              >
                {tr.buttons.back}
              </button>
              <div className="flex-1" />
              <button
                onClick={() => handlePrint()}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0A3D22] text-white border border-[#C8972A] hover:bg-[#145C35] transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {tr.buttons.print}
              </button>
              <button
                onClick={() => handlePdf('download')}
                disabled={pdfBusy !== null}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#C8972A] text-white hover:bg-[#B8882A] transition-all text-sm font-medium disabled:opacity-60"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {pdfBusy === 'download' ? '...' : tr.buttons.download}
              </button>
              <button
                onClick={() => handlePdf('whatsapp')}
                disabled={pdfBusy !== null}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#128C7E] text-white hover:bg-[#0E6F64] transition-all text-sm font-medium disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 22.5l5.9-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.5.6.6-3.4-.2-.3A9.1 9.1 0 1 1 12 20.5zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.5-.8-2s-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.5 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3z" />
                </svg>
                {pdfBusy === 'whatsapp' ? '...' : tr.buttons.whatsapp}
              </button>
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-sm"
              >
                {tr.buttons.newDoc}
              </Link>
            </div>
            {pdfError && (
              <p className="no-print mb-4 text-sm text-amber-800 text-center" dir={tr.dir}>{pdfError}</p>
            )}

            {/* Document preview */}
            <div className="overflow-auto">
              <div ref={docRef} className="shadow-2xl inline-block">
                <QabalaDocument data={formData} docType={docType} tr={tr} />
              </div>
            </div>
          </div>
        )}
        <p className="no-print text-white/40 text-xs text-center mt-6 max-w-md mx-auto leading-relaxed">{tr.footerNote}</p>
      </main>
    </div>
  );
}

export default function QabalaWorkflow({ docType, isDemo = false }: QabalaWorkflowProps) {
  return <QabalaWorkflowInner docType={docType} isDemo={isDemo} />;
}
