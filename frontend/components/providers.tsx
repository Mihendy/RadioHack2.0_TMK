"use client";

import type React from "react";
import { useEffect } from "react";
import { CartProvider } from "@/lib/contexts/cart-context";
import { ThemeProvider } from "@/lib/contexts/theme-context";
import { initTelegramWebApp } from "@/lib/utils/telegram";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Инициализация Telegram Web App при первом рендере
    initTelegramWebApp();
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
