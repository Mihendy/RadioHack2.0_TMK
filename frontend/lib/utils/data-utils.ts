import type { Product, UnitType } from "../types";

/**
 * Получение и разложение данных с /api/products на 4 массива:
 * nomenclature, prices, remnants, stocks
 */
export async function fetchAndSplitProducts() {
  const res = await fetch("/api/products", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Ошибка загрузки продуктов:", res.status, res.statusText);
    return {
      nomenclature: [],
      prices: [],
      remnants: [],
      stocks: [],
    };
  }

  const products = (await res.json()) as Product[];

  // Разбиваем на 4 массива с правильными ключами
  const nomenclature = products.map((p) => ({
    ID: p.id,
    idCat: p.idCat,
    idType: p.idType,
    idTypeNew: p.idTypeNew,
    ProductionType: p.productionType,
    Name: p.name,
    Gost: p.gost,
    FormOfLength: p.formOfLength,
    Manufacturer: p.manufacturer,
    SteelGrade: p.steelGrade,
    Diameter: p.diameter,
    PipeWallThickness: p.pipeWallThickness,
    Status: p.status,
    Koef: p.koef,
  }));

  const prices = products.flatMap((p) =>
    p.prices?.map((pr) => ({
      ...pr,
      ID: p.id,
      PriceM: pr.priceM,
      PriceT: pr.priceT,
      PriceM1: pr.priceM1,
      PriceT1: pr.priceT1,
      PriceM2: pr.priceM2,
      PriceT2: pr.priceT2,
      PriceLimitM1: pr.priceLimitM1,
      PriceLimitT1: pr.priceLimitT1,
      PriceLimitM2: pr.priceLimitM2,
      PriceLimitT2: pr.priceLimitT2,
      PriceUpdatedAt: pr.priceUpdatedAt,
      IDStock: pr.idStock,
    })) || []
  );

  const remnants = products.flatMap((p) =>
    p.remnants?.map((r) => ({
      ...r,
      ID: p.id,
      InStockM: r.inStockM,
      InStockT: r.inStockT,
    })) || []
  );

  // Получаем актуальные склады с ручки /api/warehouses
  const stocksRes = await fetch("/api/warehouses", { cache: "no-store" });
  const warehouses = stocksRes.ok ? await stocksRes.json() : [];
  const stocks = warehouses.map((w: any) => ({
    IDStock: w.idStock,
    Stock: w.Stock,
    StockName: w.stockName,
    Address: w.address,
    Schedule: w.schedule,
  }));

  return { nomenclature, prices, remnants, stocks };
}

/**
 * Собираем продукты в старом формате из разобранных массивов
 */
export function buildProducts({
  nomenclature,
  prices,
  remnants,
  stocks,
}: {
  nomenclature: any[];
  prices: any[];
  remnants: any[];
  stocks: any[];
}) {
  return nomenclature.map((nom) => {
    const price = prices.find((p) => p.ID === nom.ID);
    const remnant = remnants.find((r) => r.ID === nom.ID);
    const stock = price ? stocks.find((s) => s.IDStock === price.IDStock) : undefined;

    return {
      ...nom,
      price,
      remnant,
      stock,
    };
  });
}

/**
 * Расчёт цены с учётом скидок по количеству
 */
export function calculatePrice(
  product: Product,
  quantity: number,
  unit: UnitType
): { basePrice: number; discountedPrice: number; discount: number } {
  if (!product.price) return { basePrice: 0, discountedPrice: 0, discount: 0 };

  const priceObj = product.price[0];
  if (!priceObj) return { basePrice: 0, discountedPrice: 0, discount: 0 };

  let unitPrice: number;
  let discountedUnitPrice: number;

  if (unit === "T") {
    unitPrice = priceObj.PriceT;
    if (quantity >= priceObj.PriceLimitT2) discountedUnitPrice = priceObj.PriceT2;
    else if (quantity >= priceObj.PriceLimitT1) discountedUnitPrice = priceObj.PriceT1;
    else discountedUnitPrice = priceObj.PriceT;
  } else {
    unitPrice = priceObj.PriceM;
    if (quantity >= priceObj.PriceLimitM2) discountedUnitPrice = priceObj.PriceM2;
    else if (quantity >= priceObj.PriceLimitM1) discountedUnitPrice = priceObj.PriceM1;
    else discountedUnitPrice = priceObj.PriceM;
  }

  const basePrice = unitPrice * quantity;
  const discountedPrice = discountedUnitPrice * quantity;
  const discount = basePrice - discountedPrice;

  return { basePrice, discountedPrice, discount };
}

// Остальные утилиты оставляем без изменений
export function convertUnits(
  quantity: number,
  fromUnit: UnitType,
  toUnit: UnitType,
  koef: number
): number {
  if (fromUnit === toUnit) return quantity;
  if (fromUnit === "M" && toUnit === "T") return quantity * koef;
  if (fromUnit === "T" && toUnit === "M") return quantity / koef;
  return quantity;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatQuantity(quantity: number, unit: UnitType): string {
  return `${quantity.toFixed(2)} ${unit === "M" ? "м" : "т"}`;
}

export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const values = items.map((item) => String(item[key])).filter(Boolean);
  return Array.from(new Set(values)).sort();
}

export function getRange(
  items: Product[],
  key: "diameter" | "pipeWallThickness"
): [number, number] {
  const values = items.map((item) => item[key]).filter((v) => v > 0);
  if (values.length === 0) return [0, 100];
  return [Math.min(...values), Math.max(...values)];
}

// data-utils.ts
export async function getProducts() {
  const { nomenclature, prices, remnants, stocks } = await fetchAndSplitProducts();
  return buildProducts({ nomenclature, prices, remnants, stocks });
}
