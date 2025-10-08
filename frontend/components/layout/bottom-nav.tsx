"use client"; // Компонент работает на клиенте, использует хуки и состояние

import { Home, Search, ShoppingCart, User, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Хук Next.js для получения текущего пути
import { useCart } from "@/lib/contexts/cart-context"; // Контекст корзины для отображения количества товаров
import { cn } from "@/lib/utils"; // Утилита для объединения классов

// Массив элементов навигации
const navItems = [
  { href: "/", icon: Home, label: "Каталог" },
  { href: "/search", icon: Search, label: "Поиск" },
  { href: "/cart", icon: ShoppingCart, label: "Корзина" },
  { href: "/profile", icon: User, label: "Профиль" },
];

export function BottomNav() {
  const pathname = usePathname(); // Получаем текущий путь
  const { itemCount } = useCart(); // Получаем количество товаров в корзине

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Контейнер с кнопками навигации */}
      <div className="container flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href; // Проверяем, активен ли пункт
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                isActive
                  ? "text-[#EE742D]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                {/* Особый случай: иконка для профиля/заказов */}
                {item.href === "/profile" ? (
                  <Package
                    className="h-5 w-5"
                    style={{
                      color: pathname === item.href ? "#EE742D" : undefined,
                    }}
                  />
                ) : (
                  <Icon className="h-5 w-5" />
                )}

                {/* Индикатор количества товаров для корзины */}
                {item.href === "/cart" && itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#EE742D] text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </div>

              {/* Подпись под иконкой */}
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
