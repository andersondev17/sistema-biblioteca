'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ClipboardIcon, UserIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface AuthorCardProps {
    author: Autor
    isSelected: boolean
    onClick: () => void
}

export function AuthorCard({ author, isSelected, onClick }: AuthorCardProps) {
    const [isCopied, setIsCopied] = useState(false)

    // Copiar la cédula al portapapeles y mostrar feedback
    const copyCedula = (e: React.MouseEvent) => {
        e.stopPropagation() // Evitar que se active onClick del contenedor

        navigator.clipboard.writeText(author.cedula).then(() => {
            setIsCopied(true)
            toast.success(`Cédula ${author.cedula} copiada al portapapeles`)

            // Restaurar el estado después de 2 segundos
            setTimeout(() => setIsCopied(false), 2000)
        })
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                                ? 'bg-dark-500 ring-2 ring-primary'
                                : 'bg-dark-400 hover:bg-dark-500'
                            }`}
                        onClick={onClick}
                    >
                        <UserIcon className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-light-200 truncate">{author.nombreCompleto}</p>
                            <div className="flex items-center justify-between text-xs text-light-500">
                                <span>Cédula: {author.cedula}</span>
                                <button
                                    onClick={copyCedula}
                                    className={`p-1 rounded-md transition-colors ${isCopied ? 'bg-green-500/20 text-green-400' : 'hover:bg-dark-600 text-primary'
                                        }`}
                                    title="Copiar cédula"
                                >
                                    <ClipboardIcon className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-dark-200 text-light-100 border-dark-400">
                    <p className="font-medium">{author.nombreCompleto}</p>
                    <p className="text-xs"><span className="text-primary">Cédula:</span> {author.cedula}</p>
                    <p className="text-xs"><span className="text-primary">Nacionalidad:</span> {author.nacionalidad}</p>
                    <p className="text-xs"><span className="text-primary">Libros:</span> {author.libros?.length || 0}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}