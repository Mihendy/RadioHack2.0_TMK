// src/lib/utils/data-utils.ts
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

  // Разбиваем на 4 массива
  const nomenclature = products.map((p) => ({
    id: p.ID,
    idCat: p.IDCat,
    idType: p.IDType,
    idTypeNew: p.IDTypeNew,
    productionType: p.ProductionType,
    name: p.Name,
    gost: p.Gost,
    formOfLength: p.FormOfLength,
    manufacturer: p.Manufacturer,
    steelGrade: p.SteelGrade,
    diameter: p.Diameter,
    pipeWallThickness: p.PipeWallThickness,
    status: p.Status,
    koef: p.Koef,
  }));

  const prices = products.flatMap((p) =>
  p.price!!.map((price) => ({
    ...price,
    ID: p.ID, // для совместимости со старым кодом
  }))
);

const remnants = products.flatMap((p) =>
  p.remnant!!.map((rem) => ({
    ...rem,
    ID: p.ID, // для совместимости со старым кодом
  }))
);

const stocks = Array.from(
  new Map(
    products.flatMap((p) =>
      p.price!!.map((pr) => [
        pr.IDStock,
        { IDStock: pr.IDStock, name: `Склад ${pr.IDStock}` },
      ])
    )
  ).values()
);

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
    const price = prices.find((p) => p.ID === nom.id);
    const remnant = remnants.find((r) => r.ID === nom.id);
    const stock = price
      ? stocks.find((s) => s.IDStock === price.idStock)
      : undefined;

    return {
      ...nom,
      price,
      remnant,
      stock,
    };
  });
}

/**
 * Расчёт цены с учётом скидок по количеству (тот же)
 */
export function calculatePrice(
  product: Product,
  quantity: number,
  unit: UnitType
): { basePrice: number; discountedPrice: number; discount: number } {
  if (!product.price) {
    return { basePrice: 0, discountedPrice: 0, discount: 0 };
  }

  const price = product.price;
  let unitPrice: number;
  let discountedUnitPrice: number;

const priceObj = product.price[0]; // первый объект массива
if (!priceObj) return { basePrice: 0, discountedPrice: 0, discount: 0 };

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
