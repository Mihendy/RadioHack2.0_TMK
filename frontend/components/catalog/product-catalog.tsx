"use client"

import { useState, useMemo } from "react"
import { getProducts, getRange } from "@/lib/utils/data-utils"
import { ProductCard } from "@/components/ui/product-card"
import { ProductFilters } from "@/components/catalog/product-filters"
import { ProductSort } from "@/components/catalog/product-sort"
import { useCart } from "@/lib/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { FilterState } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

type SortOption = "price-asc" | "price-desc" | "stock" | "updated"

export function ProductCatalog() {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const allProducts = useMemo(() => getProducts(), [])
  const diameterRange = useMemo(() => getRange(allProducts, "Diameter"), [allProducts])
  const thicknessRange = useMemo(() => getRange(allProducts, "PipeWallThickness"), [allProducts])

  const [filters, setFilters] = useState<FilterState>({
    warehouse: [],
    productType: [],
    diameterRange: diameterRange,
    thicknessRange: thicknessRange,
    gost: [],
    steelGrade: [],
    search: "",
  })

  const [sortBy, setSortBy] = useState<SortOption>("updated")

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Warehouse filter
      if (filters.warehouse.length > 0 && product.stock) {
        if (!filters.warehouse.includes(product.stock.Stock)) return false
      }

      // Product type filter
      if (filters.productType.length > 0) {
        if (!filters.productType.includes(product.IDType)) return false
      }

      // Diameter range filter
      if (product.Diameter < filters.diameterRange[0] || product.Diameter > filters.diameterRange[1]) {
        return false
      }

      // Thickness range filter
      if (
        product.PipeWallThickness < filters.thicknessRange[0] ||
        product.PipeWallThickness > filters.thicknessRange[1]
      ) {
        return false
      }

      // GOST filter
      if (filters.gost.length > 0) {
        if (!filters.gost.includes(product.Gost)) return false
      }

      // Steel grade filter
      if (filters.steelGrade.length > 0) {
        if (!filters.steelGrade.includes(product.SteelGrade)) return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          product.Name.toLowerCase().includes(searchLower) ||
          product.ID.toLowerCase().includes(searchLower) ||
          product.Manufacturer.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [allProducts, filters])

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => (a.price?.PriceM || 0) - (b.price?.PriceM || 0))
      case "price-desc":
        return sorted.sort((a, b) => (b.price?.PriceM || 0) - (a.price?.PriceM || 0))
      case "stock":
        return sorted.sort((a, b) => (b.remnant?.InStockT || 0) - (a.remnant?.InStockT || 0))
      case "updated":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.price?.PriceUpdatedAt || 0).getTime()
          const dateB = new Date(b.price?.PriceUpdatedAt || 0).getTime()
          return dateB - dateA
        })
      default:
        return sorted
    }
  }, [filteredProducts, sortBy])

  const handleAddToCart = (product: (typeof sortedProducts)[0]) => {
    addItem(product, 1, "M")
    toast({
      title: "Добавлено в корзину",
      description: product.Name,
    })
  }

  const handleResetFilters = () => {
    setFilters({
      warehouse: [],
      productType: [],
      diameterRange: diameterRange,
      thicknessRange: thicknessRange,
      gost: [],
      steelGrade: [],
      search: "",
    })
  }

  const hasActiveFilters =
    filters.warehouse.length > 0 ||
    filters.productType.length > 0 ||
    filters.gost.length > 0 ||
    filters.steelGrade.length > 0 ||
    filters.search !== "" ||
    filters.diameterRange[0] !== diameterRange[0] ||
    filters.diameterRange[1] !== diameterRange[1] ||
    filters.thicknessRange[0] !== thicknessRange[0] ||
    filters.thicknessRange[1] !== thicknessRange[1]

  return (
    <div className="space-y-4">
      {/* Mobile filter button and sort */}
      <div className="flex items-center gap-2">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex-1 lg:hidden bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Фильтры
              {hasActiveFilters && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#EE742D] text-xs text-white">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-bold text-center">Фильтры</SheetTitle>
            </SheetHeader>
            <div className="mt-2">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                products={allProducts}
                diameterRange={diameterRange}
                thicknessRange={thicknessRange}
                onReset={handleResetFilters}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          <ProductSort value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
        {/* Desktop filters sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold flex-1 text-center">Фильтры</h2>
              {hasActiveFilters && (
                <Button onClick={handleResetFilters} variant="ghost" size="sm" className="absolute right-4">
                  <X className="mr-1 h-3 w-3" />
                  Сбросить
                </Button>
              )}
            </div>
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              products={allProducts}
              diameterRange={diameterRange}
              thicknessRange={thicknessRange}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        {/* Product grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Найдено: <span className="font-semibold text-foreground">{sortedProducts.length}</span> товаров
            </p>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <p className="text-muted-foreground">Товары не найдены</p>
              <Button onClick={handleResetFilters} variant="outline" className="mt-4 bg-transparent">
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard key={product.ID} product={product} onAddToCart={() => handleAddToCart(product)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
