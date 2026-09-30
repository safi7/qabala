import type { Language } from './types';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export const HIJRI_MONTHS: Record<Language, readonly string[]> = {
  dari: ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'],
  pashto: ['وری', 'غویی', 'غبرګولی', 'چنګاښ', 'زمری', 'وږی', 'تله', 'لړم', 'لیندۍ', 'مرغومی', 'سلواغه', 'کب'],
  english: ['Hamal', 'Sawr', 'Jawza', 'Saratan', 'Asad', 'Sonbola', 'Mizan', 'Aqrab', 'Qaws', 'Jadi', 'Dalw', 'Hut'],
};

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
}

export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const gDayMonths = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDayMonths[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    return [jy, 1 + Math.floor(days / 31), 1 + (days % 31)];
  }
  return [jy, 7 + Math.floor((days - 186) / 30), 1 + ((days - 186) % 30)];
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let year = jy + 1595;
  let days =
    -355668 +
    365 * year +
    Math.floor(year / 33) * 8 +
    Math.floor(((year % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  const monthLengths = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 1;
  while (gm < 13 && gd > monthLengths[gm]) {
    gd -= monthLengths[gm];
    gm++;
  }
  return [gy, gm, gd];
}

export interface ParsedDate {
  jy: number;
  jm: number;
  jd: number;
  gy: number;
  gm: number;
  gd: number;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatShamsiNumeric(date: Date): string {
  const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${jy}/${pad(jm)}/${pad(jd)}`;
}

export function parseDeedDate(input: string): ParsedDate | null {
  const normalized = toLatinDigits(input).trim();
  const match = normalized.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  if (year >= 1700) {
    const [jy, jm, jd] = gregorianToJalali(year, month, day);
    return { jy, jm, jd, gy: year, gm: month, gd: day };
  }
  if (year >= 1200 && year <= 1600) {
    const [gy, gm, gd] = jalaliToGregorian(year, month, day);
    return { jy: year, jm: month, jd: day, gy, gm, gd };
  }
  return null;
}

export function formatDeedDate(input: string, lang: Language): string {
  const parsed = parseDeedDate(input);
  if (!parsed) return input;
  const month = HIJRI_MONTHS[lang][parsed.jm - 1];
  const gregorian = `${parsed.gy}-${pad(parsed.gm)}-${pad(parsed.gd)}`;
  if (lang === 'english') {
    return `${parsed.jd} ${month} ${parsed.jy} (${gregorian})`;
  }
  return `${toPersianDigits(parsed.jd)} ${month} ${toPersianDigits(parsed.jy)} (${gregorian})`;
}

export function describeDeedDate(input: string, lang: Language): string {
  const formatted = formatDeedDate(input, lang);
  return formatted === input ? '' : formatted;
}
