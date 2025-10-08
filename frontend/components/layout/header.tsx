"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/contexts/theme-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center px-4 relative">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex h-10 items-center justify-center rounded-full bg-[#EE742D] px-8">
            <Image src="/logo.png" alt="TMK Logo" width={100} height={50} className="object-contain" priority />
          </div>
        </Link>

        <div className="absolute right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
