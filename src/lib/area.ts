import { toLatinDigits, toPersianDigits } from './hijri';

/** Afghan cadastre figure used on modern deeds. Some districts still differ. */
export const METERS_PER_JERIB = 2000;
export const METERS_PER_BISWA = 100;

export function parseLocalizedNumber(raw: string): number | null {
  const normalized = toLatinDigits(raw).replace(/[٬,\s]/g, '').trim();
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function metersToJerib(meters: number): { jerib: number; biswa: number; extraMeters: number } {
  const safe = Math.max(0, meters);
  const jerib = Math.floor(safe / METERS_PER_JERIB);
  const afterJerib = safe - jerib * METERS_PER_JERIB;
  const biswa = Math.floor(afterJerib / METERS_PER_BISWA);
  const extraMeters = Math.round((afterJerib - biswa * METERS_PER_BISWA) * 100) / 100;
  return { jerib, biswa, extraMeters };
}

export function jeribToMeters(jerib: number, biswa: number): number {
  return Math.max(0, jerib) * METERS_PER_JERIB + Math.max(0, biswa) * METERS_PER_BISWA;
}

function unitKind(unit: string | undefined): 'meters' | 'jerib' | 'biswa' {
  if (!unit) return 'meters';
  if (/جریب|jerib/i.test(unit)) return 'jerib';
  if (/بسوه|biswa/i.test(unit)) return 'biswa';
  return 'meters';
}

export function formatAreaLine(
  input: { area?: string; areaJerib?: string; areaBiswa?: string; areaUnit?: string },
  labels: { meters: string; jerib: string; biswa: string; and: string },
  persianDigits: boolean,
): string {
  const explicitJerib = parseLocalizedNumber(input.areaJerib ?? '');
  const explicitBiswa = parseLocalizedNumber(input.areaBiswa ?? '');
  const amount = parseLocalizedNumber(input.area ?? '');
  const kind = unitKind(input.areaUnit);

  let meters: number | null = null;
  let jerib: number | null = explicitJerib;
  let biswa: number | null = explicitBiswa;

  if (jerib !== null || biswa !== null) {
    meters = amount !== null && kind === 'meters' ? amount : jeribToMeters(jerib ?? 0, biswa ?? 0);
  } else if (amount !== null && kind === 'jerib') {
    jerib = Math.floor(amount);
    biswa = 0;
    meters = jeribToMeters(jerib, 0);
  } else if (amount !== null && kind === 'biswa') {
    jerib = 0;
    biswa = Math.floor(amount);
    meters = jeribToMeters(0, biswa);
  } else if (amount !== null) {
    meters = amount;
    const parts = metersToJerib(amount);
    jerib = parts.jerib;
    biswa = parts.biswa;
  }

  if (meters === null || jerib === null || biswa === null) return input.area ?? '';

  const fmt = (value: number) => {
    const text = Number.isInteger(value) ? String(value) : String(value);
    return persianDigits ? toPersianDigits(text) : text;
  };

  const extra = metersToJerib(meters).extraMeters;
  const base = `${fmt(meters)} ${labels.meters} — ${fmt(jerib)} ${labels.jerib} ${labels.and} ${fmt(biswa)} ${labels.biswa}`;
  return extra ? `${base} ${labels.and} ${fmt(extra)} ${labels.meters}` : base;
}
