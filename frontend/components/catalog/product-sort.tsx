"use client"; // Компонент работает на клиенте, использует состояние и хуки

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Варианты сортировки
type SortOption = "price-asc" | "price-desc" | "stock" | "updated";

interface ProductSortProps {
  value: SortOption; // Текущий выбранный вариант сортировки
  onChange: (value: SortOption) => void; // Функция обработки изменения сортировки
}

/**
 * ProductSort — компонент для выбора способа сортировки товаров в каталоге
 * Использует кастомный Select компонент из UI-библиотеки
 */
export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      {/* Кнопка-триггер для выбора */}
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>

      {/* Список вариантов */}
      <SelectContent>
        <SelectItem value="updated">По дате обновления</SelectItem>
        <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
        <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
        <SelectItem value="stock">По наличию</SelectItem>
      </SelectContent>
    </Select>
  );
}
