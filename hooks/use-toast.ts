import { toast as sonnerToast } from "sonner"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const toast = ({ title, description, variant = "default", duration }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title || "Lỗi", {
        description: description,
        duration: duration || 5000,
      })
    } else {
      // Default variant - use success toast
      if (title && description) {
        sonnerToast.success(title, {
          description: description,
          duration: duration || 5000,
        })
      } else if (title) {
        sonnerToast.success(title, {
          description: description,
          duration: duration || 5000,
        })
      } else if (description) {
        sonnerToast.success(description, {
          duration: duration || 5000,
        })
      }
    }
  }

  return { toast }
}
