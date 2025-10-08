"use client"; // Компонент работает на клиенте, использует состояние и хуки

import { useCart } from "@/lib/contexts/cart-context"; // Контекст корзины: доступ к товарам и их количеству
import { calculatePrice, formatPrice } from "@/lib/utils/data-utils"; // Утилиты для расчета цены и форматирования
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartSummaryProps {
  onCheckout: () => void; // Функция для перехода к оформлению заказа
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const { items } = useCart(); // Получаем все товары из корзины

  // Расчет суммарных значений: исходная сумма, скидка и итоговая сумма
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
      <h2 className="mb-4 text-xl font-bold">Итого</h2>

      <div className="space-y-3">
        {/* Сумма без скидки */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Сумма:</span>
          <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
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
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg">
            <span className="font-bold">К оплате:</span>
            <span className="font-bold text-[#EE742D]">
              {formatPrice(totals.total)}
            </span>
          </div>
        </div>

        {/* Информация о НДС */}
        <div className="text-xs text-muted-foreground">
          <p>НДС {items[0]?.product.price?.NDS || 20}% включен в стоимость</p>
        </div>
      </div>

      {/* Кнопка перехода к оформлению заказа */}
      <Button
        onClick={onCheckout}
        className="mt-6 w-full bg-[#EE742D] hover:bg-[#EE742D]/90 text-white shadow-lg shadow-[#EE742D]/20"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Оформить заказ
      </Button>
    </div>
  );
}
