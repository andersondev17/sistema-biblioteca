'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ReactNode, useState } from "react"
import { toast } from "sonner"

interface FormModalProps {
  title: string
  description?: string
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  onSubmit: () => Promise<boolean>
  submitText?: string
  loading?: boolean
}

export function FormModal({
  title,
  description,
  children,
  isOpen,
  onClose,
  onSubmit,
  submitText = "Guardar",
  loading = false
}: FormModalProps) {
  const [submitting, setSubmitting] = useState(false)
  
  const handleSubmit = async () => {
    setSubmitting(true)
    
    try {
      const success = await onSubmit()
      
      if (success) {
        toast.success("Operación completada con éxito")
        onClose()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al procesar la solicitud")
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-300 border-dark-600 text-light-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-light-200">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="space-y-4">
          {children}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-dark-600 text-light-100"
            disabled={submitting || loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-dark-100 hover:bg-primary/90"
            disabled={submitting || loading}
          >
            {submitting || loading ? "Procesando..." : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}