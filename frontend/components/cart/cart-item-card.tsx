"use client"

import type { CartItem, UnitType } from "@/lib/types"
import { useCart } from "@/lib/contexts/cart-context"
import { calculatePrice, formatPrice, convertUnits } from "@/lib/utils/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeItem, updateQuantity, updateUnit } = useCart()
  const [localQuantity, setLocalQuantity] = useState(item.quantity.toString())

  const { product, quantity, unit } = item
  const { basePrice, discountedPrice, discount } = calculatePrice(product, quantity, unit)

  const handleQuantityChange = (newQuantity: string) => {
    setLocalQuantity(newQuantity)
    const parsed = Number.parseFloat(newQuantity)
    if (!isNaN(parsed) && parsed > 0) {
      updateQuantity(product.ID, parsed)
    }
  }

  const handleIncrement = () => {
    const newQty = quantity + (unit === "M" ? 1 : 0.1)
    setLocalQuantity(newQty.toFixed(unit === "M" ? 0 : 1))
    updateQuantity(product.ID, newQty)
  }

  const handleDecrement = () => {
    const newQty = Math.max(unit === "M" ? 1 : 0.1, quantity - (unit === "M" ? 1 : 0.1))
    setLocalQuantity(newQty.toFixed(unit === "M" ? 0 : 1))
    updateQuantity(product.ID, newQty)
  }

  const handleUnitChange = (newUnit: UnitType) => {
    const converted = convertUnits(quantity, unit, newUnit, product.Koef)
    setLocalQuantity(converted.toFixed(newUnit === "M" ? 0 : 2))
    updateQuantity(product.ID, converted)
    updateUnit(product.ID, newUnit)
  }

  return (
    <div className="relative overflow-hidden rounded-lg border bg-card p-3 sm:p-4">
      {/* Metallic texture */}
      <div className="absolute inset-0 opacity-5 metal-texture pointer-events-none" />

      <div className="relative space-y-3 sm:space-y-4">
        {/* Product info */}
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-1 space-y-2 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">{product.Name}</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2 text-xs text-muted-foreground">
              <span className="rounded bg-secondary/30 px-2 py-0.5">{product.Diameter} мм</span>
              <span className="rounded bg-secondary/30 px-2 py-0.5">{product.PipeWallThickness} мм</span>
              <span className="rounded bg-secondary/30 px-2 py-0.5">{product.SteelGrade}</span>
            </div>
            {product.stock && (
              <p className="text-xs text-muted-foreground truncate">Склад: {product.stock.StockName}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(product.ID)}
            className="text-destructive h-8 w-8 sm:h-9 sm:w-9 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Input
              type="number"
              value={localQuantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="h-8 w-16 sm:h-9 sm:w-20 text-center text-sm"
              step={unit === "M" ? "1" : "0.1"}
              min={unit === "M" ? "1" : "0.1"}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <Select value={unit} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-24 sm:w-28 h-8 sm:h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Метры</SelectItem>
              <SelectItem value="T">Тонны</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price info */}
        <div className="space-y-2 border-t pt-3">
          <div className="flex items-baseline justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Цена за {unit === "M" ? "метр" : "тонну"}:</span>
            <span className="font-semibold">
              {formatPrice(unit === "M" ? product.price!.PriceM : product.price!.PriceT)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-baseline justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Скидка:</span>
              <span className="font-semibold text-green-500">-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="flex items-baseline justify-between text-base sm:text-lg">
            <span className="font-semibold">Итого:</span>
            <div className="text-right">
              {discount > 0 && (
                <div className="text-xs sm:text-sm text-muted-foreground line-through">{formatPrice(basePrice)}</div>
              )}
              <div className="font-bold text-[#ff5106]">{formatPrice(discountedPrice)}</div>
            </div>
          </div>

          {/* Discount tiers info */}
          {product.price && (
            <div className="rounded-md bg-secondary/30 p-2 text-xs text-muted-foreground">
              {unit === "M" ? (
                <>
                  Скидки: от {product.price.PriceLimitM1}м — {formatPrice(product.price.PriceM1)}/м, от{" "}
                  {product.price.PriceLimitM2}м — {formatPrice(product.price.PriceM2)}/м
                </>
              ) : (
                <>
                  Скидки: от {product.price.PriceLimitT1}т — {formatPrice(product.price.PriceT1)}/т, от{" "}
                  {product.price.PriceLimitT2}т — {formatPrice(product.price.PriceT2)}/т
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
