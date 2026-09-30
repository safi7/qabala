import type { Metadata } from 'next';
import { SITE_URL, isLocale, type Locale } from './locales';
import type { DocType } from './types';

const HOME: Record<Locale, { title: string; description: string }> = {
  ps: {
    title: 'آنلاین قباله | د ځمکې او موټر نمونه',
    description:
      'د قبالې آنلاین ویبپاڼه: د ځمکې، کور، دوکان، موټر او باغ نمونه په پښتو او دري کې په تلیفون جوړه او چاپ کړئ. دولتي سند نه دی.',
  },
  fa: {
    title: 'قباله آنلاین | نمونه قباله زمین و موتر',
    description:
      'وبسایت قباله آنلاین برای ساخت و چاپ نمونه قباله زمین، خانه، دکان و موتر در افغانستان. سند دولتی نیست.',
  },
  en: {
    title: 'Qabala online | Afghan deed website',
    description:
      'Qabala online: a website to make a sample Afghan deed for land, house, shop, or vehicle, then print and sign it. Not a government document.',
  },
};

const TYPE_COPY: Record<Locale, Record<DocType, { title: string; description: string }>> = {
  ps: {
    land: {
      title: 'د ځمکې قباله نمونه | جریب او بسوه',
      description:
        'د ځمکې د قبالې نمونه: ولایت، ولسوالي، حدود اربعه، جریب، بسوه، د پلار نوم او تذکره. د چاپ او لاسلیک لپاره. دولتي سند نه دی.',
    },
    house: {
      title: 'د کور قباله نمونه',
      description: 'د کور د قبالې نمونه د چاپ او لاسلیک لپاره، د حدودو، جریب او تذکرې سره. دولتي سند نه دی.',
    },
    shop: {
      title: 'د دوکان قباله نمونه',
      description: 'د دوکان د قبالې نمونه: بازار، نمبر، حدود او تذکره. د چاپ او لاسلیک لپاره. دولتي سند نه دی.',
    },
    vehicle: {
      title: 'د موټر قباله نمونه',
      description: 'د موټر د قبالې نمونه: شاسي، انجن، پلیټ او تذکره. د چاپ او لاسلیک لپاره. دولتي سند نه دی.',
    },
    garden: {
      title: 'د باغ قباله نمونه',
      description: 'د باغ د قبالې نمونه: جریب، بسوه، د اوبو حق او حدود اربعه. د چاپ او لاسلیک لپاره. دولتي سند نه دی.',
    },
  },
  fa: {
    land: {
      title: 'نمونه قباله زمین | جریب و بسوه',
      description:
        'نمونه قباله زمین برای چاپ و امضا: ولایت، ولسوالی، حدود اربعه، جریب، بسوه، نام پدر و تذکره. سند دولتی نیست.',
    },
    house: {
      title: 'نمونه قباله خانه',
      description: 'نمونه قباله خانه برای چاپ و امضا، با حدود، جریب و تذکره. سند دولتی نیست.',
    },
    shop: {
      title: 'نمونه قباله دکان',
      description: 'نمونه قباله دکان: مارکیت، نمبر، حدود و تذکره. برای چاپ و امضا. سند دولتی نیست.',
    },
    vehicle: {
      title: 'نمونه قباله موتر',
      description: 'نمونه قباله موتر: شاسی، انجن، نمبر پلیت و تذکره. برای چاپ و امضا. سند دولتی نیست.',
    },
    garden: {
      title: 'نمونه قباله باغ',
      description: 'نمونه قباله باغ: جریب، بسوه، حق آب و حدود اربعه. برای چاپ و امضا. سند دولتی نیست.',
    },
  },
  en: {
    land: {
      title: 'Sample land qabala | Jerib and biswa',
      description:
        'A sample Afghan land deed for printing and signing: province, district, four boundaries, jerib, biswa, father\'s name, and tazkira. Not a government document.',
    },
    house: {
      title: 'Sample house qabala',
      description: 'A sample Afghan house deed for printing and signing, with boundaries, jerib, and tazkira. Not a government document.',
    },
    shop: {
      title: 'Sample shop qabala',
      description: 'A sample Afghan shop deed: market, number, boundaries, and tazkira. For printing and signing. Not a government document.',
    },
    vehicle: {
      title: 'Sample vehicle qabala',
      description: 'A sample Afghan vehicle deed: chassis, engine, plate, and tazkira. For printing and signing. Not a government document.',
    },
    garden: {
      title: 'Sample garden qabala',
      description: 'A sample Afghan garden deed: jerib, biswa, water share, and four boundaries. For printing and signing. Not a government document.',
    },
  },
};

function alternates(locale: Locale, suffix = ''): Metadata['alternates'] {
  const url = (code: Locale) => `${SITE_URL}/${code}${suffix}`;
  return {
    canonical: url(locale),
    languages: {
      ps: url('ps'),
      fa: url('fa'),
      en: url('en'),
      'x-default': url('ps'),
    },
  };
}

function openGraphLocale(locale: Locale): string {
  if (locale === 'ps') return 'ps_AF';
  if (locale === 'fa') return 'fa_AF';
  return 'en_US';
}

export function buildMetadata(locale: string, docType?: DocType): Metadata {
  const code: Locale = isLocale(locale) ? locale : 'ps';
  const copy = docType ? TYPE_COPY[code][docType] : HOME[code];
  const suffix = docType ? `/${docType}` : '';
  return {
    title: copy.title,
    description: copy.description,
    alternates: alternates(code, suffix),
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SITE_URL}/${code}${suffix}`,
      siteName: 'قباله',
      locale: openGraphLocale(code),
      type: 'website',
      images: [
        {
          url: `/og-${code}.png`,
          width: 1200,
          height: 630,
          alt: code === 'en' ? 'Sample Qabala for printing and signing' : 'نمونه قباله — برای چاپ و امضا',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [`/og-${code}.png`],
    },
  };
}
