'use client';

import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';
import { FormField, Input } from './FormField';

interface PersonSectionProps {
  role: 'sellers' | 'buyers';
  fields: { id: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  onAppend: () => void;
  onRemove: (index: number) => void;
  title: string;
  addLabel: string;
}

export default function PersonSection({ role, fields, register, errors, onAppend, onRemove, title, addLabel }: PersonSectionProps) {
  const { tr } = useLanguage();
  const f = tr.fields;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#0A3D22] border-b-2 border-[#C8972A] pb-2"
        style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
        {title}
      </h3>

      {fields.map((field, index) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roleErrors = (errors[role] ?? []) as any[];
        const itemErrors = (roleErrors[index] ?? {}) as Record<string, { message?: string }>;

        return (
          <div key={field.id} className="relative bg-amber-50/50 border border-amber-200 rounded-xl p-5 space-y-4">
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-3 end-3 w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center text-sm font-bold leading-none"
                aria-label="Remove"
              >
                ×
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={f.fullName} error={itemErrors.fullName}>
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(`${role}.${index}.fullName` as any)}
                  error={!!itemErrors.fullName}
                />
              </FormField>
              <FormField label={f.fatherName} error={itemErrors.fatherName}>
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(`${role}.${index}.fatherName` as any)}
                  error={!!itemErrors.fatherName}
                />
              </FormField>
              <FormField label={f.grandfatherName} error={itemErrors.grandfatherName}>
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(`${role}.${index}.grandfatherName` as any)}
                  error={!!itemErrors.grandfatherName}
                />
              </FormField>
              <FormField label={f.tazkiraNumber} error={itemErrors.tazkiraNumber}>
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(`${role}.${index}.tazkiraNumber` as any)}
                  error={!!itemErrors.tazkiraNumber}
                />
              </FormField>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAppend}
        disabled={fields.length >= 10}
        className="w-full py-2 rounded-lg border-2 border-dashed border-[#C8972A]/50 text-[#C8972A] text-sm font-medium hover:border-[#C8972A] hover:bg-[#C8972A]/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + {addLabel}
      </button>
    </div>
  );
}
