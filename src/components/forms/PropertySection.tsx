'use client';

import { type UseFormRegister, type FieldErrors, type UseFormSetValue, type UseFormGetValues } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';
import { PROVINCES } from '@/lib/translations';
import { jeribToMeters, metersToJerib, parseLocalizedNumber } from '@/lib/area';
import type { DocType } from '@/lib/types';
import { FormField, Input, Select } from './FormField';

interface PropertySectionProps {
  docType: DocType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValues: UseFormGetValues<any>;
}

function BoundaryFields({ register, errors, f }: { register: PropertySectionProps['register']; errors: PropertySectionProps['errors']; f: Record<string, string> }) {
  const pe = (errors.property ?? {}) as Record<string, { message?: string }>;
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-[#C8972A] uppercase tracking-wider"
        style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
        {f.boundaries ?? 'حدود اربعه'}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={f.boundaryNorth} error={pe.boundaryNorth as { message?: string } | undefined}>
          <Input {...register('property.boundaryNorth')} error={!!pe.boundaryNorth} />
        </FormField>
        <FormField label={f.boundarySouth} error={pe.boundarySouth as { message?: string } | undefined}>
          <Input {...register('property.boundarySouth')} error={!!pe.boundarySouth} />
        </FormField>
        <FormField label={f.boundaryEast} error={pe.boundaryEast as { message?: string } | undefined}>
          <Input {...register('property.boundaryEast')} error={!!pe.boundaryEast} />
        </FormField>
        <FormField label={f.boundaryWest} error={pe.boundaryWest as { message?: string } | undefined}>
          <Input {...register('property.boundaryWest')} error={!!pe.boundaryWest} />
        </FormField>
      </div>
    </div>
  );
}

function LocationFields({ register, errors, f, lang }: { register: PropertySectionProps['register']; errors: PropertySectionProps['errors']; f: Record<string, string>; lang: string }) {
  const pe = (errors.property ?? {}) as Record<string, { message?: string }>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormField label={f.province} error={pe.province as { message?: string } | undefined}>
        <Select options={PROVINCES[lang as 'dari' | 'pashto' | 'english']} placeholder="—" {...register('property.province')} />
      </FormField>
      <FormField label={f.district} error={pe.district as { message?: string } | undefined}>
        <Input {...register('property.district')} error={!!pe.district} />
      </FormField>
      <FormField label={f.village} error={pe.village as { message?: string } | undefined}>
        <Input {...register('property.village')} error={!!pe.village} />
      </FormField>
    </div>
  );
}

function AreaFields({ register, errors, setValue, getValues, metersLabel, jeribLabel, biswaLabel, note }: {
  register: PropertySectionProps['register'];
  errors: PropertySectionProps['errors'];
  setValue: PropertySectionProps['setValue'];
  getValues: PropertySectionProps['getValues'];
  metersLabel: string;
  jeribLabel: string;
  biswaLabel: string;
  note: string;
}) {
  const pe = (errors.property ?? {}) as Record<string, { message?: string }>;

  const syncFromMeters = (raw: string) => {
    const meters = parseLocalizedNumber(raw);
    if (meters === null) {
      setValue('property.areaJerib', '');
      setValue('property.areaBiswa', '');
      return;
    }
    const parts = metersToJerib(meters);
    setValue('property.areaJerib', String(parts.jerib));
    setValue('property.areaBiswa', String(parts.biswa));
  };

  const syncFromJerib = (field: 'areaJerib' | 'areaBiswa', raw: string) => {
    const jerib = field === 'areaJerib'
      ? (parseLocalizedNumber(raw) ?? 0)
      : (parseLocalizedNumber(String(getValues('property.areaJerib') ?? '')) ?? 0);
    const biswa = field === 'areaBiswa'
      ? (parseLocalizedNumber(raw) ?? 0)
      : (parseLocalizedNumber(String(getValues('property.areaBiswa') ?? '')) ?? 0);
    setValue('property.area', String(jeribToMeters(jerib, biswa)));
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label={jeribLabel} required={false}>
          <Input
            type="text"
            inputMode="decimal"
            {...register('property.areaJerib', { onChange: (event) => syncFromJerib('areaJerib', event.target.value) })}
          />
        </FormField>
        <FormField label={biswaLabel} required={false}>
          <Input
            type="text"
            inputMode="decimal"
            {...register('property.areaBiswa', { onChange: (event) => syncFromJerib('areaBiswa', event.target.value) })}
          />
        </FormField>
        <FormField label={metersLabel} error={pe.area}>
          <Input
            type="text"
            inputMode="decimal"
            {...register('property.area', { onChange: (event) => syncFromMeters(event.target.value) })}
            error={!!pe.area}
          />
        </FormField>
      </div>
      <p className="text-xs text-gray-500">{note}</p>
      <input type="hidden" {...register('property.areaUnit')} />
    </div>
  );
}

