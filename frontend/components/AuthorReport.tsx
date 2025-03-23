'use client'

import { sampleBooks } from "@/constants"
import AuthorService from "@/services/author.service"
import { BookIcon, SearchIcon, UserIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Skeleton } from "./ui/skeleton"

interface AuthorReport {
    nombreCompleto: string
    nacionalidad: string
    libros: {
        isbn: string
        editorial: string
        genero: string
        añoPublicacion: number
    }[]
}

// Podemos recibir una cédula inicial y un callback cuando hay cambios
const AuthorReportComponent = ({ 
    initialCedula,
    onReportLoaded
}: { 
    initialCedula?: string,
    onReportLoaded?: (report: AuthorReport | null) => void
}) => {
    const [cedula, setCedula] = useState(initialCedula || "")
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState<AuthorReport | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Si recibimos una cédula inicial, cargar automáticamente
    useEffect(() => {
        if (initialCedula) {
            setCedula(initialCedula)
            handleSearch()
        }
    }, [initialCedula])

    // Cuando cambia el reporte, notificar
    useEffect(() => {
        if (onReportLoaded) {
            onReportLoaded(report)
        }
    }, [report, onReportLoaded])

    const handleSearch = async () => {
        if (!cedula.trim()) {
            setError("Ingrese una cédula para buscar")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const reportData = await AuthorService.getAuthorReport(cedula)
            setReport(reportData)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al buscar el autor")
            setReport(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="bg-dark-300 border-dark-600">
                <CardHeader>
                    <CardTitle className="text-light-200">Reporte de Autores</CardTitle>
                    <CardDescription className="text-light-500">
                        Busque un autor por cédula para ver sus libros
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <Input
                            type="text"
                            placeholder="Ingrese cédula del autor"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            className="bg-dark-400 border-dark-600 text-light-100"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-primary text-dark-100 hover:bg-primary/90"
                        >
                            <SearchIcon className="mr-2 h-4 w-4" />
                            Buscar
                        </Button>
                    </div>

                    {error && (
                        <p className="mt-4 text-red-400">{error}</p>
                    )}
                </CardContent>
            </Card>

            {loading && (
                <div className="space-y-6">
                    <Skeleton className="h-[200px] w-full bg-dark-400" />
                    <Skeleton className="h-[300px] w-full bg-dark-400" />
                </div>
            )}

            {report && (
                <div className="space-y-6">
                    <Card className="bg-dark-300 border-dark-600">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-light-200">
                                <UserIcon className="h-5 w-5 text-primary" />
                                {report.nombreCompleto}
                            </CardTitle>
                            <CardDescription className="text-light-500">
                                Nacionalidad: {report.nacionalidad}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-light-200 mb-4">
                                <BookIcon className="h-5 w-5 text-primary" />
                                Libros del autor ({report.libros.length})
                            </h3>

                            {report.libros.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {report.libros.map((libro) => {
                                        // Buscar una portada de muestra para visualización
                                        const sampleBook = sampleBooks.find(b => b.isbn === libro.isbn) || sampleBooks[0]

                                        return (
                                            <div key={libro.isbn} className="rounded-lg bg-dark-400 p-4 hover:bg-dark-500 transition-colors">
                                                {sampleBook.cover && (
                                                    <div className="mb-3 aspect-[2/3] overflow-hidden rounded-md">
                                                        <Image
                                                            src={sampleBook.cover}
                                                            alt={libro.editorial}
                                                            width={180}
                                                            height={270}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <h4 className="book-title">{libro.editorial}</h4>
                                                <p className="book-genre">{libro.genero}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Image src="/icons/star.svg" alt="año" width={16} height={16} />
                                                    <span className="text-sm text-light-100">{libro.añoPublicacion}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-light-500">Este autor no tiene libros registrados.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default AuthorReportComponent