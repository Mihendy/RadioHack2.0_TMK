"use client"

import { Home, Search, ShoppingCart, User, Package } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/contexts/cart-context"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Каталог" },
  { href: "/search", icon: Search, label: "Поиск" },
  { href: "/cart", icon: ShoppingCart, label: "Корзина" },
  { href: "/profile", icon: User, label: "Профиль" },
]

export function BottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                isActive ? "text-[#EE742D]" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="relative">
                {item.href === "/profile" ? (
                  <Package className="h-5 w-5" style={{ color: pathname === item.href ? "#EE742D" : undefined }} />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                {item.href === "/cart" && itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#EE742D] text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
