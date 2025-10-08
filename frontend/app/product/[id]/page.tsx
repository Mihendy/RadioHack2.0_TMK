"use client"; // Компонент выполняется на клиенте, позволяет использовать хуки и состояние

import { getProducts } from "@/lib/utils/data-utils"; // Функция для получения всех продуктов
import { ProductDetailView } from "@/components/product/product-detail-view"; // Компонент детальной карточки товара
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation"; // Функция для отображения страницы 404

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params; // Получаем id товара из маршрута
  const products = getProducts(); // Загружаем список всех товаров
  const product = products.find((p) => p.ID === id); // Находим товар по ID

  // Если товар не найден — показываем страницу 404
  if (!product) {
    notFound();
  }

  return (
    <div className="container px-4 py-6">
      {/* Кнопка возврата в каталог */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад в каталог
        </Button>
      </Link>

      {/* Компонент отображения деталей товара */}
      <ProductDetailView product={product} />
    </div>
  );
}
