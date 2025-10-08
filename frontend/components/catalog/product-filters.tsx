"use client";

import { useEffect, useState } from "react";
import type { FilterState, Product } from "@/lib/types";
import { FilterSection } from "@/components/ui/filter-section";
import { CheckboxFilter } from "@/components/ui/checkbox-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, RotateCcw } from "lucide-react";

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  products: Product[];
  diameterRange: [number, number];
  thicknessRange: [number, number];
  onReset?: () => void;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  products,
  onReset,
}: ProductFiltersProps) {
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [gostOptions, setGostOptions] = useState<string[]>([]);
  const [steelGradeOptions, setSteelGradeOptions] = useState<string[]>([]);
  const [diameterRange, setDiameterRange] = useState<[number, number]>([140, 168]);
  const [thicknessRange, setThicknessRange] = useState<[number, number]>([3.5, 9]);


  useEffect(() => {
    // Получаем склады
    fetch("/api/warehouses")
      .then((res) => res.json())
      .then((data: { Stock: string }[]) =>
        setWarehouses(data.map((d) => d.Stock))
      )
      .catch(console.error);

    // Получаем типы продукции
    fetch("/api/pipe-types")
      .then((res) => res.json())
      .then((data: { Type: string }[]) =>
        setProductTypes(data.map((d) => d.type))
      )
      .catch(console.error);

    fetch("/api/gost")
    .then(res => res.json())
    .then((data: string[]) => setGostOptions(data))
    .catch(console.error);

  // Марки стали
  fetch("/api/steel-grades")
    .then(res => res.json())
    .then((data: string[]) => setSteelGradeOptions(data))
    .catch(console.error);

  fetch("/api/products/ranges")
      .then((res) => res.json())
      .then(
        (data: {
          diameter: { min: number; max: number };
          thickness: { min: number; max: number };
        }) => {
          setDiameterRange([data.diameter.min, data.diameter.max]);
          setThicknessRange([data.thickness.min, data.thickness.max]);

          if (filters.diameterRange[0] === 0 && filters.diameterRange[1] === 0) {
            onFiltersChange({
              ...filters,
              diameterRange: [data.diameter.min, data.diameter.max],
              thicknessRange: [data.thickness.min, data.thickness.max],
            });
          }
        }
      )
      .catch(console.error);
  }, []);

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
      <FilterSection title="Поиск" defaultOpen>
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

      <FilterSection title="Склад">
        <CheckboxFilter
          options={warehouses}
          selected={filters.warehouse}
          onChange={(warehouse) => onFiltersChange({ ...filters, warehouse })}
        />
      </FilterSection>

      <FilterSection title="Тип продукции">
        <CheckboxFilter
          options={productTypes}
          selected={filters.productType}
          onChange={(productType) =>
            onFiltersChange({ ...filters, productType })
          }
        />
      </FilterSection>

      <FilterSection title="ГОСТ">
        <CheckboxFilter
          options={gostOptions}
          selected={filters.gost}
          onChange={(gost) => onFiltersChange({ ...filters, gost })}
        />
      </FilterSection>

      <FilterSection title="Марка стали">
        <CheckboxFilter
          options={steelGradeOptions}
          selected={filters.steelGrade}
          onChange={(steelGrade) =>
            onFiltersChange({ ...filters, steelGrade })
          }
        />
      </FilterSection>

          <FilterSection title="Диаметр" defaultOpen>
  <div className="flex items-center gap-2">
    <Input
      type="number"
      placeholder={`От ${diameterRange[0]}`}
      value={filters.diameterRange[0]}
      onChange={(e) =>
        onFiltersChange({
          ...filters,
          diameterRange: [
            e.target.value === "" ? diameterRange[0] : Number(e.target.value),
            filters.diameterRange[1],
          ],
        })
      }
      className="h-9"
    />
    <Input
      type="number"
      placeholder={`До ${diameterRange[1]}`}
      value={filters.diameterRange[1]}
      onChange={(e) =>
        onFiltersChange({
          ...filters,
          diameterRange: [
            filters.diameterRange[0],
            e.target.value === "" ? diameterRange[1] : Number(e.target.value),
          ],
        })
      }
      className="h-9"
    />
  </div>
</FilterSection>

<FilterSection title="Толщина стенки" defaultOpen>
  <div className="flex items-center gap-2">
    <Input
      type="number"
      step="0.1"
      placeholder={`От ${thicknessRange[0]}`}
      value={filters.thicknessRange[0]}
      onChange={(e) =>
        onFiltersChange({
          ...filters,
          thicknessRange: [
            e.target.value === ""
              ? thicknessRange[0]
              : Number(e.target.value),
            filters.thicknessRange[1],
          ],
        })
      }
      className="h-9"
    />
    <Input
      type="number"
      step="0.1"
      placeholder={`До ${thicknessRange[1]}`}
      value={filters.thicknessRange[1]}
      onChange={(e) =>
        onFiltersChange({
          ...filters,
          thicknessRange: [
            filters.thicknessRange[0],
            e.target.value === ""
              ? thicknessRange[1]
              : Number(e.target.value),
          ],
        })
      }
      className="h-9"
    />
  </div>
</FilterSection>



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