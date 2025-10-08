"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Error:", error)
  }, [error])

  return (
    <div className="container flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #ff7337 0%, #ff5106 50%, #b23804 100%)",
              boxShadow: "0 8px 24px rgba(255, 81, 6, 0.4)",
            }}
          >
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold">Что-то пошло не так</h1>
        <p className="mb-6 text-muted-foreground">Произошла ошибка при загрузке страницы</p>
        <div className="space-y-2">
          <Button onClick={reset} className="w-full bg-[#ff5106] hover:bg-[#ff5106]/90 text-white">
            Попробовать снова
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full bg-transparent">
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  )
}
