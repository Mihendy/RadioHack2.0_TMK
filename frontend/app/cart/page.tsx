"use client"

import { useCart } from "@/lib/contexts/cart-context"
import { CartItemCard } from "@/components/cart/cart-item-card"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, itemCount } = useCart()
  const router = useRouter()

  if (itemCount === 0) {
    return (
      <div className="container mx-auto max-w-md px-4 py-8 sm:py-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div
              className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
            >
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="mb-2 text-xl sm:text-2xl font-bold">Корзина пуста</h1>
          <p className="mb-6 text-sm sm:text-base text-muted-foreground">
            Добавьте товары из каталога для оформления заказа
          </p>
          <Link href="/">
            <Button className="bg-[#EE742D] hover:bg-[#EE742D]/90 text-white h-10 sm:h-11">
              <ArrowLeft className="mr-2 h-4 w-4" />В каталог
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Корзина</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {itemCount} {itemCount === 1 ? "товар" : itemCount < 5 ? "товара" : "товаров"}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
        {/* Cart items */}
        <div className="space-y-3 sm:space-y-4">
          {items.map((item) => (
            <CartItemCard key={item.product.ID} item={item} />
          ))}
        </div>

        {/* Cart summary - sticky on desktop */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <CartSummary onCheckout={() => router.push("/checkout")} />
        </div>
      </div>
    </div>
  )
}
