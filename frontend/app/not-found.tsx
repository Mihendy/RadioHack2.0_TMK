import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
              boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)",
            }}
          >
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">Страница не найдена</h2>
        <p className="mb-6 text-muted-foreground">Запрашиваемая страница не существует или была перемещена</p>
        <Link href="/">
          <Button className="bg-[#ff5106] hover:bg-[#ff5106]/90 text-white">Вернуться на главную</Button>
        </Link>
      </div>
    </div>
  )
}
