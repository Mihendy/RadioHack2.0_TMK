"use client";

import * as React from "react";
import { useEffect, useState, createContext, useContext } from "react";
import { CartProvider } from "@/lib/contexts/cart-context";
import { initTelegramWebApp, getTelegramTheme } from "@/lib/utils/telegram";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Инициализация Telegram Web App и темы
  useEffect(() => {
    initTelegramWebApp();
    const telegramTheme = getTelegramTheme();
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || telegramTheme || "dark";
    setThemeState(initialTheme);
    if (initialTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <CartProvider>{children}</CartProvider>
    </ThemeContext.Provider>
  );
}

// Хук для темы
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within Providers");
  }
  return context;
}
