"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/contexts/cart-context"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-md px-4 py-8 sm:py-12">
        <div className="text-center">
          <h1 className="mb-2 text-xl sm:text-2xl font-bold">Корзина пуста</h1>
          <p className="mb-6 text-sm sm:text-base text-muted-foreground">Добавьте товары для оформления заказа</p>
          <Link href="/">
            <Button className="bg-[#ff5106] hover:bg-[#ff5106]/90 text-white h-10 sm:h-11">
              <ArrowLeft className="mr-2 h-4 w-4" />В каталог
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (formData: {
    firstName: string
    lastName: string
    inn: string
    phone: string
    email: string
  }) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Clear cart
    clearCart()

    // Redirect to success page
    router.push(`/order-success?orderNumber=${orderNumber}`)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="mb-2 h-9">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад в корзину
          </Button>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Оформление заказа</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Заполните данные для отправки заказа</p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
        {/* Checkout form */}
        <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {/* Order summary - sticky on desktop */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
