"use client"; // Компонент работает на клиенте, использует состояние и хуки

import { useState, useMemo } from "react";
import { getProducts, getRange } from "@/lib/utils/data-utils"; // Получение списка продуктов и диапазонов значений
import { ProductCard } from "@/components/ui/product-card"; // Карточка товара
import { ProductFilters } from "@/components/catalog/product-filters"; // Компонент фильтров
import { ProductSort } from "@/components/catalog/product-sort"; // Компонент сортировки
import { useCart } from "@/lib/contexts/cart-context"; // Контекст корзины
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { FilterState } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type SortOption = "price-asc" | "price-desc" | "stock" | "updated";

/**
 * ProductCatalog — основной компонент каталога товаров
 * - Отображает фильтры и сортировку
 * - Показывает сетку продуктов
 * - Поддерживает добавление товаров в корзину
 */
export function ProductCatalog() {
  const { addItem } = useCart(); // Функция для добавления товара в корзину
  const { toast } = useToast(); // Для уведомлений
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Состояние открытия мобильного фильтра

  // Получаем все продукты и диапазоны для фильтров
  const allProducts = useMemo(() => getProducts(), []);
  const diameterRange = useMemo(
    () => getRange(allProducts, "Diameter"),
    [allProducts]
  );
  const thicknessRange = useMemo(
    () => getRange(allProducts, "PipeWallThickness"),
    [allProducts]
  );

  // Состояние фильтров
  const [filters, setFilters] = useState<FilterState>({
    warehouse: [],
    productType: [],
    diameterRange: diameterRange,
    thicknessRange: thicknessRange,
    gost: [],
    steelGrade: [],
    search: "",
  });

  // Состояние сортировки
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  /**
   * Фильтрация продуктов
   * - Применяются все выбранные фильтры
   * - Фильтры по складу, типу продукта, диаметру, толщине, ГОСТу, марке стали и поиску
   */
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (filters.warehouse.length > 0 && product.stock) {
        if (!filters.warehouse.includes(product.stock.Stock)) return false;
      }
      if (filters.productType.length > 0) {
        if (!filters.productType.includes(product.IDType)) return false;
      }
      if (
        product.Diameter < filters.diameterRange[0] ||
        product.Diameter > filters.diameterRange[1]
      )
        return false;
      if (
        product.PipeWallThickness < filters.thicknessRange[0] ||
        product.PipeWallThickness > filters.thicknessRange[1]
      )
        return false;
      if (filters.gost.length > 0) {
        if (!filters.gost.includes(product.Gost)) return false;
      }
      if (filters.steelGrade.length > 0) {
        if (!filters.steelGrade.includes(product.SteelGrade)) return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          product.Name.toLowerCase().includes(searchLower) ||
          product.ID.toLowerCase().includes(searchLower) ||
          product.Manufacturer.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [allProducts, filters]);

  /**
   * Сортировка продуктов
   * - По цене, наличию или дате обновления
   */
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort(
          (a, b) => (a.price?.PriceM || 0) - (b.price?.PriceM || 0)
        );
      case "price-desc":
        return sorted.sort(
          (a, b) => (b.price?.PriceM || 0) - (a.price?.PriceM || 0)
        );
      case "stock":
        return sorted.sort(
          (a, b) => (b.remnant?.InStockT || 0) - (a.remnant?.InStockT || 0)
        );
      case "updated":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.price?.PriceUpdatedAt || 0).getTime();
          const dateB = new Date(b.price?.PriceUpdatedAt || 0).getTime();
          return dateB - dateA;
        });
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Добавление товара в корзину с уведомлением
  const handleAddToCart = (product: (typeof sortedProducts)[0]) => {
    addItem(product, 1, "M");
    toast({
      title: "Добавлено в корзину",
      description: product.Name,
    });
  };

  // Сброс фильтров до начальных значений
  const handleResetFilters = () => {
    setFilters({
      warehouse: [],
      productType: [],
      diameterRange: diameterRange,
      thicknessRange: thicknessRange,
      gost: [],
      steelGrade: [],
      search: "",
    });
  };

  // Проверка наличия активных фильтров
  const hasActiveFilters =
    filters.warehouse.length > 0 ||
    filters.productType.length > 0 ||
    filters.gost.length > 0 ||
    filters.steelGrade.length > 0 ||
    filters.search !== "" ||
    filters.diameterRange[0] !== diameterRange[0] ||
    filters.diameterRange[1] !== diameterRange[1] ||
    filters.thicknessRange[0] !== thicknessRange[0] ||
    filters.thicknessRange[1] !== thicknessRange[1];

  return (
    <div className="space-y-4">
      {/* Мобильная кнопка фильтров и сортировки */}
      <div className="flex items-center gap-2">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 lg:hidden bg-transparent"
            >
              <Filter className="mr-2 h-4 w-4" />
              Фильтры
              {hasActiveFilters && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#EE742D] text-xs text-white">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full sm:max-w-md overflow-y-auto"
          >
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

        {/* Сортировка */}
        <div className="flex-1">
          <ProductSort value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Десктопный макет */}
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
        {/* Сайдбар фильтров для десктопа */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold flex-1 text-center">Фильтры</h2>
              {hasActiveFilters && (
                <Button
                  onClick={handleResetFilters}
                  variant="ghost"
                  size="sm"
                  className="absolute right-4"
                >
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

        {/* Сетка продуктов */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Найдено:{" "}
              <span className="font-semibold text-foreground">
                {sortedProducts.length}
              </span>{" "}
              товаров
            </p>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <p className="text-muted-foreground">Товары не найдены</p>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="mt-4 bg-transparent"
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.ID}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
