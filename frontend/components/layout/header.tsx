"use client"; // Компонент работает на клиенте, использует хуки и состояние

import { Sun, Moon } from "lucide-react"; // Иконки для темы
import { useTheme } from "@/lib/contexts/theme-context"; // Контекст темы (светлая/темная)
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Для навигации по сайту
import Image from "next/image"; // Оптимизированное отображение логотипа

export function Header() {
  const { theme, setTheme } = useTheme(); // Получаем текущую тему и функцию для переключения

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Контейнер для логотипа и кнопки темы */}
      <div className="container flex h-16 items-center justify-center px-4 relative">
        {/* Логотип сайта */}
        <Link href="/" className="flex items-center justify-center">
          <div className="flex h-10 items-center justify-center rounded-full bg-[#EE742D] px-8">
            <Image
              src="/logo.png"
              alt="TMK Logo"
              className="object-contain"
              priority // Логотип загружается первым
            />
          </div>
        </Link>

        {/* Кнопка переключения темы (светлая/темная) */}
        <div className="absolute right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            {/* Иконка зависит от текущей темы */}
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
