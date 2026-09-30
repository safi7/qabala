export type Language = 'dari' | 'pashto' | 'english';
export type DocType = 'land' | 'house' | 'shop' | 'vehicle' | 'garden';

export interface Person {
  fullName: string;
  fatherName: string;
  grandfatherName: string;
  tazkiraNumber: string;
}

export interface Witness {
  fullName: string;
  fatherName: string;
}

export interface LandProperty {
  province: string;
  district: string;
  village: string;
  blockNumber: string;
  lotNumber: string;
  area: string;
  areaUnit: string;
  areaJerib?: string;
  areaBiswa?: string;
  landType: string;
  previousDeedNumber: string;
  boundaryNorth: string;
  boundarySouth: string;
  boundaryEast: string;
  boundaryWest: string;
}

export interface HouseProperty extends LandProperty {
  floors: string;
  rooms: string;
  yearBuilt: string;
}

export interface ShopProperty {
  province: string;
  district: string;
  village: string;
  marketName: string;
  shopNumber: string;
  floor: string;
  area: string;
  areaUnit: string;
  areaJerib?: string;
  areaBiswa?: string;
  boundaryNorth: string;
  boundarySouth: string;
  boundaryEast: string;
  boundaryWest: string;
}

export interface VehicleProperty {
  vehicleType: string;
  make: string;
  model: string;
  year: string;
  color: string;
  chassisNumber: string;
  engineNumber: string;
  plateNumber: string;
  trafficRegNumber: string;
}

export interface GardenProperty extends LandProperty {
  waterSource: string;
  waterShare: string;
  treeCount: string;
}

export type PropertyData =
  | LandProperty
  | HouseProperty
  | ShopProperty
  | VehicleProperty
  | GardenProperty;

export interface QabalaFormData {
  documentNumber: string;
  date: string;
  sellers: Person[];
  buyers: Person[];
  property: PropertyData;
  amount: string;
  amountWords: string;
  currency: string;
  witnesses: Witness[];
  declarationText: string;
  notes: string;
}
