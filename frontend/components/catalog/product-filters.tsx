"use client"; // Компонент работает на клиенте, использует состояние и хуки

import type { FilterState, Product } from "@/lib/types";
import { getUniqueValues } from "@/lib/utils/data-utils"; // Получение уникальных значений для фильтров
import { mockTypes, mockStocks } from "@/lib/mock-data"; // Моковые данные для типов продукции и складов
import { FilterSection } from "@/components/ui/filter-section"; // Раздел фильтра
import { CheckboxFilter } from "@/components/ui/checkbox-filter"; // Фильтр с чекбоксами
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, RotateCcw } from "lucide-react";

interface ProductFiltersProps {
  filters: FilterState; // Текущее состояние фильтров
  onFiltersChange: (filters: FilterState) => void; // Функция обновления фильтров
  products: Product[]; // Список всех продуктов
  diameterRange: [number, number]; // Диапазон диаметров
  thicknessRange: [number, number]; // Диапазон толщины стенки
  onReset?: () => void; // Функция сброса фильтров
}

/**
 * ProductFilters — компонент для управления фильтрами каталога
 * - Поиск по ID или названию
 * - Фильтры по складу, типу продукта, диаметру, толщине, ГОСТу, марке стали
 * - Сброс фильтров
 */
export function ProductFilters({
  filters,
  onFiltersChange,
  products,
  diameterRange,
  thicknessRange,
  onReset,
}: ProductFiltersProps) {
  // Опции фильтров
  const warehouses = mockStocks.map((s) => s.Stock);
  const productTypes = mockTypes.map((t) => t.Type);
  const gostOptions = getUniqueValues(products, "Gost");
  const steelGradeOptions = getUniqueValues(products, "SteelGrade");

  // Проверка, есть ли активные фильтры
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
    <div className="space-y-0">
      {/* Поиск по названию или ID */}
      <FilterSection title="Поиск" defaultOpen={true}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ID или название..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9 h-9"
          />
        </div>
      </FilterSection>

      {/* Фильтр по складу */}
      <FilterSection title="Склад">
        <CheckboxFilter
          options={warehouses}
          selected={filters.warehouse}
          onChange={(warehouse) => onFiltersChange({ ...filters, warehouse })}
        />
      </FilterSection>

      {/* Фильтр по типу продукции */}
      <FilterSection title="Тип продукции">
        <CheckboxFilter
          options={productTypes}
          selected={filters.productType}
          onChange={(productType) =>
            onFiltersChange({ ...filters, productType })
          }
        />
      </FilterSection>

      {/* Фильтр по диаметру */}
      <FilterSection title="Диаметр" defaultOpen={true}>
        <div className="space-y-3 pl-2">
          {/* Слайдер для диапазона */}
          <Slider
            min={diameterRange[0]}
            max={diameterRange[1]}
            step={1}
            value={filters.diameterRange}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                diameterRange: value as [number, number],
              })
            }
            className="w-full"
          />
          {/* Поля ввода диапазона вручную */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                От
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={diameterRange[0]}
                  max={diameterRange[1]}
                  value={filters.diameterRange[0]}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? diameterRange[0]
                        : Number(e.target.value);
                    onFiltersChange({
                      ...filters,
                      diameterRange: [value, filters.diameterRange[1]],
                    });
                  }}
                  onBlur={(e) => {
                    const value = Math.max(
                      diameterRange[0],
                      Math.min(
                        Number(e.target.value) || diameterRange[0],
                        filters.diameterRange[1]
                      )
                    );
                    onFiltersChange({
                      ...filters,
                      diameterRange: [value, filters.diameterRange[1]],
                    });
                  }}
                  className="h-9 text-sm"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  мм
                </span>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                До
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={diameterRange[0]}
                  max={diameterRange[1]}
                  value={filters.diameterRange[1]}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? diameterRange[1]
                        : Number(e.target.value);
                    onFiltersChange({
                      ...filters,
                      diameterRange: [filters.diameterRange[0], value],
                    });
                  }}
                  onBlur={(e) => {
                    const value = Math.min(
                      diameterRange[1],
                      Math.max(
                        Number(e.target.value) || diameterRange[1],
                        filters.diameterRange[0]
                      )
                    );
                    onFiltersChange({
                      ...filters,
                      diameterRange: [filters.diameterRange[0], value],
                    });
                  }}
                  className="h-9 text-sm"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  мм
                </span>
              </div>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Фильтр по толщине стенки */}
      <FilterSection title="Толщина стенки" defaultOpen={true}>
        <div className="space-y-3 pl-2">
          <Slider
            min={thicknessRange[0]}
            max={thicknessRange[1]}
            step={0.5}
            value={filters.thicknessRange}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                thicknessRange: value as [number, number],
              })
            }
            className="w-full"
          />
          {/* Поля ввода диапазона вручную */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                От
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={thicknessRange[0]}
                  max={thicknessRange[1]}
                  step={0.5}
                  value={filters.thicknessRange[0]}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? thicknessRange[0]
                        : Number(e.target.value);
                    onFiltersChange({
                      ...filters,
                      thicknessRange: [value, filters.thicknessRange[1]],
                    });
                  }}
                  onBlur={(e) => {
                    const value = Math.max(
                      thicknessRange[0],
                      Math.min(
                        Number(e.target.value) || thicknessRange[0],
                        filters.thicknessRange[1]
                      )
                    );
                    onFiltersChange({
                      ...filters,
                      thicknessRange: [value, filters.thicknessRange[1]],
                    });
                  }}
                  className="h-9 text-sm"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  мм
                </span>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                До
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={thicknessRange[0]}
                  max={thicknessRange[1]}
                  step={0.5}
                  value={filters.thicknessRange[1]}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? thicknessRange[1]
                        : Number(e.target.value);
                    onFiltersChange({
                      ...filters,
                      thicknessRange: [filters.thicknessRange[0], value],
                    });
                  }}
                  onBlur={(e) => {
                    const value = Math.min(
                      thicknessRange[1],
                      Math.max(
                        Number(e.target.value) || thicknessRange[1],
                        filters.thicknessRange[0]
                      )
                    );
                    onFiltersChange({
                      ...filters,
                      thicknessRange: [filters.thicknessRange[0], value],
                    });
                  }}
                  className="h-9 text-sm"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  мм
                </span>
              </div>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Фильтр по ГОСТ */}
      <FilterSection title="ГОСТ">
        <CheckboxFilter
          options={gostOptions}
          selected={filters.gost}
          onChange={(gost) => onFiltersChange({ ...filters, gost })}
        />
      </FilterSection>

      {/* Фильтр по марке стали */}
      <FilterSection title="Марка стали">
        <CheckboxFilter
          options={steelGradeOptions}
          selected={filters.steelGrade}
          onChange={(steelGrade) => onFiltersChange({ ...filters, steelGrade })}
        />
      </FilterSection>

      {/* Кнопка сброса фильтров */}
      {hasActiveFilters && onReset && (
        <div className="pt-4 pb-2">
          <Button
            onClick={onReset}
            className="w-full bg-[#EE742D] hover:bg-[#EE742D]/90 text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
}
