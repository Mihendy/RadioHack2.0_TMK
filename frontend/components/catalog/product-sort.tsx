"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SortOption = "price-asc" | "price-desc" | "stock" | "updated"

interface ProductSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="updated">По дате обновления</SelectItem>
        <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
        <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
        <SelectItem value="stock">По наличию</SelectItem>
      </SelectContent>
    </Select>
  )
}
