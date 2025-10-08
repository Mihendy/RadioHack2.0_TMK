"use client";

import * as React from "react";
import { useEffect } from "react";
import { CartProvider } from "@/lib/contexts/cart-context";
import { ThemeProvider as CustomThemeProvider } from "@/lib/contexts/theme-context";
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
    <CustomThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>{children}</CartProvider>
    </CustomThemeProvider>
  );
}
