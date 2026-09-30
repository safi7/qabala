import { z } from 'zod';
import type { DocType, Language } from './types';
import { translations } from './translations';

function messages(lang: Language) {
  return translations[lang].validation;
}

function text(min: number, lang: Language) {
  const v = messages(lang);
  if (min <= 1) return z.string().min(1, v.required);
  if (min === 2) return z.string().min(2, v.minLen2);
  return z.string().min(min, v.tooShort);
}

function personShape(lang: Language) {
  return {
    fullName: text(2, lang),
    fatherName: text(2, lang),
    grandfatherName: text(2, lang),
    tazkiraNumber: text(1, lang),
  };
}

function witnessShape(lang: Language) {
  return {
    fullName: text(2, lang),
    fatherName: text(2, lang),
  };
}

function locationShape(lang: Language) {
  return {
    province: text(1, lang),
    district: text(2, lang),
    village: text(2, lang),
  };
}

function boundaryShape(lang: Language) {
  return {
    boundaryNorth: text(2, lang),
    boundarySouth: text(2, lang),
    boundaryEast: text(2, lang),
    boundaryWest: text(2, lang),
  };
}

function areaShape(lang: Language) {
  return {
    area: text(1, lang),
    areaUnit: text(1, lang),
    areaJerib: z.string().optional().default(''),
    areaBiswa: z.string().optional().default(''),
  };
}

function landPropertySchema(lang: Language) {
  return z.object({
    ...locationShape(lang),
    ...boundaryShape(lang),
    ...areaShape(lang),
    blockNumber: z.string().optional().default(''),
    lotNumber: z.string().optional().default(''),
    landType: text(1, lang),
    previousDeedNumber: z.string().optional().default(''),
  });
}

function housePropertySchema(lang: Language) {
  return landPropertySchema(lang).extend({
    floors: text(1, lang),
    rooms: text(1, lang),
    yearBuilt: text(4, lang),
  });
}

function shopPropertySchema(lang: Language) {
  return z.object({
    ...locationShape(lang),
    ...boundaryShape(lang),
    ...areaShape(lang),
    marketName: text(2, lang),
    shopNumber: text(1, lang),
    floor: text(1, lang),
  });
}

function vehiclePropertySchema(lang: Language) {
  return z.object({
    vehicleType: text(1, lang),
    make: text(1, lang),
    model: text(1, lang),
    year: text(4, lang),
    color: text(1, lang),
    chassisNumber: text(4, lang),
    engineNumber: text(4, lang),
    plateNumber: text(3, lang),
    trafficRegNumber: text(1, lang),
  });
}

function gardenPropertySchema(lang: Language) {
  return landPropertySchema(lang).extend({
    waterSource: text(2, lang),
    waterShare: text(1, lang),
    treeCount: text(1, lang),
  });
}

function buildSchema(propertySchema: z.ZodType, lang: Language) {
  const v = messages(lang);
  return z.object({
    documentNumber: text(1, lang),
    date: text(1, lang),
    amount: text(1, lang),
    amountWords: text(2, lang),
    currency: text(1, lang),
    sellers: z.array(z.object(personShape(lang))).min(1, v.required),
    buyers: z.array(z.object(personShape(lang))).min(1, v.required),
    property: propertySchema,
    witnesses: z.array(z.object(witnessShape(lang))).min(2, v.minWitnesses).max(4),
    declarationText: z.string(),
    notes: z.string().optional().default(''),
  });
}

export function getSchema(docType: DocType, lang: Language) {
  const property = {
    land: landPropertySchema(lang),
    house: housePropertySchema(lang),
    shop: shopPropertySchema(lang),
    vehicle: vehiclePropertySchema(lang),
    garden: gardenPropertySchema(lang),
  }[docType];
  return buildSchema(property, lang);
}

const TRANSACTION = ['documentNumber', 'date', 'amount', 'amountWords', 'currency'];
const LOCATION = [
  'property.province',
  'property.district',
  'property.village',
  'property.boundaryNorth',
  'property.boundarySouth',
  'property.boundaryEast',
  'property.boundaryWest',
  'property.area',
  'property.areaUnit',
];

export function fieldsForStep(docType: DocType, step: number): string[] {
  if (step === 0) return ['sellers'];
  if (step === 1) return ['buyers'];
  if (step === 3) return ['witnesses', 'declarationText'];
  if (step !== 2) return [];
  if (docType === 'vehicle') {
    return [
      ...TRANSACTION,
      'property.vehicleType',
      'property.make',
      'property.model',
      'property.year',
      'property.color',
      'property.chassisNumber',
      'property.engineNumber',
      'property.plateNumber',
      'property.trafficRegNumber',
    ];
  }
  if (docType === 'shop') {
    return [...TRANSACTION, ...LOCATION, 'property.marketName', 'property.shopNumber', 'property.floor'];
  }
  const land = [...TRANSACTION, ...LOCATION, 'property.landType'];
  if (docType === 'house') return [...land, 'property.floors', 'property.rooms', 'property.yearBuilt'];
  if (docType === 'garden') return [...land, 'property.waterSource', 'property.waterShare', 'property.treeCount'];
  return land;
}
