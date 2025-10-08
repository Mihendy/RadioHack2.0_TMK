import { Suspense } from "react"
import { ProductCatalog } from "@/components/catalog/product-catalog"
import { LoadingPipe } from "@/components/ui/loading-pipe"

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Каталог труб</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Выберите трубную продукцию для заказа</p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingPipe />
            <p className="mt-4 text-muted-foreground">Загрузка каталога...</p>
          </div>
        }
      >
        <ProductCatalog />
      </Suspense>
    </div>
  )
}
