'use client'

import AuthorReport from '@/components/AuthorReport'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import AuthorService from '@/services/author.service'
import { FileText, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const ReportsPage = () => {
  const [authors, setAuthors] = useState<Autor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCedula, setSelectedCedula] = useState("")
  const reportRef = useRef<any>(null)

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await AuthorService.getAllAuthors()
        setAuthors(data)
      } catch (err) {
        console.error('Error al cargar autores:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthors()
  }, [])

  const handleAuthorSelect = (cedula: string) => {
    setSelectedCedula(cedula)
  }

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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {authors.map(author => (
                  <div 
                    key={author.cedula} 
                    className={`flex items-center gap-2 p-3 rounded-lg ${selectedCedula === author.cedula ? 'bg-dark-500 ring-2 ring-primary' : 'bg-dark-400 hover:bg-dark-500'} transition-colors cursor-pointer`}
                    onClick={() => handleAuthorSelect(author.cedula)}
                  >
                    <User className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-light-200 truncate">{author.nombreCompleto}</p>
                      <p className="text-xs text-light-500">Cédula: {author.cedula}</p>
                    </div>
                  </div>
                ))}
                
                {authors.length === 0 && (
                  <div className="col-span-full p-4 text-light-500 text-center">
                    No hay autores disponibles
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* reporte con la cédula seleccionada */}
        <AuthorReport 
          initialCedula={selectedCedula} 
          
        />
      </div>
    </ProtectedRoute>
  )
}

export default ReportsPage