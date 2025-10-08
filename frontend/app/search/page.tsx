"use client"

import { useState } from "react"
import { getProducts } from "@/lib/utils/data-utils"
import { ProductCard } from "@/components/ui/product-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useCart } from "@/lib/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { addItem } = useCart()
  const { toast } = useToast()

  const allProducts = getProducts()

  const searchResults = allProducts.filter((product) => {
    if (!searchQuery) return false
    const query = searchQuery.toLowerCase()
    return (
      product.Name.toLowerCase().includes(query) ||
      product.ID.toLowerCase().includes(query) ||
      product.Manufacturer.toLowerCase().includes(query) ||
      product.Gost.toLowerCase().includes(query) ||
      product.SteelGrade.toLowerCase().includes(query)
    )
  })

  const handleAddToCart = (product: (typeof allProducts)[0]) => {
    addItem(product, 1, "M")
    toast({
      title: "Добавлено в корзину",
      description: product.Name,
    })
  }

  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Поиск</h1>
        <p className="text-muted-foreground">Найдите нужную трубу по названию, артикулу или характеристикам</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Введите название, артикул, ГОСТ или марку стали..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 text-xs sm:text-sm"
          />
        </div>
      </div>

      {searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Найдено: <span className="font-semibold text-foreground">{searchResults.length}</span> товаров
          </p>
        </div>
      )}

      {!searchQuery ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">Начните вводить запрос для поиска</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">Ничего не найдено</p>
          <p className="mt-2 text-sm text-muted-foreground">Попробуйте изменить запрос</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((product) => (
            <ProductCard key={product.ID} product={product} onAddToCart={() => handleAddToCart(product)} />
          ))}
        </div>
      )}
    </div>
  )
}
