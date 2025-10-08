import type { Product, UnitType } from "../types"
import { mockNomenclature, mockPrices, mockRemnants, mockStocks } from "../mock-data"

// Merge nomenclature with prices, remnants, and stocks to create full products
export function getProducts(): Product[] {
  return mockNomenclature.map((nom) => {
    const price = mockPrices.find((p) => p.ID === nom.ID)
    const remnant = mockRemnants.find((r) => r.ID === nom.ID)
    const stock = price ? mockStocks.find((s) => s.IDStock === price.IDStock) : undefined

    return {
      ...nom,
      price,
      remnant,
      stock,
    }
  })
}

// Calculate price with discount based on quantity
export function calculatePrice(
  product: Product,
  quantity: number,
  unit: UnitType,
): { basePrice: number; discountedPrice: number; discount: number } {
  if (!product.price) {
    return { basePrice: 0, discountedPrice: 0, discount: 0 }
  }

  const price = product.price
  let unitPrice: number
  let discountedUnitPrice: number

  if (unit === "T") {
    unitPrice = price.PriceT
    if (quantity >= price.PriceLimitT2) {
      discountedUnitPrice = price.PriceT2
    } else if (quantity >= price.PriceLimitT1) {
      discountedUnitPrice = price.PriceT1
    } else {
      discountedUnitPrice = price.PriceT
    }
  } else {
    unitPrice = price.PriceM
    if (quantity >= price.PriceLimitM2) {
      discountedUnitPrice = price.PriceM2
    } else if (quantity >= price.PriceLimitM1) {
      discountedUnitPrice = price.PriceM1
    } else {
      discountedUnitPrice = price.PriceM
    }
  }

  const basePrice = unitPrice * quantity
  const discountedPrice = discountedUnitPrice * quantity
  const discount = basePrice - discountedPrice

  return { basePrice, discountedPrice, discount }
}

// Convert between meters and tons
export function convertUnits(quantity: number, fromUnit: UnitType, toUnit: UnitType, koef: number): number {
  if (fromUnit === toUnit) return quantity
  if (fromUnit === "M" && toUnit === "T") {
    return quantity * koef
  }
  if (fromUnit === "T" && toUnit === "M") {
    return quantity / koef
  }
  return quantity
}

// Format price with thousands separator
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Format quantity with unit
export function formatQuantity(quantity: number, unit: UnitType): string {
  return `${quantity.toFixed(2)} ${unit === "M" ? "м" : "т"}`
}

// Get unique values for filters
export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const values = items.map((item) => String(item[key])).filter(Boolean)
  return Array.from(new Set(values)).sort()
}

// Get min/max values for range filters
export function getRange(items: Product[], key: "Diameter" | "PipeWallThickness"): [number, number] {
  const values = items.map((item) => item[key]).filter((v) => v > 0)
  if (values.length === 0) return [0, 100]
  return [Math.min(...values), Math.max(...values)]
}
