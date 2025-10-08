"use client"

import type React from "react"

import { CartProvider } from "@/lib/contexts/cart-context"
import { ThemeProvider } from "@/lib/contexts/theme-context"
import { useEffect } from "react"
import { initTelegramWebApp } from "@/lib/utils/telegram"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTelegramWebApp()
  }, [])

  return (
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  )
}
