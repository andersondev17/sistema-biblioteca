// components/AuthorReport.tsx
'use client'

import { GET_FULL_AUTHORS_REPORT } from '@/graphql/queries/author.query'
import AuthService from '@/services/auth.service'
import { useLazyQuery } from '@apollo/client'
import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Skeleton } from "./ui/skeleton"

const AuthorReportComponent = ({ initialCedula }: { initialCedula?: string }) => {
    const [cedula, setCedula] = useState(initialCedula || "")
    const [userToken, setUserToken] = useState<string | null>(null)
    const [getReport, { loading, error, data }] = useLazyQuery(GET_FULL_AUTHORS_REPORT, {
        context: {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        },
        variables: userToken ? {} : {}
    })

    useEffect(() => {
        const token = AuthService.getToken()
        if (!token) window.location.href = '/login'
        setUserToken(token)
    }, [])

    useEffect(() => {
        if (initialCedula && userToken) {
            getReport({ variables: { cedula: initialCedula } })
        }
    }, [initialCedula, userToken])

    const handleSearch = () => {
        if (!cedula.trim()) return
        getReport({ variables: { cedula } })
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
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

                    {error && <p className="mt-4 text-red-400">{error.message}</p>}
                </CardContent>
            </Card>

            {loading && (
                <div className="space-y-6">
                    <Skeleton className="h-[200px] w-full bg-dark-400" />
                    <Skeleton className="h-[300px] w-full bg-dark-400" />
                </div>
            )}

            {data?.autores?.find((a : Autor) => a.cedula === cedula)?.libros && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold">{data.autores.find((a : Autor) => a.cedula === cedula)?.nombreCompleto}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {data.autores.find((a : Autor) => a.cedula === cedula)?.libros.map((libro: any) => (
                            <div key={libro.isbn} className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-semibold">{libro.editorial}</h3>
                                <p className="text-sm text-gray-600">Año: {libro.anoPublicacion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AuthorReportComponent