"use client"; // Компонент выполняется на клиенте, использует хуки состояния и навигации

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/contexts/cart-context"; // Контекст корзины: товары, очистка корзины
import { CheckoutForm } from "@/components/checkout/checkout-form"; // Форма ввода данных для заказа
import { OrderSummary } from "@/components/checkout/order-summary"; // Итоги корзины, отображение суммы
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, clearCart } = useCart(); // Получаем список товаров и функцию очистки корзины
  const router = useRouter(); // Навигация между страницами Next.js
  const [isSubmitting, setIsSubmitting] = useState(false); // Состояние отправки формы

  // Если корзина пуста — показываем сообщение и кнопку для возврата в каталог
  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-md px-4 py-8 sm:py-12">
        <div className="text-center">
          <h1 className="mb-2 text-xl sm:text-2xl font-bold">Корзина пуста</h1>
          <p className="mb-6 text-sm sm:text-base text-muted-foreground">
            Добавьте товары для оформления заказа
          </p>
          <Link href="/">
            <Button className="bg-[#ff5106] hover:bg-[#ff5106]/90 text-white h-10 sm:h-11">
              <ArrowLeft className="mr-2 h-4 w-4" />В каталог
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Функция обработки отправки формы заказа
  const handleSubmit = async (formData: {
    firstName: string;
    lastName: string;
    inn: string;
    phone: string;
    email: string;
  }) => {
    setIsSubmitting(true); // Устанавливаем состояние отправки

    // Имитируем API вызов
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Генерация номера заказа
    const orderNumber = `ORD-${Date.now()}`;

    // Очистка корзины после оформления заказа
    clearCart();

    // Переход на страницу успешного оформления заказа с передачей номера
    router.push(`/order-success?orderNumber=${orderNumber}`);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-6">
      {/* Заголовок страницы и кнопка возврата в корзину */}
      <div className="mb-4 sm:mb-6">
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="mb-2 h-9">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад в корзину
          </Button>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Оформление заказа
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Заполните данные для отправки заказа
        </p>
      </div>

      {/* Основная сетка: форма заказа + сводка корзины */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
        {/* Форма оформления заказа */}
        <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {/* Итоги корзины — закреплены справа на десктопе */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
