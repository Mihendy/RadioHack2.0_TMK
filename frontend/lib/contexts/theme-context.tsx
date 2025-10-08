"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getTelegramTheme } from "../utils/telegram"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")

  useEffect(() => {
    // Get theme from Telegram or localStorage
    const telegramTheme = getTelegramTheme()
    const savedTheme = localStorage.getItem("theme") as Theme | null
    const initialTheme = savedTheme || telegramTheme

    setThemeState(initialTheme)
    if (initialTheme === "light") {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    } else {
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    } else {
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
    }
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
