'use client'

import ErrorDisplay from '@/components/ErrorDisplay'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthorCard } from '@/components/reports/AuthorCard'
import { AuthorReport } from '@/components/reports/AuthorReport'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthors } from '@/hooks/useAuthors'
import { CopyIcon, FileTextIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ReportsPage() {
  const { authors, loading, refresh, getAuthor } = useAuthors()
  const [selectedCedula, setSelectedCedula] = useState("")
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Seleccionar el primer autor al cargar la lista
  useEffect(() => {
    if (authors?.length && !selectedCedula) {
      setSelectedCedula(authors[0].cedula)
    }
  }, [authors, selectedCedula])

  // Manejar errores
  useEffect(() => {
    const handleError = (err: Error) => {
      setError(err)
      console.error("Error en página de reportes:", err)
    }

    // Establecer un manejador global de errores
    window.addEventListener('error', (e) => handleError(e.error))

    return () => {
      window.removeEventListener('error', (e) => handleError(e.error))
    }
  }, [])

  // Función para seleccionar un autor
  const selectAuthor = (cedula: string) => {
    if (cedula !== selectedCedula) {
      setSelectedCedula(cedula)
      
      // Copiar cédula al portapapeles para facilidad de uso
      navigator.clipboard.writeText(cedula)
        .then(() => toast.success("Cédula copiada al portapapeles para facilitar búsqueda"))
        .catch(() => {/* Silenciar errores de clipboard */})
      
      // Pre-cargar el autor
      getAuthor(cedula).catch(err => console.error("Error pre-cargando autor:", err))
    }
  }

  // Filtrar autores por nombre o cédula
  const filteredAuthors = searchQuery.trim() 
    ? authors?.filter(author => 
        author.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.cedula.includes(searchQuery)
      )
    : authors;

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorDisplay
          title="Error en reportes"
          message={error.message}
          retryAction={() => {
            setError(null)
            refresh()
          }}
        />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <FileTextIcon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-semibold text-white">Reportes de Autores</h1>
        </div>

        <Card className="bg-dark-300 border-dark-600">
          <CardHeader>
            <CardTitle className="text-light-200">Autores disponibles</CardTitle>
            <CardDescription className="text-light-500">
              Seleccione un autor para ver su reporte detallado. Al seleccionar un autor, 
              su cédula se copiará automáticamente para facilitar la búsqueda.
            </CardDescription>
          </CardHeader>
          <CardContent>
           
          
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-dark-400 h-16 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredAuthors?.length === 0 ? (
              <p className="text-light-500 text-center p-4">
                {searchQuery ? "No se encontraron autores que coincidan con la búsqueda" : "No hay autores disponibles en este momento"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredAuthors.map(author => (
                  <AuthorCard
                    key={author.cedula}
                    author={author}
                    isSelected={selectedCedula === author.cedula}
                    onClick={() => selectAuthor(author.cedula)}
                  />
                ))}
              </div>
            )}
            
            {selectedCedula && (
              <div className="mt-4 p-3 rounded-lg bg-dark-500/50 flex justify-between items-center">
                <div>
                  <p className="text-light-200">Autor seleccionado: {authors?.find(a => a.cedula === selectedCedula)?.nombreCompleto}</p>
                  <p className="text-light-500 text-sm flex items-center gap-1">
                    Cédula: {selectedCedula}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 rounded-full hover:bg-dark-400" 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedCedula)
                        toast.success("Cédula copiada al portapapeles")
                      }}
                    >
                      <CopyIcon className="h-3 w-3" />
                    </Button>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedCedula && <AuthorReport cedula={selectedCedula} />}
      </div>
    </ProtectedRoute>
  )
}