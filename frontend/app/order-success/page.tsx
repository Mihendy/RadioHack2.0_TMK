"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("orderNumber") || "N/A"

  return (
    <div className="container mx-auto max-w-md px-4 py-8 sm:py-12">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div
            className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #ff7337 0%, #ff5106 50%, #b23804 100%)",
              boxShadow: "0 8px 24px rgba(255, 81, 6, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
            }}
          >
            <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl sm:text-3xl font-bold">Заказ оформлен!</h1>
        <p className="mb-6 text-sm sm:text-base text-muted-foreground">
          Ваш заказ успешно отправлен. Наш менеджер свяжется с вами в ближайшее время для подтверждения.
        </p>

        <div className="mb-8 rounded-lg border bg-card p-4 sm:p-6">
          <p className="mb-2 text-xs sm:text-sm text-muted-foreground">Номер заказа</p>
          <p className="text-xl sm:text-2xl font-bold text-[#ff5106]">{orderNumber}</p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-[#ff5106] hover:bg-[#ff5106]/90 text-white h-10 sm:h-11">
              Вернуться в каталог
            </Button>
          </Link>
          <Link href="/profile" className="block">
            <Button variant="outline" className="w-full bg-transparent h-10 sm:h-11">
              Мои заказы
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container px-4 py-12 text-center">Загрузка...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
