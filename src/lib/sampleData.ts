import type { DocType, QabalaFormData } from './types';
import { formatShamsiNumeric } from './hijri';

const sampleDate = formatShamsiNumeric(new Date());

const SELLER = {
  fullName: 'عبدالستار محمدزی',
  fatherName: 'غلام محمد',
  grandfatherName: 'عبدالحکیم',
  tazkiraNumber: '۱۴۰۳-۲۸۵-۰۰۱',
};

const BUYER = {
  fullName: 'محمد اسحاق احمدزی',
  fatherName: 'نور احمد',
  grandfatherName: 'حاجی محمد',
  tazkiraNumber: '۱۴۰۳-۱۱۷-۰۰۲',
};

const WITNESS1 = {
  fullName: 'نصرالله کریمی',
  fatherName: 'غلام حیدر',
};

const WITNESS2 = {
  fullName: 'محمد طاهر احمدی',
  fatherName: 'عبدالرزاق',
};

const COMMON = {
  documentNumber: '۱۴۰۳/۱۲۵',
  date: sampleDate,
  amount: '4500000',
  amountWords: 'څلور میلیونه او پنځه سوه زره افغانۍ',
  currency: 'افغانی',
  sellers: [SELLER],
  buyers: [BUYER],
  witnesses: [WITNESS1, WITNESS2],
  declarationText: '',
};

export const SAMPLE_DATA: Record<DocType, QabalaFormData> = {
  land: {
    ...COMMON,
    notes: 'زمین متذکره دارای ۵۰ اصله درخت میوه‌دار و یک حلقه چاه آب می‌باشد.',
    property: {
      province: 'کابل',
      district: 'دهمزنگ',
      village: 'باغبانان',
      blockNumber: 'B-۱۴',
      lotNumber: '۲۰۵',
      area: '۶۰۰',
      areaUnit: 'متر مربع',
      areaJerib: '0',
      areaBiswa: '6',
      landType: 'مسکونی',
      previousDeedNumber: '',
      boundaryNorth: 'سرک عمومی به عرض ۸ متر',
      boundarySouth: 'زمین حاجی کریم — دیوار مشترک',
      boundaryEast: 'نهر کوچه به عرض ۴ متر',
      boundaryWest: 'زمین محمد اکبر — دیوار',
    },
  },
  house: {
    ...COMMON,
    notes: '',
    property: {
      province: 'کابل',
      district: 'خیرخانه',
      village: 'بلاک ۵',
      blockNumber: 'C-۷',
      lotNumber: '۸۸',
      area: '۳۵۰',
      areaUnit: 'متر مربع',
      areaJerib: '0',
      areaBiswa: '3',
      landType: 'مسکونی',
      previousDeedNumber: '',
      rooms: '6',
      floors: '2',
      yearBuilt: '1395',
      boundaryNorth: 'خانه احمد گل — دیوار مشترک',
      boundarySouth: 'سرک فرعی به عرض ۶ متر',
      boundaryEast: 'خانه نور محمد — دیوار',
      boundaryWest: 'پارک محله‌ای',
    },
  },
  shop: {
    ...COMMON,
    notes: '',
    property: {
      province: 'کابل',
      district: 'شهرنو',
      village: 'بازار تجارتی',
      marketName: 'مارکیت سرگردان',
      shopNumber: '۴۲',
      floor: 'همکف',
      area: '۴۸',
      areaUnit: 'متر مربع',
      boundaryNorth: 'دکان شماره ۴۳ — دیوار مشترک',
      boundarySouth: 'راهرو اصلی مارکیت',
      boundaryEast: 'دکان شماره ۴۱ — دیوار مشترک',
      boundaryWest: 'دیوار بیرونی مارکیت',
    },
  },
  vehicle: {
    ...COMMON,
    notes: '',
    property: {
      vehicleType: 'سواری',
      make: 'Toyota',
      model: 'Corolla',
      year: '2018',
      color: 'سفید',
      plateNumber: 'ک-۱۲-۳۴۵',
      chassisNumber: 'JT2BF12K0X0123456',
      engineNumber: '4AFE123456',
      trafficRegNumber: 'ترافیک-۵۶۷۸۹',
    },
  },
  garden: {
    ...COMMON,
    notes: 'زمین متذکره دارای ۵۰ اصله درخت میوه‌دار و یک حلقه چاه آب می‌باشد.',
    property: {
      province: 'پروان',
      district: 'جبل السراج',
      village: 'قلعه حیدر',
      blockNumber: 'A-۱',
      lotNumber: '۱۲',
      area: '۴۰۰۰',
      areaUnit: 'متر مربع',
      areaJerib: '2',
      areaBiswa: '0',
      landType: 'باغداری',
      previousDeedNumber: '',
      treeCount: '۱۵۰',
      waterSource: 'نهر اصلی',
      waterShare: 'سه شبانه روز',
      boundaryNorth: 'باغ عبدالرحمان — دیوار و نهر',
      boundarySouth: 'سرک عمومی به عرض ۶ متر',
      boundaryEast: 'زمین حاجی اسدالله',
      boundaryWest: 'نهر آبیاری',
    },
  },
};
