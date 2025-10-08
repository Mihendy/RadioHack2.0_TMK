import type React from "react"
import { cn } from "@/lib/utils"

interface PipeBadgeProps {
  children: React.ReactNode
  variant?: "default" | "orange" | "outline"
  className?: string
}

export function PipeBadge({ children, variant = "default", className }: PipeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all",
        variant === "default" && "bg-secondary text-secondary-foreground",
        variant === "orange" && "bg-[#ff5106] text-white shadow-lg shadow-[#ff5106]/20 hover:shadow-[#ff5106]/30",
        variant === "outline" && "border border-border bg-transparent",
        className,
      )}
      style={
        variant === "orange"
          ? {
              background: "linear-gradient(135deg, #ff7337 0%, #ff5106 50%, #b23804 100%)",
              boxShadow: "0 2px 8px rgba(255, 81, 6, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
            }
          : undefined
      }
    >
      {children}
    </span>
  )
}
