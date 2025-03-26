// components/admin/DeleteDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  title?: string;
  description?: string;
}

export function DeleteDialog({  open,  onOpenChange,  onConfirm,  isDeleting,  title = "¿Confirma la eliminación?",
  description = "Esta acción no se puede deshacer. El elemento será eliminado permanentemente."
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border border-light-400/30 bg-white/95 backdrop-blur-sm shadow-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2 text-gray-500">
            <AlertCircle className="h-5 w-5" />
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-light-500 text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3 sm:justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-light-400/50 text-light-500 hover:bg-light-300/20 hover:text-dark-400"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className={cn(
              "gap-2 bg-white text-red-500  hover:bg-light-300/35",
              isDeleting && "opacity-80"
            )}
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <span>Eliminar</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}