"use client"

import { useCart } from "@/lib/contexts/cart-context"
import { calculatePrice, formatPrice } from "@/lib/utils/data-utils"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface CartSummaryProps {
  onCheckout: () => void
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
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
      <h2 className="mb-4 text-xl font-bold">Итого</h2>

      <div className="space-y-3">
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

        <div className="border-t pt-3">
          <div className="flex justify-between text-lg">
            <span className="font-bold">К оплате:</span>
            <span className="font-bold text-[#EE742D]">{formatPrice(totals.total)}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>НДС {items[0]?.product.price?.NDS || 20}% включен в стоимость</p>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        className="mt-6 w-full bg-[#EE742D] hover:bg-[#EE742D]/90 text-white shadow-lg shadow-[#EE742D]/20"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Оформить заказ
      </Button>
    </div>
  )
}
