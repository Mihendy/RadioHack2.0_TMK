import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container px-4 py-12">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">Товар не найден</h1>
        <p className="mb-6 text-muted-foreground">Запрашиваемый товар не существует или был удален</p>
        <Link href="/">
          <Button className="bg-[#ff5106] hover:bg-[#ff5106]/90 text-white">Вернуться в каталог</Button>
        </Link>
      </div>
    </div>
  )
}
