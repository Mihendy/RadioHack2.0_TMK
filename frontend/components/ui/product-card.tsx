"use client"

import type { Product } from "@/lib/types"
import { formatPrice, formatQuantity } from "@/lib/utils/data-utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { price, remnant, stock } = product
  const hasStock = remnant && (remnant.InStockT > 0 || remnant.InStockM > 0)

  // Mock price change indicator (in real app, compare with previous price)
  const priceChange = Math.random() > 0.5 ? "up" : "down"

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:shadow-[#EE742D]/10 flex flex-col h-full">
      {/* Metallic texture overlay */}
      <div className="absolute inset-0 opacity-5 metal-texture pointer-events-none" />

      <Link href={`/product/${product.ID}`} className="block p-3 sm:p-4 flex-1">
        <div className="space-y-2 sm:space-y-3">
          {/* Header with badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold leading-tight group-hover:text-[#EE742D] transition-colors line-clamp-2">
                {product.Name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{product.Manufacturer}</p>
            </div>
            {hasStock ? (
              <Badge variant="outline" className="border-green-500/50 text-green-500 text-xs shrink-0">
                В наличии
              </Badge>
            ) : (
              <Badge variant="outline" className="border-destructive/50 text-destructive text-xs shrink-0">
                Нет
              </Badge>
            )}
          </div>

          {/* Specifications - pipe style */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-secondary/50 p-2">
              <p className="text-xs text-muted-foreground">Диаметр</p>
              <p className="text-xs sm:text-sm font-semibold">{product.Diameter} мм</p>
            </div>
            <div className="rounded-md bg-secondary/50 p-2">
              <p className="text-xs text-muted-foreground">Толщина</p>
              <p className="text-xs sm:text-sm font-semibold">{product.PipeWallThickness} мм</p>
            </div>
          </div>

          {/* Additional specs */}
          <div className="flex flex-wrap gap-1 sm:gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-secondary/30 px-2 py-0.5 sm:py-1 truncate">{product.SteelGrade}</span>
            <span className="rounded bg-secondary/30 px-2 py-0.5 sm:py-1 truncate">{product.Gost}</span>
          </div>

          {/* Stock info */}
          {remnant && hasStock && (
            <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
              <span className="text-muted-foreground">
                {formatQuantity(remnant.InStockM, "M")} / {formatQuantity(remnant.InStockT, "T")}
              </span>
              {stock && <span className="text-muted-foreground">• {stock.Stock}</span>}
            </div>
          )}

          {/* Price section */}
          {price && (
            <div className="space-y-2 border-t pt-2 sm:pt-3">
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">За метр</p>
                  <p className="text-base sm:text-lg font-bold truncate">{formatPrice(price.PriceM)}</p>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-xs text-muted-foreground">За тонну</p>
                  <p className="text-base sm:text-lg font-bold truncate">{formatPrice(price.PriceT)}</p>
                </div>
              </div>

              {/* Price change indicator */}
              <div className="flex items-center gap-1 text-xs flex-wrap">
                {priceChange === "up" ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-red-500 shrink-0" />
                    <span className="text-red-500">Выросла</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-green-500 shrink-0" />
                    <span className="text-green-500">Снизилась</span>
                  </>
                )}
                <span className="text-muted-foreground truncate">
                  • {new Date(price.PriceUpdatedAt || "").toLocaleDateString("ru-RU")}
                </span>
              </div>

              {/* Discount info */}
              {price.PriceLimitM1 > 0 && (
                <div className="rounded-md bg-[#EE742D]/10 p-2 text-xs">
                  <p className="font-medium text-[#EE742D] line-clamp-1">
                    Скидки: от {price.PriceLimitM1}м или {price.PriceLimitT1}т
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Add to cart button */}
      <div className="border-t p-2 sm:p-3 mt-auto">
        <Button
          onClick={(e) => {
            e.preventDefault()
            onAddToCart?.()
          }}
          disabled={!hasStock}
          size="sm"
          className={cn(
            "w-full h-9 sm:h-10 text-xs sm:text-sm",
            hasStock &&
              "bg-[#EE742D] hover:bg-[#EE742D]/90 text-white shadow-lg shadow-[#EE742D]/20 transition-all hover:shadow-[#EE742D]/30",
          )}
        >
          <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          {hasStock ? "В корзину" : "Нет в наличии"}
        </Button>
      </div>
    </div>
  )
}
