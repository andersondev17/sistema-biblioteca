// page.tsx - Versión Corregida
'use client'

import AuthorReport from '@/components/AuthorReport'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { GET_FULL_AUTHORS_REPORT } from '@/graphql/queries/author.query'
import AuthService from '@/services/auth.service'
import { useQuery } from '@apollo/client'
import { FileText, User } from 'lucide-react'
import { useEffect, useState } from 'react'

const ReportsPage = () => {
  const [selectedCedula, setSelectedCedula] = useState("")
  const [userToken, setUserToken] = useState<string | null>(null)

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const token = AuthService.getToken()
    const user = AuthService.getCurrentUser()
    
    if (!token || !user) {
      window.location.href = '/login'
      return
    }
    
    setUserToken(token)
  }, [])

  const { loading, error, data } = useQuery(GET_FULL_AUTHORS_REPORT, {
    context: {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    },
    skip: !userToken // Evitar consulta sin token
  })

  const handleAuthorSelect = (cedula: string) => {
    setSelectedCedula(cedula)
  }

  if (!userToken) return null // Evitar renderizado innecesario

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-semibold text-white">Reportes de Autores</h1>
        </div>

        <Card className="bg-dark-300 border-dark-600">
          <CardHeader>
            <CardTitle className="text-light-200">Autores disponibles</CardTitle>
            <CardDescription className="text-light-500">
              Seleccione un autor para ver su reporte o busque por cédula
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-16 w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-0.75rem)] bg-dark-400" />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-400">Error cargando autores: {error.message}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data?.autores.map((author: Autor) => (
                  <div
                    key={author.cedula}
                    className={`flex items-center gap-2 p-3 rounded-lg ${selectedCedula === author.cedula
                        ? 'bg-dark-500 ring-2 ring-primary'
                        : 'bg-dark-400 hover:bg-dark-500'
                      } transition-colors cursor-pointer`}
                    onClick={() => handleAuthorSelect(author.cedula)}
                  >
                    <User className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-light-200 truncate">{author.nombreCompleto}</p>
                      <p className="text-xs text-light-500">Cédula: {author.cedula}</p>
                    </div>
                  </div>
                ))}

                {data?.autores.length === 0 && (
                  <div className="col-span-full p-4 text-light-500 text-center">
                    No hay autores disponibles
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <AuthorReport initialCedula={selectedCedula} />
      </div>
    </ProtectedRoute>
  )
}

export default ReportsPage