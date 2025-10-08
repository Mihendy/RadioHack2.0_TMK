// Главная страница каталога труб (HomePage)
// Отображает список продукции с ленивой загрузкой через React.Suspense

import { Suspense } from "react";
import { ProductCatalog } from "@/components/catalog/product-catalog";
import { LoadingPipe } from "@/components/ui/loading-pipe";

export default function HomePage() {
  return (
    // Контейнер ограничивает ширину контента и добавляет отступы
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-6">
      {/* Заголовок и подзаголовок страницы */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Каталог труб
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Выберите трубную продукцию для заказа
        </p>
      </div>

      {/* Suspense используется для отложенной загрузки каталога.
          Пока данные подгружаются — показывается анимация LoadingPipe */}
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingPipe />
            <p className="mt-4 text-muted-foreground">Загрузка каталога...</p>
          </div>
        }
      >
        {/* Основной компонент, отображающий карточки товаров */}
        <ProductCatalog />
      </Suspense>
    </div>
  );
}
