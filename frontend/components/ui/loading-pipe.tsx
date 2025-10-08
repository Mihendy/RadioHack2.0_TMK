export function LoadingPipe() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        {/* Rotating pipe animation */}
        <div
          className="h-16 w-16 animate-spin rounded-full"
          style={{
            background: "linear-gradient(135deg, #ff7337 0%, #ff5106 50%, #b23804 100%)",
            boxShadow: "0 0 20px rgba(255, 81, 6, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: "radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)",
              boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.8)",
            }}
          />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  )
}
