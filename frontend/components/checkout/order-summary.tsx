"use client"; // Компонент работает на клиенте и использует React-хуки

import { useCart } from "@/lib/contexts/cart-context"; // Контекст корзины: доступ к товарам и их количеству
import {
  calculatePrice,
  formatPrice,
  formatQuantity,
} from "@/lib/utils/data-utils"; // Утилиты для расчета цены и форматирования

/**
 * OrderSummary — компонент отображения списка товаров в заказе и итоговой суммы
 */
export function OrderSummary() {
  const { items } = useCart(); // Получаем все товары из корзины

  // Вычисляем итоговые суммы: базовую цену, скидку и финальную цену
  const totals = items.reduce(
    (acc, item) => {
      const { basePrice, discountedPrice, discount } = calculatePrice(
        item.product,
        item.quantity,
        item.unit
      );
      return {
        subtotal: acc.subtotal + basePrice, // Сумма без скидки
        discount: acc.discount + discount, // Общая скидка
        total: acc.total + discountedPrice, // Итого к оплате
      };
    },
    { subtotal: 0, discount: 0, total: 0 }
  );

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Заголовок блока */}
      <h2 className="mb-4 text-xl font-bold">Ваш заказ</h2>

      <div className="space-y-4">
        {/* Список товаров */}
        <div className="space-y-3">
          {items.map((item) => {
            const { discountedPrice } = calculatePrice(
              item.product,
              item.quantity,
              item.unit
            );
            return (
              <div
                key={item.product.ID}
                className="flex justify-between gap-2 text-sm"
              >
                <div className="flex-1">
                  {/* Название товара */}
                  <p className="font-medium leading-tight">
                    {item.product.Name}
                  </p>
                  {/* Количество с единицами измерения */}
                  <p className="text-xs text-muted-foreground">
                    {formatQuantity(item.quantity, item.unit)}
                  </p>
                </div>
                {/* Цена товара с учетом скидки */}
                <div className="text-right font-semibold">
                  {formatPrice(discountedPrice)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Итоги заказа */}
        <div className="space-y-2 border-t pt-3">
          {/* Сумма без скидки */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Сумма:</span>
            <span className="font-semibold">
              {formatPrice(totals.subtotal)}
            </span>
          </div>

          {/* Скидка, если есть */}
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Скидка:</span>
              <span className="font-semibold text-green-500">
                -{formatPrice(totals.discount)}
              </span>
            </div>
          )}

          {/* Итоговая сумма к оплате */}
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Итого:</span>
              <span className="font-bold text-[#ff5106]">
                {formatPrice(totals.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
