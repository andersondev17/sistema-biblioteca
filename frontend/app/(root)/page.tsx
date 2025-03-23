'use client'
import BookList from "@/components/BookList";
import BookOverview from "@/components/book/BookOverview";
import { Button } from "@/components/ui/button";
import AuthService from "@/services/auth.service";
import AuthorService from "@/services/author.service";
import BookService from "@/services/book.service";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Datos de respaldo para desarrollo
import { authorsInfo, sampleBooks } from "@/constants";

const Home = () => {
  const router = useRouter();
  const [books, setBooks] = useState<LibroView[]>([]);
  const [authors, setAuthors] = useState<Autor[]>([]);
  const [selectedISBN, setSelectedISBN] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar autenticación sin redireccionar
        const authenticated = AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);

        // Cargar libros (permitido para todos los usuarios)
        try {
          const booksData = await BookService.getAllBooks();
          const booksWithCovers = booksData.map((book: LibroView) => ({
            ...book,
            cover: `https://picsum.photos/seed/${book.isbn}/400/600`
          }));
          setBooks(booksWithCovers);

          if (booksWithCovers.length > 0) {
            setSelectedISBN(booksWithCovers[0].isbn);
          }
        } catch (error) {
          console.error("Error cargando libros:", error);
          // En desarrollo, usar datos de muestra
          if (process.env.NODE_ENV === 'development') {
            setBooks(sampleBooks);
            setSelectedISBN(sampleBooks[0].isbn);
            toast.error("Usando datos de muestra para libros");
          } else {
            setError(true);
          }
        }

        // Cargar autores (permitido para todos los usuarios)
        try {
          const authorsData = await AuthorService.getAllAuthors();
          setAuthors(authorsData);
        } catch (error) {
          console.error("Error cargando autores:", error);
          // En desarrollo, usar datos de muestra
          if (process.env.NODE_ENV === 'development') {
            setAuthors(authorsInfo);
            toast.error("Usando datos de muestra para autores");
          } else {
            setError(true);
          }
        }
      } catch (error) {
        console.error("Error general:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Manejador para seleccionar libro
  const handleSelectBook = (isbn: string) => {
    setSelectedISBN(isbn);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejador para acciones que requieren autenticación
  const handleAuthRequiredAction = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      toast.error("Necesitas iniciar sesión para realizar esta acción");
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-light-200">Cargando catálogo...</p>
      </div>
    );
  }

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

  // Obtener el libro seleccionado y su autor
  const selectedBook = books.find(b => b.isbn === selectedISBN);
  const selectedAuthor = selectedBook
    ? authors.find(a => a.cedula === selectedBook.autorCedula)
    : null;

  return (
    <div>
      {!isAuthenticated && (
        <div className="bg-dark-600/50 rounded-lg p-4 mb-8 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-light-200">Bienvenido a la biblioteca</h3>
              <p className="text-sm text-light-100">Inicia sesión para acceder a todos los libros!</p>
            </div>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-primary text-dark-100 hover:bg-primary/90"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      )}

      {selectedBook && selectedAuthor && (
        <>
          <BookOverview
            isbn={selectedISBN}
            libro={selectedBook}
            autor={selectedAuthor}
            relatedBooks={books.filter(b =>
              b.autorCedula === selectedBook.autorCedula && b.isbn !== selectedBook.isbn
            )}
            isAuthenticated={isAuthenticated}
            onAuthRequiredAction={handleAuthRequiredAction}
          />
          <div id="booklist">
            <BookList
              title="Catálogo de Libros"
              books={books}
              authors={authors}
              containerClassname="mt-28"
              onBookSelect={handleSelectBook}
              selectedBookISBN={selectedISBN}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;