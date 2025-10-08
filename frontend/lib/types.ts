export interface ProductType {
  IDType: string;
  Type: string;
  IDParentType: string;
}

export interface Nomenclature {
  ID: string;
  IDCat: string;
  IDType: string;
  IDTypeNew: string;
  ProductionType: string;
  Name: string;
  Gost: string;
  FormOfLength: string;
  Manufacturer: string;
  SteelGrade: string;
  Diameter: number;
  PipeWallThickness: number;
  Koef: number;
  Status: string;
}

export interface Price {
  ID: string;
  IDStock: string;
  PriceT: number;
  PriceLimitT1: number;
  PriceT1: number;
  PriceLimitT2: number;
  PriceT2: number;
  PriceM: number;
  PriceLimitM1: number;
  PriceM1: number;
  PriceLimitM2: number;
  PriceM2: number;
  NDS: number;
  PriceUpdatedAt?: string;
}

export interface Remnant {
  ID: string;
  IDStock: string;
  InStockT: number;
  InStockM: number;
  AvgTubeLength: number;
  AvgTubeWeight: number;
}

export interface Stock {
  IDStock: string;
  Stock: string;
  StockName: string;
}

export interface Product extends Nomenclature {
  price?: Price[];
  remnant?: Remnant[];
  stock?: Stock[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  unit: "M" | "T";
}

export interface Order {
  firstName: string;
  lastName: string;
  inn: string;
  phone: string;
  email: string;
  items: CartItem[];
  total: number;
  discount: number;
}

export type UnitType = "M" | "T";

export interface FilterState {
  warehouse: string[];
  productType: string[];
  diameterRange: [number, number];
  thicknessRange: [number, number];
  gost: string[];
  steelGrade: string[];
  search: string;
}
