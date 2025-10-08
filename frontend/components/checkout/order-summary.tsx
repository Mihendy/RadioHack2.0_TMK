"use client"

import { useCart } from "@/lib/contexts/cart-context"
import { calculatePrice, formatPrice, formatQuantity } from "@/lib/utils/data-utils"

export function OrderSummary() {
  const { items } = useCart()

  const totals = items.reduce(
    (acc, item) => {
      const { basePrice, discountedPrice, discount } = calculatePrice(item.product, item.quantity, item.unit)
      return {
        subtotal: acc.subtotal + basePrice,
        discount: acc.discount + discount,
        total: acc.total + discountedPrice,
      }
    },
    { subtotal: 0, discount: 0, total: 0 },
  )

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-xl font-bold">Ваш заказ</h2>

      <div className="space-y-4">
        {/* Items list */}
        <div className="space-y-3">
          {items.map((item) => {
            const { discountedPrice } = calculatePrice(item.product, item.quantity, item.unit)
            return (
              <div key={item.product.ID} className="flex justify-between gap-2 text-sm">
                <div className="flex-1">
                  <p className="font-medium leading-tight">{item.product.Name}</p>
                  <p className="text-xs text-muted-foreground">{formatQuantity(item.quantity, item.unit)}</p>
                </div>
                <div className="text-right font-semibold">{formatPrice(discountedPrice)}</div>
              </div>
            )
          })}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Сумма:</span>
            <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
          </div>

          {totals.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Скидка:</span>
              <span className="font-semibold text-green-500">-{formatPrice(totals.discount)}</span>
            </div>
          )}

          <div className="border-t pt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Итого:</span>
              <span className="font-bold text-[#ff5106]">{formatPrice(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