export default function PropertySection({ docType, register, errors, setValue, getValues }: PropertySectionProps) {
  const { lang, tr } = useLanguage();
  const f = { ...tr.fields, boundaries: tr.sections.boundaries };
  const pe = (errors.property ?? {}) as Record<string, { message?: string }>;

  if (docType === 'vehicle') {
    return (
      <div className="space-y-5">
        <SectionHeader label={tr.sections.propertyDetails} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={f.vehicleType} error={pe.vehicleType as { message?: string } | undefined}>
            <Select options={tr.options.vehicleTypes as unknown as string[]} placeholder="—" {...register('property.vehicleType')} />
          </FormField>
          <FormField label={f.make} error={pe.make as { message?: string } | undefined}>
            <Input {...register('property.make')} error={!!pe.make} />
          </FormField>
          <FormField label={f.model} error={pe.model as { message?: string } | undefined}>
            <Input {...register('property.model')} error={!!pe.model} />
          </FormField>
          <FormField label={f.year} error={pe.year as { message?: string } | undefined}>
            <Input type="text" inputMode="numeric" {...register('property.year')} error={!!pe.year} />
          </FormField>
          <FormField label={f.color} error={pe.color as { message?: string } | undefined}>
            <Input {...register('property.color')} error={!!pe.color} />
          </FormField>
          <FormField label={f.plateNumber} error={pe.plateNumber as { message?: string } | undefined}>
            <Input {...register('property.plateNumber')} error={!!pe.plateNumber} />
          </FormField>
          <FormField label={f.chassisNumber} error={pe.chassisNumber as { message?: string } | undefined}>
            <Input {...register('property.chassisNumber')} error={!!pe.chassisNumber} />
          </FormField>
          <FormField label={f.engineNumber} error={pe.engineNumber as { message?: string } | undefined}>
            <Input {...register('property.engineNumber')} error={!!pe.engineNumber} />
          </FormField>
          <FormField label={f.trafficRegNumber} className="sm:col-span-2" error={pe.trafficRegNumber as { message?: string } | undefined}>
            <Input {...register('property.trafficRegNumber')} error={!!pe.trafficRegNumber} />
          </FormField>
        </div>
      </div>
    );
  }

  if (docType === 'shop') {
    return (
      <div className="space-y-5">
        <SectionHeader label={tr.sections.propertyDetails} />
        <LocationFields register={register} errors={errors} f={f} lang={lang} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={f.marketName} error={pe.marketName as { message?: string } | undefined}>
            <Input {...register('property.marketName')} error={!!pe.marketName} />
          </FormField>
          <FormField label={f.shopNumber} error={pe.shopNumber as { message?: string } | undefined}>
            <Input {...register('property.shopNumber')} error={!!pe.shopNumber} />
          </FormField>
          <FormField label={f.floor} error={pe.floor as { message?: string } | undefined}>
            <Input type="text" inputMode="numeric" {...register('property.floor')} error={!!pe.floor} />
          </FormField>
          <FormField label={f.area} error={pe.area as { message?: string } | undefined}>
            <Input type="text" inputMode="numeric" {...register('property.area')} error={!!pe.area} />
          </FormField>
          <FormField label={f.areaUnit} error={pe.areaUnit as { message?: string } | undefined}>
            <Select options={tr.options.areaUnits as unknown as string[]} placeholder="—" {...register('property.areaUnit')} />
          </FormField>
        </div>
        <BoundaryFields register={register} errors={errors} f={f} />
      </div>
    );
  }

  // Land, House, Garden (all share location + boundaries)
  return (
    <div className="space-y-5">
      <SectionHeader label={tr.sections.propertyDetails} />
      <LocationFields register={register} errors={errors} f={f} lang={lang} />
      <AreaFields
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        metersLabel={tr.options.areaUnits[0]}
        jeribLabel={tr.options.areaUnits[1]}
        biswaLabel={tr.options.areaUnits[2]}
        note={tr.areaNote}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={`${f.blockNumber} (${lang === 'english' ? 'optional' : lang === 'pashto' ? 'اختیاري' : 'اختیاری'})`} required={false} error={pe.blockNumber as { message?: string } | undefined}>
          <Input {...register('property.blockNumber')} error={!!pe.blockNumber} />
        </FormField>
        <FormField label={`${f.lotNumber} (${lang === 'english' ? 'optional' : lang === 'pashto' ? 'اختیاري' : 'اختیاری'})`} required={false} error={pe.lotNumber as { message?: string } | undefined}>
          <Input {...register('property.lotNumber')} error={!!pe.lotNumber} />
        </FormField>
        <FormField label={f.landType} error={pe.landType as { message?: string } | undefined}>
          <Select options={tr.options.landTypes as unknown as string[]} placeholder="—" {...register('property.landType')} />
        </FormField>
        <FormField label={`${f.previousDeedNumber} (${lang === 'english' ? 'optional' : lang === 'pashto' ? 'اختیاري' : 'اختیاری'})`} required={false} error={pe.previousDeedNumber as { message?: string } | undefined}>
          <Input {...register('property.previousDeedNumber')} error={!!pe.previousDeedNumber} />
        </FormField>
      </div>

      {/* House-specific */}
      {docType === 'house' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label={f.floors} error={pe.floors as { message?: string } | undefined}>
            <Input type="text" inputMode="numeric" {...register('property.floors')} error={!!pe.floors} />
          </FormField>
          <FormField label={f.rooms} error={pe.rooms as { message?: string } | undefined}>
            <Input type="text" inputMode="numeric" {...register('property.rooms')} error={!!pe.rooms} />
          </FormField>
          <FormField label={f.yearBuilt} error={pe.yearBuilt as { message?: string } | undefined}>
            <Input type="text" inputMode="numeric" {...register('property.yearBuilt')} error={!!pe.yearBuilt} />
          </FormField>
        </div>
      )}

      {/* Garden-specific */}
      {docType === 'garden' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label={f.waterSource} error={pe.waterSource as { message?: string } | undefined}>
            <Input {...register('property.waterSource')} error={!!pe.waterSource} />
          </FormField>
          <FormField label={f.waterShare} error={pe.waterShare as { message?: string } | undefined}>
            <Input {...register('property.waterShare')} error={!!pe.waterShare} />
          </FormField>
          <FormField label={f.treeCount} error={pe.treeCount as { message?: string } | undefined}>
            <Input type="text" inputMode="numeric" {...register('property.treeCount')} error={!!pe.treeCount} />
          </FormField>
        </div>
      )}

      <BoundaryFields register={register} errors={errors} f={f} />
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h3 className="text-lg font-bold text-[#0A3D22] border-b-2 border-[#C8972A] pb-2"
      style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
      {label}
    </h3>
  );
}
