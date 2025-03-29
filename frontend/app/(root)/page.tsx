// app/page.tsx
'use client';

import BookList from "@/components/BookList";
import BookOverview from "@/components/book/BookOverview";
import { Button } from "@/components/ui/button";
import { useHome } from "@/hooks/useHome";
import { memo } from "react";

const Home = () => {
  const { books, authors, selectedBook, selectedAuthor, selectedISBN, relatedBooks, loading, error, isAuthenticated, selectBook, handleAuthRequiredAction
  } = useHome();

  // Estado de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-light-200">Cargando catálogo...</p>
      </div>
    );
  }

  // Estado de error
  if (error || (books.length === 0 && authors.length === 0)) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl text-light-200 mb-4">Error de conexión</h2>
        <p className="text-light-100 mb-6">No se pudieron cargar los datos del servidor.</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary text-dark-100"
        >
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Banner para usuarios no autenticados */}
      {!isAuthenticated && (
        <div className="bg-dark-600/50 rounded-lg p-4 mb-8 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-light-200">Bienvenido a la biblioteca</h3>
              <p className="text-sm text-light-100">Inicia sesión para acceder a todos los libros!</p>
            </div>
            <Button
              onClick={() => window.location.href = '/login'}
              className="bg-primary text-dark-100 hover:bg-primary/90"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {selectedBook && selectedAuthor && (
        <>
          <BookOverview
            isbn={selectedISBN}
            libro={selectedBook}
            autor={selectedAuthor}
            relatedBooks={relatedBooks}
            isAuthenticated={isAuthenticated}
            onAuthRequiredAction={handleAuthRequiredAction}
          />

          <div id="booklist">
            <BookList
              title="Catálogo de Libros"
              books={books}
              authors={authors}
              containerClassname="mt-28"
              onBookSelect={selectBook}
              selectedBookISBN={selectedISBN}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default memo(Home);