"use client"

import * as React from "react"

interface PipeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  label?: string
  unit?: string
  step?: number
}

export function PipeSlider({ min, max, value, onChange, label, unit = "", step = 1 }: PipeSliderProps) {
  const [isDragging, setIsDragging] = React.useState<"min" | "max" | null>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100

  const handleMouseDown = (thumb: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(thumb)
  }

  const handleTouchStart = (thumb: "min" | "max") => (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(thumb)
  }

  const updateValue = React.useCallback(
    (clientX: number) => {
      if (!trackRef.current || !isDragging) return

      const rect = trackRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const newValue = Math.round((min + (percentage / 100) * (max - min)) / step) * step

      if (isDragging === "min") {
        onChange([Math.min(newValue, value[1]), value[1]])
      } else {
        onChange([value[0], Math.max(newValue, value[0])])
      }
    },
    [isDragging, min, max, value, onChange, step],
  )

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientX)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        updateValue(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(null)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleEnd)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleEnd)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, updateValue])

  const minPercent = getPercentage(value[0])
  const maxPercent = getPercentage(value[1])

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{label}</label>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {value[0]}
            {unit} - {value[1]}
            {unit}
          </span>
        </div>
      )}

      <div className="relative px-2 py-4">
        {/* Pipe track background - made smaller */}
        <div
          ref={trackRef}
          className="relative h-6 w-full cursor-pointer rounded-full"
          style={{
            background: "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%)",
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Inner pipe shadow for depth */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
            }}
          />

          {/* Active range - orange pipe section */}
          <div
            className="absolute top-0 h-full rounded-full transition-all"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
              background: "linear-gradient(180deg, #ff7337 0%, #ff5106 50%, #b23804 100%)",
              boxShadow:
                "inset 0 1px 2px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 81, 6, 0.3)",
            }}
          >
            {/* Metallic highlight on active section */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.2) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* Min thumb - smaller circular pipe end */}
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
            style={{ left: `${minPercent}%` }}
            onMouseDown={handleMouseDown("min")}
            onTouchStart={handleTouchStart("min")}
          >
            <div
              className="h-9 w-9 rounded-full transition-transform hover:scale-110 active:scale-105"
              style={{
                background: "radial-gradient(circle at 30% 30%, #4a4a4a, #2a2a2a, #1a1a1a)",
                boxShadow:
                  "0 2px 6px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.1), inset 0 -1px 2px rgba(0, 0, 0, 0.3)",
                border: "1.5px solid #3a3a3a",
              }}
            >
              {/* Inner circle for pipe opening effect */}
              <div
                className="absolute inset-1.5 rounded-full"
                style={{
                  background: "radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)",
                  boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.8)",
                }}
              />
            </div>
          </div>

          {/* Max thumb - smaller circular pipe end */}
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
            style={{ left: `${maxPercent}%` }}
            onMouseDown={handleMouseDown("max")}
            onTouchStart={handleTouchStart("max")}
          >
            <div
              className="h-9 w-9 rounded-full transition-transform hover:scale-110 active:scale-105"
              style={{
                background: "radial-gradient(circle at 30% 30%, #ff7337, #ff5106, #b23804)",
                boxShadow:
                  "0 2px 6px rgba(255, 81, 6, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 81, 6, 0.3)",
                border: "1.5px solid #ff5106",
              }}
            >
              {/* Inner circle for pipe opening effect */}
              <div
                className="absolute inset-1.5 rounded-full"
                style={{
                  background: "radial-gradient(circle, #b23804 0%, #8a2803 100%)",
                  boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.6)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Scale markers - smaller text */}
        <div className="absolute -bottom-0.5 left-0 right-0 flex justify-between px-2 text-[10px] text-muted-foreground">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    </div>
  )
}
