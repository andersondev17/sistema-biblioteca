'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthorReport } from "@/hooks/useAuthorReport"
import { BookIcon, ClipboardIcon, FileTextIcon, SearchIcon, UserIcon } from "lucide-react"
import Image from "next/image"
import { FC, useEffect, useState } from "react"
import { toast } from "sonner"

interface AuthorReportProps {
    cedula?: string
}

export const AuthorReport: FC<AuthorReportProps> = ({ cedula }) => {
    const { author, loading, error, searchCedula, setSearchCedula, handleSearch, handleKeyDown } = useAuthorReport(cedula)
    const [state, setState] = useState({
        loading: true,
        error: null as Error | null
    });
    // Efecto para manejar cuando cambia la cédula prop
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: new Error("Tiempo de espera agotado")
                }));
            }
        }, 10000); // 10 segundos de timeout

        return () => clearTimeout(timer);
    }, [loading]);

    // Función para copiar la cédula al portapapeles
    const copyCedula = () => {
        if (author?.cedula) {
            navigator.clipboard.writeText(author.cedula)
                .then(() => toast.success("Cédula copiada al portapapeles"))
                .catch(() => toast.error("No se pudo copiar la cédula"))
        }
    }

    // Función para determinar el estado de UI basado en loading/error/author
    const getContentState = () => {
        if (loading) return 'loading'
        if (error) return 'error'
        if (author) return 'success'
        return 'empty'
    }

    // Estado de la UI actual
    const contentState = getContentState()

    return (
        <div className="space-y-6">
            <Card className="bg-dark-300 border-dark-600">
                <CardHeader>
                    <CardTitle className="text-light-200 flex items-center gap-2">
                        <FileTextIcon className="h-5 w-5 text-primary" />
                        Reporte de Autores
                    </CardTitle>
                    <CardDescription className="text-light-500">
                        Busque un autor por cédula para ver sus libros
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <Input
                            type="text"
                            placeholder="Ingrese cédula del autor"
                            value={searchCedula}
                            onChange={(e) => setSearchCedula(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-dark-400 border-dark-600 text-light-100"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={loading || !searchCedula.trim()}
                            className="bg-primary text-dark-100 hover:bg-primary/90"
                        >
                            {loading ? 'Buscando...' : (
                                <>
                                    <SearchIcon className="mr-2 h-4 w-4" />
                                    Buscar
                                </>
                            )}
                        </Button>
                    </div>

                    {contentState === 'error' && (
                        <div className="mt-4 bg-red-500/10 border border-red-400/20 rounded-md p-3">
                            <p className="text-red-400 flex items-start gap-2">
                                <span className="text-red-400">⚠️</span>
                                {error?.message || "Error al realizar la búsqueda"}
                            </p>
                            <p className="text-xs text-red-400/70 mt-1">
                                Verifique si la cédula ingresada es correcta e intente nuevamente
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {contentState === 'loading' && (
                <Card className="bg-dark-300 border-dark-600 overflow-hidden">
                    <CardHeader>
                        <Skeleton className="h-7 w-48 bg-dark-400" />
                        <Skeleton className="h-4 w-72 bg-dark-400 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-40 bg-dark-400 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-dark-400 rounded-lg overflow-hidden">
                                    <Skeleton className="h-56 w-full bg-dark-400/60" />
                                    <div className="p-3">
                                        <Skeleton className="h-5 w-3/4 bg-dark-400/60 mb-2" />
                                        <Skeleton className="h-4 w-1/2 bg-dark-400/60" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {contentState === 'success' && author && (
                <Card className="bg-dark-300 border-dark-600">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-light-200">
                            <UserIcon className="h-5 w-5 text-primary" />
                            {author.nombreCompleto}
                        </CardTitle>
                        <CardDescription className="text-light-500 flex items-center gap-2">
                            <span>Nacionalidad: {author.nacionalidad}</span>
                            <span className="mx-1">•</span>
                            <span className="flex items-center gap-1">
                                Cédula: {author.cedula}
                                <button
                                    onClick={copyCedula}
                                    className="p-1 rounded-md hover:bg-dark-500 transition-colors"
                                    title="Copiar cédula"
                                >
                                    <ClipboardIcon className="h-3.5 w-3.5 text-primary" />
                                </button>
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-light-200 mb-4">
                            <BookIcon className="h-5 w-5 text-primary" />
                            Libros del autor ({author.libros?.length || 0})
                        </h3>

                        {author.libros?.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {author.libros.map((libro) => (
                                    <div key={libro.isbn} className="rounded-lg bg-dark-400 p-4 hover:bg-dark-500 transition-colors">
                                        <div className="mb-3 aspect-[2/3] overflow-hidden rounded-md">
                                            <Image
                                                src={libro.cover || `https://picsum.photos/seed/${libro.isbn}/300/450`}
                                                alt={libro.editorial}
                                                width={180}
                                                height={270}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <h4 className="text-light-200 truncate font-medium">{libro.editorial}</h4>
                                        <p className="text-light-500 text-sm italic">{libro.genero || "No especificado"}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-sm text-light-100">Año: {libro.anoPublicacion}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-light-500 text-center p-4 bg-dark-400/50 rounded-lg">
                                Este autor no tiene libros registrados
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}