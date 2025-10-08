"use client"

import { useState } from "react"
import type { Product, UnitType } from "@/lib/types"
import { useCart } from "@/lib/contexts/cart-context"
import { calculatePrice, formatPrice, formatQuantity } from "@/lib/utils/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PipeBadge } from "@/components/ui/pipe-badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Plus, Minus, TrendingUp, TrendingDown, Package, Ruler, Weight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ProductDetailViewProps {
  product: Product
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState<UnitType>("M")

  const { price, remnant, stock } = product
  const hasStock = remnant && (remnant.InStockT > 0 || remnant.InStockM > 0)

  const { basePrice, discountedPrice, discount } = price
    ? calculatePrice(product, quantity, unit)
    : { basePrice: 0, discountedPrice: 0, discount: 0 }

  const priceChange = Math.random() > 0.5 ? "up" : "down"

  const handleAddToCart = () => {
    addItem(product, quantity, unit)
    toast({
      title: "Добавлено в корзину",
      description: `${product.Name} - ${formatQuantity(quantity, unit)}`,
    })
  }

  const handleBuyNow = () => {
    addItem(product, quantity, unit)
    router.push("/cart")
  }

  const handleIncrement = () => {
    setQuantity((prev) => prev + (unit === "M" ? 1 : 0.1))
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(unit === "M" ? 1 : 0.1, prev - (unit === "M" ? 1 : 0.1)))
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6 pb-32 lg:pb-28">
      {/* Product header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product.Name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Артикул: {product.ID}</p>
          </div>
          {hasStock ? (
            <Badge variant="outline" className="border-green-500/50 text-green-500 shrink-0">
              В наличии
            </Badge>
          ) : (
            <Badge variant="outline" className="border-destructive/50 text-destructive shrink-0">
              Нет в наличии
            </Badge>
          )}
        </div>

        {/* Price section */}
        {price && (
          <div className="rounded-lg border bg-card p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Цена за метр</p>
                <p className="text-3xl font-bold">{formatPrice(price.PriceM)}</p>
                {discount > 0 && unit === "M" && (
                  <p className="mt-1 text-sm text-green-500">Скидка: -{formatPrice(discount / quantity)}/м</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Цена за тонну</p>
                <p className="text-3xl font-bold">{formatPrice(price.PriceT)}</p>
                {discount > 0 && unit === "T" && (
                  <p className="mt-1 text-sm text-green-500">Скидка: -{formatPrice(discount / quantity)}/т</p>
                )}
              </div>
            </div>

            {/* Price change indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm flex-wrap">
              {priceChange === "up" ? (
                <>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">Цена выросла</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Цена снизилась</span>
                </>
              )}
              <span className="text-muted-foreground">
                • Обновлено {new Date(price.PriceUpdatedAt || "").toLocaleDateString("ru-RU")}
              </span>
            </div>

            {/* Discount tiers */}
            <div className="mt-4 space-y-2 rounded-md bg-[#EE742D]/10 p-3 sm:p-4">
              <p className="text-sm sm:text-base font-semibold text-[#EE742D]">
                Проверить наличие скидок можно после оформления заказа
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg sm:text-xl font-bold">Характеристики</h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary/50 p-2">
              <Ruler className="h-5 w-5 text-[#EE742D]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Диаметр</p>
              <p className="font-semibold">{product.Diameter} мм</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary/50 p-2">
              <Ruler className="h-5 w-5 text-[#EE742D]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Толщина стенки</p>
              <p className="font-semibold">{product.PipeWallThickness} мм</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary/50 p-2">
              <Weight className="h-5 w-5 text-[#EE742D]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Коэффициент т/м</p>
              <p className="font-semibold">{product.Koef.toFixed(5)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary/50 p-2">
              <Package className="h-5 w-5 text-[#EE742D]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ГОСТ</p>
              <p className="font-semibold">{product.Gost}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary/50 p-2">
              <Package className="h-5 w-5 text-[#EE742D]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Марка стали</p>
              <p className="font-semibold">{product.SteelGrade}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary/50 p-2">
              <Package className="h-5 w-5 text-[#EE742D]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Производитель</p>
              <p className="font-semibold">{product.Manufacturer}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
          <PipeBadge variant="outline">{product.ProductionType}</PipeBadge>
          <PipeBadge variant="outline">{product.FormOfLength}</PipeBadge>
          <PipeBadge variant="outline">Категория: {product.IDCat}</PipeBadge>
        </div>
      </div>

      {/* Stock info */}
      {remnant && stock && (
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-lg sm:text-xl font-bold">Наличие на складе</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Склад</p>
              <p className="font-semibold">{stock.StockName}</p>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">В наличии (метры)</p>
                <p className="text-2xl font-bold text-[#EE742D]">{formatQuantity(remnant.InStockM, "M")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">В наличии (тонны)</p>
                <p className="text-2xl font-bold text-[#EE742D]">{formatQuantity(remnant.InStockT, "T")}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Средняя длина трубы</p>
                <p className="font-semibold">{remnant.AvgTubeLength.toFixed(1)} м</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Средний вес трубы</p>
                <p className="font-semibold">{remnant.AvgTubeWeight.toFixed(4)} т</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to cart section */}
      <div className="fixed bottom-16 left-0 right-0 z-40 lg:bottom-0">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-t-lg lg:rounded-lg border bg-card/95 backdrop-blur-sm p-3 sm:p-4 shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Quantity controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrement}
                  className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent shrink-0"
                >
                  <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(unit === "M" ? 1 : 0.1, Number.parseFloat(e.target.value) || 0))
                  }
                  className="h-8 w-16 sm:h-9 sm:w-20 text-center text-sm"
                  step={unit === "M" ? "1" : "0.1"}
                  min={unit === "M" ? "1" : "0.1"}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrement}
                  className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>

              {/* Unit selector */}
              <Select value={unit} onValueChange={(v) => setUnit(v as UnitType)}>
                <SelectTrigger className="w-20 sm:w-24 h-8 sm:h-9 text-xs sm:text-sm shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Метры</SelectItem>
                  <SelectItem value="T">Тонны</SelectItem>
                </SelectContent>
              </Select>

              {/* Price display */}
              <div className="flex-1 min-w-[100px] text-right">
                <div className="text-base sm:text-lg font-bold text-[#EE742D]">{formatPrice(discountedPrice)}</div>
                {discount > 0 && (
                  <div className="text-[10px] sm:text-xs text-muted-foreground line-through">
                    {formatPrice(basePrice)}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-1.5 sm:gap-2 shrink-0">
                <Button
                  onClick={handleAddToCart}
                  disabled={!hasStock}
                  variant="outline"
                  size="sm"
                  className="bg-transparent h-8 sm:h-9 px-2 sm:px-3"
                >
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline text-xs sm:text-sm">В корзину</span>
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!hasStock}
                  size="sm"
                  className="bg-[#EE742D] hover:bg-[#EE742D]/90 text-white shadow-lg shadow-[#EE742D]/20 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm"
                >
                  Купить
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
