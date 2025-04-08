// components/ErrorDisplay.tsx
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorDisplayProps {
  title?: string
  message: string
  retryAction?: () => void
}

export default function ErrorDisplay({ title = "Error", message, retryAction }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-dark-600 border border-red-500/20">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-light-200 mb-2">{title}</h2>
      <p className="text-light-500 text-center mb-6">{message}</p>

      {retryAction && (
        <Button
          onClick={retryAction}
          variant="outline"
          className="border-light-400/20 text-light-200 hover:bg-dark-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      )}
    </div>
  )
}