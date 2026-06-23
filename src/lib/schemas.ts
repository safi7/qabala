import { z } from 'zod';
import type { DocType } from './types';

const personShape = {
  fullName: z.string().min(2),
  fatherName: z.string().min(2),
  grandfatherName: z.string().min(2),
  tazkiraNumber: z.string().min(1),
};

const witnessShape = {
  fullName: z.string().min(2),
  fatherName: z.string().min(2),
};

const locationShape = {
  province: z.string().min(1),
  district: z.string().min(2),
  village: z.string().min(2),
};

const boundaryShape = {
  boundaryNorth: z.string().min(2),
  boundarySouth: z.string().min(2),
  boundaryEast: z.string().min(2),
  boundaryWest: z.string().min(2),
};

const landPropertySchema = z.object({
  ...locationShape,
  ...boundaryShape,
  blockNumber: z.string().optional().default(''),
  lotNumber: z.string().optional().default(''),
  area: z.string().min(1),
  areaUnit: z.string().min(1),
  landType: z.string().min(1),
  previousDeedNumber: z.string().optional().default(''),
});

const housePropertySchema = z.object({
  ...locationShape,
  ...boundaryShape,
  blockNumber: z.string().optional().default(''),
  lotNumber: z.string().optional().default(''),
  area: z.string().min(1),
  areaUnit: z.string().min(1),
  landType: z.string().min(1),
  previousDeedNumber: z.string().optional().default(''),
  floors: z.string().min(1),
  rooms: z.string().min(1),
  yearBuilt: z.string().min(4),
});

const shopPropertySchema = z.object({
  ...locationShape,
  ...boundaryShape,
  marketName: z.string().min(2),
  shopNumber: z.string().min(1),
  floor: z.string().min(1),
  area: z.string().min(1),
  areaUnit: z.string().min(1),
});

const vehiclePropertySchema = z.object({
  vehicleType: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.string().min(4),
  color: z.string().min(1),
  chassisNumber: z.string().min(4),
  engineNumber: z.string().min(4),
  plateNumber: z.string().min(3),
  trafficRegNumber: z.string().min(1),
});

const gardenPropertySchema = z.object({
  ...locationShape,
  ...boundaryShape,
  blockNumber: z.string().optional().default(''),
  lotNumber: z.string().optional().default(''),
  area: z.string().min(1),
  areaUnit: z.string().min(1),
  landType: z.string().min(1),
  previousDeedNumber: z.string().optional().default(''),
  waterSource: z.string().min(2),
  waterShare: z.string().min(1),
  treeCount: z.string().min(1),
});

const transactionShape = {
  documentNumber: z.string().min(1),
  date: z.string().min(1),
  amount: z.string().min(1),
  amountWords: z.string().min(2),
  currency: z.string().min(1),
};

function buildSchema(propertySchema: z.ZodTypeAny) {
  return z.object({
    ...transactionShape,
    sellers: z.array(z.object(personShape)).min(1),
    buyers: z.array(z.object(personShape)).min(1),
    property: propertySchema,
    witnesses: z.array(z.object(witnessShape)).min(2).max(4),
    declarationText: z.string(),
    notes: z.string().optional().default(''),
  });
}

export const schemas: Record<DocType, z.ZodTypeAny> = {
  land: buildSchema(landPropertySchema),
  house: buildSchema(housePropertySchema),
  shop: buildSchema(shopPropertySchema),
  vehicle: buildSchema(vehiclePropertySchema),
  garden: buildSchema(gardenPropertySchema),
};

export const STEP_FIELDS: Record<number, string[]> = {
  0: ['sellers'],
  1: ['buyers'],
  2: ['documentNumber','date','property.province','property.district','property.village','property.area','property.areaUnit','property.boundaryNorth','property.boundarySouth','property.boundaryEast','property.boundaryWest','amount','amountWords','currency'],
  3: ['witnesses','declarationText'],
};
