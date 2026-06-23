'use client';

import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';
import { FormField, Input } from './FormField';

interface WitnessSectionProps {
  fields: { id: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  onAppend: () => void;
  onRemove: (index: number) => void;
}

export default function WitnessSection({ fields, register, errors, onAppend, onRemove }: WitnessSectionProps) {
  const { tr } = useLanguage();
  const f = tr.fields;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const witnessErrors = (errors.witnesses ?? []) as any[];

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-[#0A3D22] border-b-2 border-[#C8972A] pb-2"
        style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
        {tr.document.witnessLabel}
      </h2>

      {fields.map((field, index) => {
        const itemErrors = (witnessErrors[index] ?? {}) as Record<string, { message?: string }>;
        const witnessNum = index + 1;

        return (
          <div key={field.id} className="relative bg-amber-50/50 border border-amber-200 rounded-xl p-5 space-y-4">
            {fields.length > 2 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-3 end-3 w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center text-sm font-bold leading-none"
                aria-label="Remove"
              >
                ×
              </button>
            )}
            <p className="text-sm font-bold text-[#5A4200]"
              style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
              {tr.document.witnessLabel} {witnessNum}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={f.fullName} error={itemErrors.fullName}>
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(`witnesses.${index}.fullName` as any)}
                  error={!!itemErrors.fullName}
                />
              </FormField>
              <FormField label={f.fatherName} error={itemErrors.fatherName}>
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(`witnesses.${index}.fatherName` as any)}
                  error={!!itemErrors.fatherName}
                />
              </FormField>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAppend}
        disabled={fields.length >= 4}
        className="w-full py-2 rounded-lg border-2 border-dashed border-[#C8972A]/50 text-[#C8972A] text-sm font-medium hover:border-[#C8972A] hover:bg-[#C8972A]/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + {tr.document.witnessLabel}
      </button>
    </div>
  );
}
